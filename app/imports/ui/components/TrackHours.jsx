import React, { useState, useEffect } from 'react';
import { Container, Card } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Calendars } from '../../api/calendar/CalendarCollection';

const TrackHours = ({ events }) => {
  const [volunteerHours, setVolunteerHours] = useState([]);

  useEffect(() => {
    const eventHours = events
      .map((event, index) => {
        const start = new Date(event.startDate);
        const end = new Date(event.endDate);
        const duration = Math.abs((end - start) / (1000 * 60 * 60));
        // Dynamic HSL color generation
        const color = `hsl(${index * 137.508}, 70%, 60%)`; // Using the golden angle approximation (137.5°) for visually distinct colors

        return {
          category: event.title,
          hours: duration,
          color: color,
        };
      })
      .filter(event => event.hours <= 700); // Filter out events with hours > 1000 or those that take up a lot of chart space

    setVolunteerHours(eventHours);
  }, [events]);

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
          <h3>Total Volunteer Hours: {totalHours.toFixed(2)} hours</h3>
          <div className="row align-items-center justify-content-center">
            <div className="col-auto">
              <div
                className="x-box"
                style={{
                  width: '200px',
                  height: '200px',
                  cssText: generatePieChartCSS(),
                  display: 'block',
                }}
              />
            </div>
            <div className="col">
              <div className="text-start">
                {volunteerHours.map(({ category, hours, color }, index) => (
                  <div key={index} className="d-flex align-items-center mb-2">
                    <span style={{
                      height: '15px',
                      width: '15px',
                      backgroundColor: color,
                      borderRadius: '50%',
                      display: 'inline-block',
                      marginRight: '8px',
                    }}
                    />
                    <strong style={{ color }}>
                      {category} ({hours.toFixed(2)} hours)
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

TrackHours.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    startDate: PropTypes.instanceOf(Date).isRequired,
    endDate: PropTypes.instanceOf(Date).isRequired,
  })).isRequired,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('calendar.all');
  const events = Calendars.find({}).fetch();
  return {
    events,
    loading: !subscription.ready(),
  };
})(TrackHours);
