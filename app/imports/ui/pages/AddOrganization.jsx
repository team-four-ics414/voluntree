import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { AutoForm, ErrorsField, HiddenField, LongTextField, SubmitField, TextField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import FileField from '../components/FileField';
import { Organizations } from '../../api/organization/Organization';
import { defineMethod } from '../../api/base/BaseCollection.methods';

const bridge = new SimpleSchema2Bridge(Organizations.schema);

const AddOrganization = () => {
  const [imageFile, setImageFile] = useState(null);
  let fRef = null;

  const handleImageChange = (file) => {
    setImageFile(file);
  };

  const submit = (data) => {
    const { image, ...profileData } = data;
    // eslint-disable-next-line no-shadow
    const insertProfile = (profileData) => {
      const collectionName = Organizations.name;
      defineMethod.callPromise({ collectionName, profileData })
        .catch(error => swal('Error', error.message, 'error'))
        .then(() => {
          swal('Success', 'Item added successfully', 'success');
          fRef.reset();
        });
    };
    Meteor.call('textCheck', profileData.mission, (error) => {
      if (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        swal('Error', 'Inappropriate Content in Mission', 'error');
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
              profileData.image = imageUrl;
              insertProfile(profileData);
            }
          });
        };
        reader.readAsDataURL(imageFile);
      } else {
        insertProfile(profileData);
      }
    });
  };

  return (
    <div>
      <Container className="py-3">
        <Row className="justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
          <Col xs={5}>
            <Col className="text-center"><h2>Add Organization</h2></Col>
            <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => submit(data, fRef)}>
              <Card style={{ backgroundColor: 'white', border: 'none' }}>
                <Card.Body>
                  <TextField inputClassName="border-dark" name="name" />
                  <TextField inputClassName="border-dark" name="location" />
                  <TextField inputClassName="border-dark" name="contactInfo" />
                  <div className="mb-3">
                    <FileField name="image" onChange={handleImageChange} />
                  </div>
                  <LongTextField inputClassName="border-dark" name="mission" />
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

export default AddOrganization;
