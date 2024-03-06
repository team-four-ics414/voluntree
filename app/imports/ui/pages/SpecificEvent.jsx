import React, { useState } from 'react';
import { Button, Col, Container, Row, Image, Form } from 'react-bootstrap';
import { BsHeartFill } from 'react-icons/bs';

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
            <p className="event-info">
              <span className="bold-text">Time:</span> January 1st, 2025 - 8:00 PM
            </p>
            <p className="event-info">
              <span className="bold-text">Location:</span> Event Location
            </p>
            <p className="event-info">
              <span className="bold-text">Details:</span> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget velit est.
            </p>
            <p className="event-info">
              <span className="bold-text">Requirement:</span> Must be over 15 years old or participate with a guardian.
            </p>
            <p className="event-info">
              <span className="bold-text">Contact:</span> (123)456-789
            </p>
            <Button variant="primary" className="interest-button">
              <div className="interest-content">
                <BsHeartFill className="heart-icon" />
                Interested!
              </div>
            </Button>
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
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SpecificEvent;
