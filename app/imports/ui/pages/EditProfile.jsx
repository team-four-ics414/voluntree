import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, LongTextField, SubmitField, TextField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { useNavigate } from 'react-router-dom';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { useParams } from 'react-router-dom';
import { useTracker } from '../../../.meteor/local/build/programs/server/assets/packages/react-meteor-data/react-meteor-data';

/// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  firstName: String,
  lastName: String,
  email: String,
  picture: String,
  interest: String,
  role: {
    type: String,
    allowedValues: ['USER', 'ADMIN'],
    defaultValue: 'USER',
  },
});

const bridge = new SimpleSchema2Bridge(formSchema);

/* Renders the EditProfile page for editing a single document. */
const EditProfile = () => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const { _id } = useParams();
  // console.log('EditProfile', _id);
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { doc, ready } = useTracker(() => {
    // Get access to Profile documents.
    const subscription = Meteor.subscribe(UserProfiles.userPublicationName);
    console.log(subscription);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the document
    const document = UserProfiles.collection.findOne(_id);
    return {
      doc: document,
      ready: rdy,
    };
  }, [_id]);
  // console.log('EditProfile', doc, ready);
  // On successful submit, insert the data.

  const submit = (data, formRef) => {
    const owner = Meteor.user().username;
    const userID = Meteor.userId();
    const role = data.role || 'USER';

    Meteor.call('userProfiles.update', { ...data, owner, userID, role }, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Your profile has updated successfully', 'success');
        formRef.reset();
        redirect('/home');
      }
    });
  };

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={10}>
          <Col className="text-center"><h2>Edit Profile</h2></Col>
          {/* eslint-disable-next-line no-undef */}
          <AutoForm ref={(ref) => { formRef = ref; }} schema={bridge} onSubmit={data => submit(data, formRef)}>
            <Card>
              <Card.Body>
                <Row>
                  <Col><TextField name="firstName" /></Col>
                  <Col><TextField name="lastName" /></Col>
                </Row>
                <Row>
                  <Col><TextField name="email" /></Col>
                </Row>
                <Row>
                  <Col><TextField name="picture" /></Col>
                </Row>
                <LongTextField name="interest" />
                <SubmitField />
                <ErrorsField />
              </Card.Body>
            </Card>
          </AutoForm>
        </Col>
      </Row>
    </Container>
  );
};

export default EditProfile;
