import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, DateField, ErrorsField, SelectField, SubmitField, TextField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { DBSchemaNonprofit } from '../../api/schema/DBSchemas';
import { Nonprofits } from '../../api/nonprofit/NonprofitCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = DBSchemaNonprofit;

const bridge = new SimpleSchema2Bridge(formSchema);

/* Renders the AddStuff page for adding a document. */
const AddNonprofit = () => {

  // On submit, insert the data.
  const submit = (data, formRef) => {
    const { type, name, mission, contactInfo, location, createdAt, picture } = data;
    const owner = Meteor.user().username;
    const collectionName = Nonprofits.getCollectionName();
    const definitionData = { type, name, mission, contactInfo, location, createdAt, owner, picture };
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', `${type} added successfully`, 'success');
        formRef.reset();
      });
  };

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  let fRef = null;
  return (
    <Container id={PAGE_IDS.ADD_NONPROFIT} className="py-3">
      <Row className="justify-content-center">
        <Col xs={5}>
          <Col className="text-center"><h2>Add Nonprofit</h2></Col>
          <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => submit(data, fRef)}>
            <Card>
              <Card.Body>
                <Row>
                  <SelectField name="type" placeholder="Please select" />
                  <TextField name="name" />
                </Row>
                <Row>
                  <TextField name="mission" />
                  <TextField name="contactInfo" />
                </Row>
                <Row>
                  <DateField name="createdAt" />
                  <TextField name="picture">Picture URL</TextField>
                </Row>
                <SubmitField id={COMPONENT_IDS.NONPROFIT_ADD_SUBMIT_BTN} value="Submit" />
                <ErrorsField />
              </Card.Body>
            </Card>
          </AutoForm>
        </Col>
      </Row>
    </Container>
  );
};

export default AddNonprofit;
