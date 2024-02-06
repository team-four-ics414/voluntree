import React from 'react';
import { Button, Card, Col, Container, Row, Image } from 'react-bootstrap';
import { AutoForm, DateField, TextField } from 'uniforms-bootstrap5';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { useTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router';
import { DBSchemaNonprofit } from '../../api/schema/DBSchemas';
import { Nonprofits } from '../../api/nonprofit/NonprofitCollection';
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

  return ready ? (
    <Container id={PAGE_IDS.VIEW_NONPROFIT} className="py-3">
      <Button href="/nonprofits">Go Back</Button>
      <Row className="justify-content-center">
        <Col xs={5}>
          <Col className="text-center"><h2>View {doc.name}</h2></Col>
          <AutoForm schema={bridge} model={doc}>
            <Card>
              <Card.Body>
                <Row>
                  <Image src={doc.picture} style={{ height: '200px', width: 'auto', margin: 'auto' }} rounded />
                  <TextField name="name" disabled />
                </Row>
                <Row>
                  <TextField name="mission" disabled />
                </Row>
                <Row>
                  <TextField name="contactInfo" disabled />
                  <DateField name="createdAt" disabled />
                </Row>
                <Button disabled>Get in touch</Button>
              </Card.Body>
            </Card>
          </AutoForm>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default EditNonprofit;
