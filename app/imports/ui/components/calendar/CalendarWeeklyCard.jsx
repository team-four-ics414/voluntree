import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import { Calendars } from '../../../api/calendar/CalendarCollection';

const CalendarWeeklyCard = ({ events, isLoading }) => {

  const handleJoin = (eventId) => {
    console.log(`Joining event with ID: ${eventId}`);
  };

  if (isLoading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  /**
   * Formats the date into a human-readable string.
   * If the date is not provided or invalid, returns 'N/A'.
   * @param {Date} date - The date to format.
   * @returns {string} - The formatted date string or 'N/A'.
   */
  const formatDate = (date) => {
    if (!date || !(date instanceof Date)) {
      return 'N/A';
    }
    return date.toDateString();
  };

  return (
    <Container>
      <h2 className="mt-3 mb-4 text-center">Weekly Calendar Events</h2>
      <Row xs={1} md={3} className="g-4">
        {events.slice(0, 3).map((event) => (
          <Col key={event._id}>
            <Card className="h-100 shadow  mb-5 bg-body rounded">
              <Card.Img variant="top" src={event.imageUrl || '/images/volunteers1.jpg'} alt={event.title} />
              <Card.Body>
                <Card.Title>{event.title}</Card.Title>
                <Card.Text>{event.description}</Card.Text>
                <Button variant="info" onClick={() => handleJoin(event._id)}>Volunteer</Button>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">Last updated {formatDate(event.createdAt)}</small>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

CalendarWeeklyCard.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    createdAt: PropTypes.instanceOf(Date),
    imageUrl: PropTypes.string, // Ensure you include this in your propTypes
    lastUpdated: PropTypes.string, // Adjust according to your data model
  })).isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const handle = Meteor.subscribe('calendar.thisWeek');
  const events = Calendars.find({}, { sort: { startDate: 1 } }).fetch();
  return {
    isLoading: !handle.ready(),
    events,
  };
})(CalendarWeeklyCard);
