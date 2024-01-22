import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import { PAGE_IDS } from '../utilities/PageIDs';

const FAQ = () => (
  <Container id={PAGE_IDS.FAQ} className="py-3">
    <Row className="align-middle text-center">
      <Col xs={12} className="d-flex flex-column justify-content-center">
        <h1>FAQ</h1>
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Question #1?</Accordion.Header>
            <Accordion.Body>
              Answer #1
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>Question #2?</Accordion.Header>
            <Accordion.Body>
              Answer #2
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Col>

    </Row>
  </Container>
);

export default FAQ;
