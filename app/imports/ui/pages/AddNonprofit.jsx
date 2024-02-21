import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, HiddenField, SelectField, SubmitField, TextField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { Nonprofits } from '../../api/nonprofit/NonprofitCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { PAGE_IDS } from '../utilities/PageIDs';
import FileField from '../components/FileField';
import { DBSchemaNonprofit } from '../../api/schema/DBSchemas';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

const bridge = new SimpleSchema2Bridge(DBSchemaNonprofit);

const AddNonprofit = () => {
  const [imageFile, setImageFile] = useState(null);
  let fRef = null;

  const handleImageChange = (file) => {
    setImageFile(file);
  };

  const submit = (data) => {
    const { picture, ...nonprofitData } = data;
    const concat = Object.values(nonprofitData).join(' ');
    const insertProfile = (finalData) => {
      const collectionName = Nonprofits.getCollectionName();
      defineMethod.callPromise({ collectionName, definitionData: finalData })
        .then(() => swal('Success', 'Nonprofit added successfully', 'success'))
        .catch(error => swal('Error', error.message, 'error'));
      fRef.reset();
    };

    // Check for inappropriate content
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
              const finalData = { ...nonprofitData, picture: imageUrl }; // Incorporate image URL
              insertProfile(finalData);
            }
          });
        };
        reader.readAsDataURL(imageFile);
      } else {
        insertProfile(nonprofitData);
      }
    });
  };

  return (
    <Container id={PAGE_IDS.ADD_NONPROFIT} className="py-3">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={5}>
          <h2 className="text-center">Add Nonprofit</h2>
          <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => submit(data)}>
            <Card>
              <Card.Body>
                <Row>
                  <Col>
                    <SelectField name="type" placeholder="Please select" />
                    <TextField name="name" />
                    <TextField name="mission" />
                    <TextField name="contactInfo" />
                    <TextField name="location" />
                    <HiddenField name="createdAt" value={new Date()} />
                  </Col>
                </Row>
                <div className="mb-3">
                  <FileField name="picture" onChange={handleImageChange} />
                </div>
                <ErrorsField />
                <HiddenField name="owner" value={Meteor.userId()} />
                <SubmitField id={COMPONENT_IDS.NONPROFIT_ADD_SUBMIT_BTN} value="Submit" />
              </Card.Body>
            </Card>
          </AutoForm>
        </Col>
      </Row>
    </Container>
  );
};

export default AddNonprofit;
