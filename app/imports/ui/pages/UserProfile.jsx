import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';
import ProfilesDisplay from '../components/profile/ProfileCardDisplay';
import ProfileList from '../components/profile/ProfileList';
import Calendar from '../components/calendar/Calendar';

/** Render a Not Found page if the user enters a URL that doesn't match any route. */
const UserProfilePage = () => (
  <Container id={PAGE_IDS.USER_PROFILE} >
    <Row className="justify-content-center">
      <Col className="text-center">
        <h2>
          <p>User Profile</p>
        </h2>
        {/*<ProfileList />*/}
        <ProfilesDisplay/>
        <h2>
          <p>Upcoming Events</p>
        </h2>

        <Calendar/>

      </Col>
    </Row>
  </Container>
);

export default UserProfilePage;
