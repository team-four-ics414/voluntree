import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Button, Nav } from 'react-bootstrap';
import Calendar from '../components/calendar/Calendar';
import RecentActivityList from '../components/activities/RecentActivityList';

const OrganizationLandingPage = ({ organization }) => {
  if (!organization) return <div>No organization selected.</div>;

  // State to manage calendar visibility
  const [showCalendar, setShowCalendar] = useState(false);

  // Function to toggle calendar visibility
  const toggleCalendar = () => setShowCalendar(!showCalendar);

  const {
    name = 'N/A',
    type = 'Unknown Type',
    missionStatement = 'No mission statement provided.',
    description = 'No additional information available.',
    causes = [],
    contactEmail = 'No email provided',
    phoneNumber = 'No phone number available',
    website = '#',
    address = {},
    logo = '/images/nonprofit-handshake.jpg', // Ensure this default image exists
    joinButtonText = 'Join Us',
    mapUrl = 'https://www.google.com/maps?q=placeholder', // Default map URL
  } = organization;

  const { street = '', city = '', state = '', zipCode = '', country = '' } = address;

  return (
    <Container fluid className="flex-grow-1 d-flex flex-column min-vh-100">
      {/* Header Section */}
      <Row as="header" className="bg-cover bg-center text-white py-20 px-4" style={{ backgroundImage: `url(${logo})`, height: '800px' }}>

        <Col className="text-center">
          <h1 className="display-1 font-weight-bold text-uppercase">{name}</h1>
          <p className="h4">{type}</p>
        </Col>
      </Row>

      {/* Navbar */}
      <Nav className="bg-white shadow-sm py-2 sticky-top">
        <Container className="d-flex justify-content-between align-items-center">
          <Nav.Item>
            <Nav.Link href="#about" className="font-weight-bold text-lg">About</Nav.Link>
            <Button onClick={toggleCalendar} variant="outline-primary">
              {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
            </Button>
          </Nav.Item>
          <Button variant="primary" className="font-weight-bold">
            {joinButtonText}
          </Button>
        </Container>
      </Nav>

      {/* Main Content */}
      <Container as="main" className="bg-white flex-grow-1">
        {/* Calendar Component */}
        {showCalendar && <Calendar />}
        <Row className="py-8">
          {/* Left Column */}
          <Col md={8}>
            <h2 className="h3 font-weight-bold">Mission Statement</h2>
            <p className="mt-4">{missionStatement}</p>
            <h2 className="h3 font-weight-bold mt-5">About</h2>
            <p>{description}</p>

            <section id="causes" className="mt-5">
              <h2 className="h3 font-weight-bold">Causes</h2>
              {causes.length > 0 ? (
                <Row>
                  {causes.map((cause, index) => (
                    <Col key={index} md={4} className="mb-3">
                      <div>{cause}</div>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div>No causes listed.</div>
              )}
            </section>
            <Row>
              <RecentActivityList />
            </Row>
          </Col>

          {/* Right Column */}
          <Col md={4} className="mt-4 mt-md-0">
            <div className="bg-light p-4 rounded-lg shadow-lg">
              <h2 className="h3 font-weight-bold">Contact Info</h2>
              <p>
                <strong>Email:</strong> {contactEmail}<br />
                <strong>Phone:</strong> {phoneNumber}<br />
                <strong>Website:</strong> <a href={website} className="text-primary">{website}</a><br />
                <strong>Address:</strong> {`${street}, ${city}, ${state} ${zipCode}, ${country}`}
              </p>
              <iframe
                title="Organization Location"
                src={mapUrl}
                className="w-100"
                height="300"
                frameBorder="0"
                style={{ border: 0 }}
                allowFullScreen=""
              />
            </div>
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <Container className="text-center">
          <p>&copy; {new Date().getFullYear()} {name}. All rights reserved.</p>
        </Container>
      </footer>
    </Container>
  );
};

OrganizationLandingPage.propTypes = {
  organization: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    missionStatement: PropTypes.string,
    description: PropTypes.string,
    causes: PropTypes.arrayOf(PropTypes.string),
    contactEmail: PropTypes.string,
    phoneNumber: PropTypes.string,
    website: PropTypes.string,
    address: PropTypes.shape({
      street: PropTypes.string,
      city: PropTypes.string,
      state: PropTypes.string,
      zipCode: PropTypes.string,
      country: PropTypes.string,
    }),
    logo: PropTypes.string,
    joinButtonText: PropTypes.string,
    mapUrl: PropTypes.string,
  }),
};

export default OrganizationLandingPage;
