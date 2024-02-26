import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';
import ProfileList from '../components/profile/ProfileList';

/** Render a Not Found page if the user enters a URL that doesn't match any route. */
const UserProfilePage = () => (
  <Container id={PAGE_IDS.NOT_FOUND} className="py-3">
    <Row className="justify-content-center">
      <Col xs={4} className="text-center">
        <h2>
          <p>User Profile</p>
          <ProfileList />
        </h2>
      </Col>
    </Row>
  </Container>
);

export default UserProfilePage;
