import React, { useState } from 'react';
import { Col, Container, Row, Form, Button, Modal } from 'react-bootstrap';
import ForumPostCard from '../components/forum/ForumPostCard'; // Replace with your forum post component
/** import ForumModal from '../components/forum/ForumModal'; // Replace with your forum post component */

const VolunteerForum = () => {
  // handling the Modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Container id="VOLUNTEER_FORUM" className="py-3">
      <Row style={{ backgroundColor: '#f0f2f5', borderRadius: '30px' }}>
        {/* Forum posts column */}
        <Col className="p-5">
          <h1>Volunteer Forum</h1>
          <div style={{ display: 'flex', justifyContent: 'end', marginBottom: '10px' }}>
            <Button variant="success" onClick={handleShow}>
              +Create Forum
            </Button>
          </div>
          {/** TESTING ZONE */}
          <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Add Post
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form style={{ fontWeight: 'bolder' }}>
                <Form.Label className="mt-1">Title</Form.Label>
                <Form.Control type="text" placeholder="enter title..." />
                <Form.Label className="mt-3">Information</Form.Label>
                <Form.Control type="text" placeholder="enter details..." />
                <Form.Label className="mt-3">Event Date</Form.Label>
                <Form.Control type="date" placeholder="enter date..." />
                <Form.Label className="mt-3">Event Time</Form.Label>
                <Form.Control type="time" placeholder="enter time..." />
                <Form.Label className="mt-3">Event Location</Form.Label>
                <Form.Control type="text" placeholder="enter location..." />
              </Form>
              <Col style={{ display: 'flex', justifyContent: 'end', marginTop: '10px' }}>
                <Button variant="success" onClick={handleClose}>Submit</Button>
              </Col>
            </Modal.Body>
          </Modal>
          <Form.Control type="text" placeholder="Search Forums..." style={{ display: 'flex' }} />
          <div className="d-flex flex-wrap overflow-auto mt-4" style={{ maxHeight: '700px' }}>
            <Row>
              <ForumPostCard />
            </Row>
            <Row>
              <ForumPostCard />
            </Row>
            <Row>
              <ForumPostCard />
            </Row>
            <Row>
              <ForumPostCard />
            </Row>
            <Row>
              <ForumPostCard />
            </Row>
            <Row>
              <ForumPostCard />
            </Row>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default VolunteerForum;
