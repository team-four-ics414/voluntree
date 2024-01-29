import React, { useState } from 'react';
import { Navigate } from 'react-router';
import { Link } from 'react-router-dom';
import { Alert, Card, Col, Container, Row } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { EnvelopeFill, KeyFill, PersonFill } from 'react-bootstrap-icons';

/**
 * SignUp component is similar to signin component, but we create a new user instead.
 */
const SignUp = () => {
  const [error, setError] = useState('');
  const [redirectToReferer, setRedirectToRef] = useState(false);

  const schema = new SimpleSchema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
  });
  const bridge = new SimpleSchema2Bridge(schema);

  /* Handle SignUp submission. Create user account and a profile entry, then redirect to the home page. */
  const submit = (doc) => {
    const collectionName = UserProfiles.getCollectionName();
    const definitionData = doc;
    // create the new UserProfile
    defineMethod.callPromise({ collectionName, definitionData })
      .then(() => {
        // log the new user in.
        const { email, password } = doc;
        Meteor.loginWithPassword(email, password, (err) => {
          if (err) {
            setError(err.reason);
          } else {
            setError('');
            setRedirectToRef(true);
          }
        });
      })
      .catch((err) => setError(err.reason));
  };

  /* Display the signup form. Redirect to add page after successful registration and login. */
  // if correct authentication, redirect to from: page instead of signup screen
  if (redirectToReferer) {
    return <Navigate to="/add" />;
  }
  return (
    <Container id={PAGE_IDS.SIGN_UP} className="py-3">
      <Row className="justify-content-center">
        <Col xs={5}>
          <Col className="text-center">
            <h2>Register your account</h2>
          </Col>
          <AutoForm schema={bridge} onSubmit={data => submit(data)}>
            <Card>
              <Card.Body>
                <TextField id={COMPONENT_IDS.SIGN_UP_FORM_FIRST_NAME} name="firstName" placeholder="First name" />
                <TextField id={COMPONENT_IDS.SIGN_UP_FORM_LAST_NAME} name="lastName" placeholder="Last name" />
                <TextField id={COMPONENT_IDS.SIGN_UP_FORM_EMAIL} name="email" placeholder="E-mail address" />
                <TextField id={COMPONENT_IDS.SIGN_UP_FORM_PASSWORD} name="password" placeholder="Password" type="password" />
                <ErrorsField />
                <SubmitField id={COMPONENT_IDS.SIGN_UP_FORM_SUBMIT} />
                <div className="text-center"><h2>Welcome to Voluntree</h2></div>
                <Row className="justify-conetent-center  align-items-center">
                  <Col style={{ maxWidth: '50%' }}>
                    <div className="py-2 mt-3">Register Your Account Below</div>
                    <div className="d-flex flex-row align-items-center py-2">
                      <PersonFill size={30} />
                      <TextField name="username" placeholder="Your Username" className="px-2 w-50" />
                    </div>
                    <div className="d-flex flex-row align-items-center py-2">
                      <EnvelopeFill size={30} />
                      <TextField name="email" placeholder="Your Email Address" className="px-2 w-50" />
                    </div>
                    <div className="d-flex flex-row align-items-center py-2">
                      <KeyFill size={30} />
                      <TextField name="password" placeholder="Password" type="password" className="px-2 w-50" />
                    </div>
                    <ErrorsField />
                    <div className="py-3"><SubmitField /></div>
                    <Alert variant="light">
                      Already a member? Login
                      {' '}
                      <Link to="/signin">here</Link>
                    </Alert>
                    {error === '' ? (
                      ''
                    ) : (
                      <Alert variant="danger">
                        <Alert.Heading>Registration was not successful</Alert.Heading>
                        {error}
                      </Alert>
                    )}
                  </Col>
                  <Col className="text-center">
                    <Image src="/images/Signup-art.png" fluid width="500px" />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </AutoForm>
          <Alert variant="secondary">
            Already have an account? Login <Link to="/signin">here</Link>
          </Alert>
          {error === '' ? (
            ''
          ) : (
            <Alert variant="danger">
              <Alert.Heading>Registration was not successful</Alert.Heading>
              {error}
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default SignUp;
