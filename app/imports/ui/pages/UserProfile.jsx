import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';
import ProfileCardDisplay from '../components/profile/ProfileCardDisplay';
import ProfileList from '../components/profile/ProfileList';

/** Render a Not Found page if the user enters a URL that doesn't match any route. */
const UserProfilePage = () => (
  <Container id={PAGE_IDS.DEVELOPMENT} >
    <Row className="justify-content-center">
      <Col className="text-center">
        <h2>
          <p>User Profile</p>
        </h2>
          <ProfileList />
          <ProfileCardDisplay />

      </Col>
    </Row>
  </Container>
);

export default UserProfilePage;
