import React from 'react';
import { Col, Container, Row, Card } from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';
import ProfilesDisplay from '../components/profile/ProfileCardDisplay';
import Calendar from '../components/calendar/Calendar';

const UserProfilePage = () => {
  // Sample volunteer hours data (replace with actual data)
  const volunteerHours = [
    { category: 'Education', hours: 10, color: '#0d8d78' },
    { category: 'Cleanup', hours: 15, color: '#09b22f' },
    { category: 'Arts & Crafts', hours: 30, color: '#12CBC4' },
  ];

  // Calculate total volunteer hours
  const totalHours = volunteerHours.reduce((total, hour) => total + hour.hours, 0);
  const generatePieChartCSS = () => {
    let css = 'background: conic-gradient(';
    let startAngle = 0;
    volunteerHours.forEach(({ hours, color }, index) => {
      const percentage = (hours / totalHours) * 100;
      css += `${color} ${startAngle}deg ${startAngle + percentage * 3.6}deg`;
      if (index !== volunteerHours.length - 1) css += ', ';
      startAngle += percentage * 3.6;
    });
    css += ');';
    return css;
  };

  return (
    <Container id={PAGE_IDS.USER_PROFILE}>
      <Row className="justify-content-center">
        <Col className="text-center">
          <h2>
            <p>User Profile</p>
          </h2>
          {/* <ProfileList /> */}
          <ProfilesDisplay />
          <Card>
            <Card.Body>
              <h3>Total Volunteer Hours: {totalHours} hours</h3>
              <div className="row align-items-center">
                <div className="col">
                  <div className="x-box" style={{ cssText: generatePieChartCSS() }} />
                </div>
                <div className="col">
                  <div className="x-box-cont text-start">
                    {volunteerHours.map(({ category, hours, color }) => (
                      <strong key={category} style={{ color }}>
                        {category}: {hours} hours
                      </strong>
                    ))}
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2>Upcoming Events</h2>
          <Calendar />
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfilePage;
