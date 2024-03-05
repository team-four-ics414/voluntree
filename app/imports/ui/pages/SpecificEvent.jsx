import React, { useState } from 'react';
import { Button, Col, Container, Row, Image, Form } from 'react-bootstrap';

const SpecificEvent = () => {
  const [optIn, setOptIn] = useState(false);

  const handleOptInChange = () => {
    setOptIn(!optIn);
  };

  return (
    <Container className="specific-event-container">
      <Row>
        <Col md={6}>
          <Image src="images/sample1.jpg" className="event-image" />
        </Col>
        <Col md={6}>
          <div className="event-details">
            <h2 className="event-name">Event Name</h2>
            <p className="event-info">Time: January 1st, 2025 - 8:00 PM</p>
            <p className="event-info">Location: Event Location</p>
            <p className="event-info">Details: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget velit est.</p>
            <Form.Group controlId="formOptIn">
              <Form.Check
                type="switch"
                id="optInSwitch"
                label="Receive Notifications"
                checked={optIn}
                onChange={handleOptInChange}
                className="opt-in-switch"
              />
            </Form.Group>
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            <Button variant="primary" className="interest-button">I'm Interested!</Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SpecificEvent;
