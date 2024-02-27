import React from 'react';
import { Col, Container, Row, ListGroup, Image, Accordion } from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';
import Calendar from '../components/calendar/Calendar';
import SideChat from '../components/SideChat';
import CardSlider from '../components/CardSlider';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import CalendarEventsList from '../components/calendar/CalendarEventsList';
import ActivityDashboard from '../components/activities/ActivityDashboard';
import ActivityList from '../components/activities/ActivityList';
import RecentActivityList from '../components/activities/RecentActivityList';
import CalendarWeeklyCard from '../components/calendar/CalendarWeeklyCard';
import ProfileList from '../components/profile/ProfileList';
import ProfilesDisplay from '../components/profile/ProfileCardDisplay';
/* A simple static component to render some text for the landing page. */
const Landing = () => (
  <Container id={PAGE_IDS.LANDING} className="py-3">
    <Row className="align-middle text-center">

      {/* <Col xs={4}> */}
      {/*  <Image src="/images/voluntree-logo.png" width="250px" /> */}
      {/* </Col> */}
      <Col className="d-flex flex-column justify-content-center pb-5">
        <h1>Aloha! Welcome to Voluntree!</h1>
        <SideChat />
      </Col>
      {/* <Col xs={4} className="d-flex flex-column"> */}
      {/*  <SideChat /> */}
      {/* </Col> */}

    </Row>
    <Row className="pb-5">
      <Col className="d-flex flex-column">
        <h2 className="text-center">Mission Statement</h2>
        <p className="pt-2">
          Our mission is to empower individuals to impact their communities by enhancing the volunteer experience. We aim to remove barriers for volunteers and philanthropists, providing an accessible platform that connects community needs
          with those eager to help. Recognizing the inherent desire to contribute, our platform is designed to facilitate and streamline the process of finding and engaging in volunteer opportunities. We are dedicated to making it easier
          for those ready to serve to connect with the avenues where they can make the most impact.
        </p>
      </Col>
    </Row>
    <Container style={{ margin: '20px 5px' }}>
      <CardSlider />
    </Container>
    <Row className="pb-5">
      <Col>
        <h3 className="text-center pb-4">Transforming Volunteer Engagement</h3>
        <Accordion id={COMPONENT_IDS.LANDING_ACCORDION}>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Removing friction on both sides: for philanthropists/volunteers and those that manage these resources.</Accordion.Header>
            <Accordion.Body>
              At The Voluntree, we are removing barriers and frictions in the volunteer engagement process, making it effortless for volunteers to find meaningful opportunities and for individuals and companies to engage with passionate individuals.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>Easy-to-use platform, with comprehensive and engaging features</Accordion.Header>
            <Accordion.Body>
              With our user-friendly interface and comprehensive company database, volunteers can easily search and connect with organizations and individuals in need, that align with their interests and values.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>Socializing the volunteer experience, bringing volunteering into communities.</Accordion.Header>
            <Accordion.Body>
              Not only is this platform useful for connecting nonprofits with volunteers, but it will also enable any person to post/advertise their needs
              (be it a ride to the grocery store or doctor office, to help with an automobile or home repair), and any person in the community to reach out a helping hand.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Col>
      <Col className="d-flex flex-wrap align-items-center">
        <Image src="/images/volunteers.jpg" alt="Volunteers" fluid rounded />
      </Col>
    </Row>
    <Row className="pb-5">
      <Col className="d-flex flex-wrap align-items-center">
        <Image src="/images/volunteers1.jpg" alt="Volunteers" fluid rounded />
      </Col>
      <Col>
        <h3 className="text-center pb-4">How will we Amplify Impact? (Volunteers)</h3>
        <ListGroup>
          <ListGroup.Item>
            This platform is designed around the volunteer, making it easy for them to search for and sign up for activities that utilize their specialized skills and crafts.
            Giving them the biggest return on their time spent in philanthropy.
          </ListGroup.Item>
          <ListGroup.Item variant="success">
            Making a difference in the community is the biggest reason people volunteer–through this platform they’ll be able to do this in multiple ways–from supporting nonprofits to their neighbors.
          </ListGroup.Item>
          <ListGroup.Item>
            We’ll also make sure volunteers know they’re supporting a nonprofit with a cause they care about by creating a comprehensive nonprofit dashboard that clearly states the company&#39;s mission, and how they achieve this mission.
          </ListGroup.Item>
          <ListGroup.Item variant="success">
            Future iterations of the platform will also help to Foster community building by enabling individuals to create Community Groups, so that you can get plugged in with like-minded people wherever you travel or live.
          </ListGroup.Item>
        </ListGroup>
      </Col>
    </Row>
    <Row className="pb-5">
      <Col className="justify-content-center align-middle">
        <h3 className="text-center pb-4">How will we Amplify Impact? (nonprofits)</h3>
        <p>
          The vision of our initiative is to establish a world where volunteering and collaboration seamlessly merge, enabling both volunteers and companies to collectively create a positive impact in communities.
          By leveraging our platform, we address the largest & most common challenge for nonprofit volunteer managers, that of volunteer recruitment, as highlighted by Volunteer Pro&#39;s survey results.
        </p>
      </Col>
      <Col className="d-flex flex-wrap align-items-center">
        <Image src="/images/nonprofit-handshake.jpg" alt="Handshake" fluid rounded />
      </Col>
    </Row>
    <h2 className="text-center">You can see upcoming events in the calendar!</h2>
    <Container className="shadow p-3 mb-5 bg-body rounded">
      <Calendar />
    </Container>
    <Container>
      <CalendarEventsList />
      <ActivityDashboard />
      <ActivityList />
      <RecentActivityList />
      <CalendarWeeklyCard />
      <ProfileList />
      <ProfilesDisplay />
    </Container>
  </Container>
);

export default Landing;
