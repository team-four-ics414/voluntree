import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';
import ProfileList from '../components/profile/ProfileList';

/** Render a Not Found page if the user enters a URL that doesn't match any route. */
const UsersProfilesPage = () => (
  <Container id={PAGE_IDS.DEVELOPMENT}>
    <Row className="justify-content-center">
      <Col className="text-center">
        <h2>
          <p>Users Profiles</p>
        </h2>
        <ProfileList />
      </Col>
    </Row>
  </Container>
);

export default UsersProfilesPage;
