import React from 'react';
import { Col, Container, Image, Row } from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';
import Calendar from '../components/calendar/Calendar';

/* A simple static component to render some text for the landing page. */
const Landing = () => (
  <Container id={PAGE_IDS.LANDING} className="py-3">
    <Row className="align-middle text-center">
      <Col xs={4}>
        <Image src="/images/voluntree-logo.png" width="250px" />
      </Col>

      <Col xs={8} className="d-flex flex-column justify-content-center">
        <h1>Aloha! Welcome to Voluntree!</h1>
        <p>This is a site where you can do volunteering activities!</p>
      </Col>

    </Row>
    <Calendar />
  </Container>
);

export default Landing;
