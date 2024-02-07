import React from 'react';
import { Col, Container, Image, Row } from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';
import Calendar from '../components/calendar/Calendar';
import SideChat from '../components/SideChat';

/* A simple static component to render some text for the landing page. */
const Landing = () => (
  <Container id={PAGE_IDS.LANDING} className="py-3">
    <Row className="align-middle text-center">
      <Col xs={4}>
        <Image src="/images/voluntree-logo.png" width="250px" />
      </Col>

      <Col xs={4} className="d-flex flex-column justify-content-center">
        <h1>Aloha! Welcome to Voluntree!</h1>
        <p>This is a site where you can do volunteering activities!</p>
      </Col>
      <Col xs={4} className="d-flex flex-column">
        <SideChat />
      </Col>

    </Row>
    <Container className="shadow p-3 mb-5 bg-body rounded">
      <Calendar />
    </Container>
  </Container>
);

export default Landing;
