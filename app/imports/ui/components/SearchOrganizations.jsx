import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Container, Row, Col, Button, Form, Dropdown, Card } from 'react-bootstrap';
import { Organizations } from '../../api/organization/OrganizationCollection';
import { Causes } from '../../api/organization/CauseCollection';

const SearchOrganizations = ({ onOrganizationSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCause, setSelectedCause] = useState(null);

  const organizations = useTracker(() => {
    const handle = Meteor.subscribe('Organizations');
    return handle.ready() ? Organizations.find().fetch() : [];
  }, []);

  const causes = useTracker(() => {
    const handle = Meteor.subscribe('Causes');
    console.log(Causes.find().fetch());
    return handle.ready() ? Causes.find().fetch() : [];
  }, []);

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleCauseSelect = (causeName) => {
    setSelectedCause(causeName === selectedCause ? null : causeName);
  };

  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = !searchTerm || org.name.toLowerCase().includes(searchTerm) || org.description.toLowerCase().includes(searchTerm);
    const matchesCause = !selectedCause || (org.causes && org.causes.includes(selectedCause));
    return matchesSearch && matchesCause;
  });

  return (
    <Container className="py-3">
      <Row>
        <Col xs={12} md={8}>
          <Form.Control
            type="text"
            placeholder="Search organizations..."
            value={searchTerm}
            onChange={handleSearchInputChange}
            className="mb-3"
          />
        </Col>
        <Col xs={12} md={4}>
          <Dropdown className="mb-3">
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Filter By Cause
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleCauseSelect(null)} active={!selectedCause}>
                All Causes
              </Dropdown.Item>
              {causes.map((cause) => (
                <Dropdown.Item
                  key={cause._id}
                  onClick={() => handleCauseSelect(cause.name)}
                  active={selectedCause === cause.name}
                >
                  {cause.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
      <Row>
        {filteredOrganizations.map((org) => (
          <Col xs={12} sm={6} md={4} key={org._id}>
            <Card className="mb-4">
              <Card.Img variant="top" src={org.logo || '/images/Signup-art.png'} />
              <Card.Body>
                <Card.Title>{org.name}</Card.Title>
                <Card.Text>{org.description}</Card.Text>
                <Button variant="primary" onClick={() => onOrganizationSelect(org)}>
                  Learn More
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
        {filteredOrganizations.length === 0 && (
          <Col>
            <p>No organizations found matching your criteria.</p>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default SearchOrganizations;
