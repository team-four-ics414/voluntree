import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { AutoForm, ErrorsField, HiddenField, TextField } from 'uniforms-bootstrap5';
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
    defaultValue: new Date(),
  },
  benefits: String,
  frequency: String,
  requirement: String,
  contactInfo: String,
  image: {
    type: String,
    optional: true,
  },
  owner: {
    type: String,
    defaultValue: () => Meteor.userId(),
  },
});

const bridge = new SimpleSchema2Bridge(formSchema);

const AddActivity = () => {
  const [imageFile, setImageFile] = useState(null);
  const [location, setLocation] = useState(null);
  let fRef = null;

  useEffect(() => {
    const loadGooglePlacesScript = document.createElement('script');
    loadGooglePlacesScript.src = 'https://maps.googleapis.com/maps/api/js?key=YOUR-KEY-HERE&libraries=places';
    document.body.appendChild(loadGooglePlacesScript);

    loadGooglePlacesScript.onload = () => {
      // eslint-disable-next-line no-use-before-define
      initializeAutocomplete();
    };
  }, []);

  const initializeAutocomplete = () => {
    const input = document.getElementById('location');
    // eslint-disable-next-line no-undef
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      setLocation({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    });
  };

  const handleImageChange = (file) => {
    setImageFile(file);
  };

  const submit = (data) => {
    const { image, ...activityData } = data;
    const concat = Object.values(activityData).join(' ');

    const insertProfile = (finalData) => {
      const collectionName = Activity.getCollectionName();
      defineMethod.callPromise({ collectionName, definitionData: finalData })
        .then(() => {
          swal('Success', 'Item added successfully', 'success');
          fRef.reset();
        })
        .catch(error => swal('Error', error.message, 'error'));
    };

    Meteor.call('textCheck', concat, (error) => {
      if (error) {
        swal('Error', 'Inappropriate Content Detected', 'error');
        return;
      }

      if (imageFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const fileData = reader.result;
          Meteor.call('uploadImage', fileData, (err, imageUrl) => {
            if (err) {
              swal('Error', 'Failed to upload image.', 'error');
            } else {
              const finalData = { ...activityData, image: imageUrl, location }; //
              insertProfile(finalData);
            }
          });
        };
        reader.readAsDataURL(imageFile);
      } else {
        const finalData = { ...activityData, location };
        insertProfile(finalData);
      }
    });
  };

  return (
    <div>
      <Container className="py-3">
        <Row className="justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
          <Col xs={12} md={8} lg={5}>
            <Card style={{ backgroundColor: '#65b9a6', padding: '10px', borderBottomRightRadius: '0px', borderBottomLeftRadius: '0px' }}>
              <h2 className="add-activity">Add Activity</h2>
            </Card>
            <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={submit}>
              <Card style={{ backgroundColor: '#eaf6ff', padding: '20px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', borderRadius: '10px', borderTopRightRadius: '0px', borderTopLeftRadius: '0px' }}>
                <Card.Body>
                  <Row>
                    <Col>
                      <TextField className="border-light-blue" name="time" />
                      <TextField className="border-light-blue" name="name" />
                      <TextField className="border-light-blue" name="details" />
                      <TextField className="border-light-blue" name="benefits" />
                    </Col>
                    <Col>
                      <TextField className="border-light-blue" name="frequency" />
                      <TextField className="border-light-blue" name="requirement" />
                      <TextField className="border-light-blue" name="contactInfo" />
                      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                      <label className="border-light-blue" htmlFor="location">Location</label>
                      <input type="text" id="location" className="form-control border-light-blue" />
                    </Col>
                  </Row>
                  <div className="mb-3">
                    <FileField name="image" onChange={handleImageChange} />
                  </div>
                  <ErrorsField />
                  <button type="submit" className="submit-button">Submit</button>
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
