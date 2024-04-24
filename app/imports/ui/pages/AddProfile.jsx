import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, LongTextField, SubmitField, TextField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { useNavigate } from 'react-router-dom';

// Create a schema to specify the structure of the data to appear in the form.
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

const AddProfile = () => {
  const redirect = useNavigate();

  const submit = (data, formRef) => {
    const owner = Meteor.user().username;
    const userID = Meteor.userId();
    const role = data.role || 'USER';

    Meteor.call('userProfiles.insert', { ...data, owner, userID, role }, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Profile added successfully', 'success');
        formRef.reset();
        redirect('/home');
      }
    });
  };

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={10}>
          <Col className="text-center"><h2>Add Profile</h2></Col>
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

export default AddProfile;
