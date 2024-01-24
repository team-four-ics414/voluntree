import React from 'react';
import { Col, Container, Row, Form, Button, Dropdown, Card } from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';
import { Link } from 'react-router-dom';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

const CommunityGroups = () => (
  <Container id={PAGE_IDS.COMMUNITY_GROUPS} className="py-3">
    <Row className="align-middle text-left">
      <Col xs={12} className="d-flex flex-column justify-content-center">
        <h1 className="text-center" style={{ marginBottom: '20px' }}>Community Groups</h1>
        <h2 className="text-start">Your Groups</h2>
        <Row>
          <Card className="h-100 w-25">
            <Card.Header>
              <Card.Title>Eco-Crusaders Community</Card.Title>
            </Card.Header>
            <Card.Body>
              <Card.Text>
                Dive into environmental stewardship with the Eco-Crusaders Community, a group of passionate volunteers dedicated to preserving and enhancing our natural surroundings.
                From organizing beach cleanups to planting trees, members actively contribute to sustainable practices and advocate for a greener future.
              </Card.Text>
              <Link to="/">View</Link>
            </Card.Body>
          </Card>
          <Card className="h-100 w-25">
            <Card.Header>
              <Card.Title>Little Helpers Network</Card.Title>
            </Card.Header>
            <Card.Body>
              <Card.Text>
                The Little Helpers Network is a heartwarming community of volunteers with a focus on kid-friendly initiatives. Here, families and individuals come together to organize events and activities that bring joy to children in need.
                From crafting workshops to interactive storytelling sessions, the group aims to create lasting memories for the youngest members of our community.
              </Card.Text>
              <Link to="/">View</Link>
            </Card.Body>
          </Card>
        </Row>
        <h2 className="text-start">Find Groups</h2>
        <Form>
          <Row>
            <Col xs={6}>
              <Form.Control placeholder="" />
            </Col>
            <Col xs={1}>
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  Location
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1">All Areas</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Honolulu</Dropdown.Item>
                  <Dropdown.Item href="#/action-3">Manoa</Dropdown.Item>
                  <Dropdown.Item href="#/action-4">Kailua</Dropdown.Item>
                  <Dropdown.Item href="#/action-5">Hawaii Kai</Dropdown.Item>
                  <Dropdown.Item href="#/action-6">Kapolei</Dropdown.Item>
                  <Dropdown.Item href="#/action-7">Ewa Beach</Dropdown.Item>
                  <Dropdown.Item href="#/action-8">Aiea</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            <Col xs={2}>
              <Dropdown>
                <Dropdown.Toggle variant="info" id="dropdown-basic">
                  Skills
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Col className="pl-1">
                    <Form.Check
                      inline
                      label="Coding"
                      name="skill-1"
                      type="checkbox"
                      id="skill-checkbox-1"
                    />
                    <Form.Check
                      inline
                      label="Communication"
                      name="skill-2"
                      type="checkbox"
                      id="skill-checkbox-2"
                    />
                    <Form.Check
                      inline
                      label="Teamwork"
                      name="skill-3"
                      type="checkbox"
                      id="skill-checkbox-3"
                    />
                    <Form.Check
                      inline
                      label="Problem-Solving"
                      name="skill-4"
                      type="checkbox"
                      id="skill-checkbox-4"
                    />
                    <Form.Check
                      inline
                      label="Organization"
                      name="skill-5"
                      type="checkbox"
                      id="skill-checkbox-5"
                    />
                  </Col>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            <Col xs={2}>
              <Button variant="primary">Search</Button>{' '}
            </Col>
          </Row>
          <Row />
        </Form>
      </Col>

    </Row>
  </Container>
);

export default CommunityGroups;
