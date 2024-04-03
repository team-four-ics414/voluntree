import React from 'react';
import { Container, Card } from 'react-bootstrap';

const TrackHours = () => {
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
    <Container>
      <Card>
        <Card.Body>
          <h3>Total Volunteer Hours: {totalHours} hours</h3>
          <div className="row align-items-center">
            <div className="col">
              <div className="x-box" style={{ cssText: generatePieChartCSS() }} />
            </div>
            <div className="x-box-cont col">
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
    </Container>
  );

};

export default TrackHours;
