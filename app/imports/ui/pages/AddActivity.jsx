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
  createdAt: Date,
  benefits: String,
  location: String,
  frequency: String,
  requirement: String,
  contactInfo: String,
  image: { type: String, optional: true },
  owner: String,
});

const bridge = new SimpleSchema2Bridge(formSchema);

const AddActivity = () => {
  const [imageFile, setImageFile] = useState(null);
  let fRef = null;

  const handleImageChange = (file) => {
    setImageFile(file);
  };

  const submit = (data) => {
    const { image, ...activityData } = data;
    const concat = Object.values(data).join(' ');
    // eslint-disable-next-line no-shadow
    const insertProfile = (activityData) => {
      const { time, name, details, createdAt, benefits, location, frequency, requirement, contactInfo, owner } = activityData;
      const collectionName = Activity.getCollectionName();
      const definitionData = { time, name, details, createdAt, benefits, location, frequency, requirement, contactInfo, image, owner };
      defineMethod.callPromise({ collectionName, definitionData })
        .catch(error => swal('Error', error.message, 'error'))
        .then(() => {
          swal('Success', 'Item added successfully', 'success');
        });
    };
    Meteor.call('textCheck', concat, (error) => {
      if (error) {
        swal('Error', 'Inappropriate Content Detected', 'error');
        return;
      }
      if (imageFile) {
        const reader = new FileReader();
        reader.onloadend = function () {
          const fileData = reader.result;

          Meteor.call('uploadImage', fileData, (err, imageUrl) => {
            if (err) {
              swal('Error', 'Failed to upload image.', 'error');
            } else {
              activityData.image = imageUrl;
              insertProfile(activityData);
            }
          });
        };
        reader.readAsDataURL(imageFile);
      } else {
        insertProfile(activityData);
      }
    });
  };

  return (
    <div>
      <Container className="py-3">
        <Row className="justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
          <Col xs={5}>
            <Col className="text-center"><h2>Add Activity</h2></Col>
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
                  <HiddenField name="owner" value={Meteor.user().username} />
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
