import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { AutoForm, ErrorsField, HiddenField, SubmitField, TextField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import FileField from '../components/FileField';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { Activity } from '../../api/activities/ActivityCollection';

const formSchema = new SimpleSchema({
  time: String,
  name: String,
  details: String,
  createdAt: {
    type: Date,
    defaultValue: new Date(), // Ensure default value for createdAt
  },
  benefits: String,
  location: String,
  frequency: String,
  requirement: String,
  contactInfo: String,
  image: {
    type: String,
    optional: true, // Ensure this matches your database schema and it's truly optional
  },
  owner: {
    type: String,
    defaultValue: () => Meteor.userId(), // Ensure default value for owner
  },
});

const bridge = new SimpleSchema2Bridge(formSchema);

const AddActivity = () => {
  const [imageFile, setImageFile] = useState(null);
  let fRef = null;

  const handleImageChange = (file) => {
    setImageFile(file);
  };

  const submit = (data) => {
    const { image, ...activityData } = data; // Initially exclude image from activityData

    // Concatenate all text fields for textCheck
    const concat = Object.values(activityData).join(' ');

    // Define the insert function
    const insertProfile = (finalData) => {
      const collectionName = Activity.getCollectionName();
      defineMethod.callPromise({ collectionName, definitionData: finalData })
        .then(() => swal('Success', 'Item added successfully', 'success'))
        .catch(error => swal('Error', error.message, 'error'));
      fRef.reset();
    };

    // Check for inappropriate content
    Meteor.call('textCheck', concat, (error) => {
      if (error) {
        swal('Error', 'Inappropriate Content Detected', 'error');
        return;
      }
      // Handle image upload if file is selected
      if (imageFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const fileData = reader.result;
          Meteor.call('uploadImage', fileData, (err, imageUrl) => {
            if (err) {
              swal('Error', 'Failed to upload image.', 'error');
            } else {
              const finalData = { ...activityData, image: imageUrl }; // Incorporate image URL
              insertProfile(finalData); // Insert with image URL
            }
          });
        };
        reader.readAsDataURL(imageFile);
      } else {
        insertProfile(activityData); // Insert without image URL
      }
    });
  };

  return (
    <div>
      <Container className="py-3">
        <Row className="justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
          <Col xs={12} md={8} lg={5}>
            <h2 className="text-center">Add Activity</h2>
            <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => submit(data, fRef)}>
              <Card style={{ backgroundColor: 'white', border: 'none' }}>
                <Card.Body>
                  <Row>
                    <Col>
                      <TextField inputClassName="border-dark" name="time" />
                      <TextField inputClassName="border-dark" name="name" />
                      <TextField inputClassName="border-dark" name="details" />
                      <TextField inputClassName="border-dark" name="benefits" />
                    </Col>
                    <Col>
                      <TextField inputClassName="border-dark" name="frequency" />
                      <TextField inputClassName="border-dark" name="requirement" />
                      <TextField inputClassName="border-dark" name="location" />
                      <TextField inputClassName="border-dark" name="contactInfo" />
                    </Col>
                  </Row>
                  <div className="mb-3">
                    <FileField name="image" onChange={handleImageChange} />
                  </div>
                  <ErrorsField />
                  <SubmitField inputClassName="p-2 bg-white border-1 rounded-1 mt-1" value="Submit" />
                  <HiddenField name="createdAt" value={new Date()} />
                  <HiddenField name="owner" value={Meteor.userId()} />
                </Card.Body>
              </Card>
            </AutoForm>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AddActivity;
