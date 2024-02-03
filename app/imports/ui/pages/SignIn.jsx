import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Alert, Card, Col, Container, Row } from 'react-bootstrap';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { EnvelopeFill, KeyFill } from 'react-bootstrap-icons';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { PAGE_IDS } from '../utilities/PageIDs';
/**
 * Signin page overrides the form’s submit event and call Meteor’s loginWithPassword().
 * Authentication errors modify the component’s state to be displayed
 */
const SignIn = () => {
  const [error, setError] = useState('');
  const [redirect, setRedirect] = useState(false);
  const schema = new SimpleSchema({
    // username: String,
    email: String,
    password: String,
  });
  const bridge = new SimpleSchema2Bridge(schema);

  // Handle Signin submission using Meteor's account mechanism.
  const submit = (doc) => {
    // console.log('submit', doc, redirect);
    const { email, password } = doc;
    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        setError(err.reason);
      } else {
        setRedirect(true);
      }
    });
    // console.log('submit2', email, password, error, redirect);
  };

  // Render the signin form.
  // console.log('render', error, redirect);
  // if correct authentication, redirect to page instead of login screen
  if (redirect) {
    return (<Navigate to="/" />);
  }
  // Otherwise return the Login form.
  return (
    <Container id={PAGE_IDS.SIGN_IN} fluid className="py-3" style={{ height: '760px' }}>
      <Row className="justify-content-center align-items-center h-100">
        <Col xs={5}>
          <Col className="text-center">
            <h2>Login to your Voluntree account</h2>
          </Col>
          <AutoForm schema={bridge} onSubmit={data => submit(data)}>
            <Card>
              <Card.Body>
                <EnvelopeFill size={30} />
                <TextField id={COMPONENT_IDS.SIGN_IN_FORM_EMAIL} name="email" placeholder="Enter your email address" />
                <KeyFill size={30} />
                <TextField id={COMPONENT_IDS.SIGN_IN_FORM_PASSWORD} name="password" placeholder="Enter your password" type="password" />
                <ErrorsField />
                <SubmitField id={COMPONENT_IDS.SIGN_IN_FORM_SUBMIT} />
              </Card.Body>
            </Card>
          </AutoForm>
          <Alert variant="light">
            <Link to="/signup">Click here to Register</Link>
          </Alert>
          {error === '' ? (
            ''
          ) : (
            <Alert variant="danger">
              <Alert.Heading>Login was not successful</Alert.Heading>
              {error}
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default SignIn;
