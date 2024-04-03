import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';
import ProfilesDisplay from '../components/profile/ProfileCardDisplay';
import Calendar from '../components/calendar/Calendar';
import TrackHours from '../components/TrackHours';

const UserProfilePage = () => (
  <Container id={PAGE_IDS.USER_PROFILE}>
    <Row className="justify-content-center">
      <Col className="text-center">
        <h2>
          <p>User Profile</p>
        </h2>
        {/* <ProfileList /> */}
        <ProfilesDisplay />
        <TrackHours />
      </Col>
    </Row>
    <Row>
      <Col>
        <h2>Upcoming Events</h2>
        <Calendar />
      </Col>
    </Row>
  </Container>
);

export default UserProfilePage;
