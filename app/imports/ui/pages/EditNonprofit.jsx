import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, DateField, ErrorsField, HiddenField, SelectField, SubmitField, TextField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { useTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router';
import { DBSchemaNonprofit } from '../../api/schema/DBSchemas';
import { Nonprofits } from '../../api/nonprofit/NonprofitCollection';
import { removeItMethod, updateMethod } from '../../api/base/BaseCollection.methods';
import { PAGE_IDS } from '../utilities/PageIDs';
import LoadingSpinner from '../components/LoadingSpinner';

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = DBSchemaNonprofit;

const bridge = new SimpleSchema2Bridge(formSchema);

/* Renders the AddStuff page for adding a document. */
const EditNonprofit = () => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const { _id } = useParams();
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { doc, ready } = useTracker(() => {
    // Get access to Stuff documents.
    const subscription = Nonprofits.subscribeNonprofit();
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the document
    const document = Nonprofits.findDoc(_id);
    return {
      doc: document,
      ready: rdy,
    };
  }, [_id]);
  // On submit, insert the data.
  const submit = (data) => {
    const { type, name, mission, contactInfo, location, createdAt, picture } = data;
    const collectionName = Nonprofits.getCollectionName();
    const updateData = { id: _id, type, name, mission, contactInfo, location, createdAt, picture };
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => swal('Success', `${type} added successfully`, 'success'));
  };

  // On delete, remove the instance of nonprofit.
  // const delete = () => {
  //   const collectionName = Nonprofits.getCollectionName();
  //   removeItMethod.callPromise({ collectionName,  })
  // };

  return ready ? (
    <Container id={PAGE_IDS.EDIT_NONPROFIT} className="py-3">
      <Row className="justify-content-center">
        <Col xs={5}>
          <Col className="text-center"><h2>Add Nonprofit</h2></Col>
          <AutoForm schema={bridge} onSubmit={data => submit(data)} model={doc}>
            <Card>
              <Card.Body>
                <Row>
                  <SelectField name="type" />
                  <TextField name="name" />
                </Row>
                <Row>
                  <TextField name="mission" />
                  <TextField name="contactInfo" />
                </Row>
                <Row>
                  <DateField name="createdAt" />
                  <TextField name="picture" />
                </Row>
                <SubmitField value="Submit" />
                <ErrorsField />
                <HiddenField name="owner" />
              </Card.Body>
            </Card>
          </AutoForm>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default EditNonprofit;
