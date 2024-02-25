import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Button, Modal, ListGroup, Alert } from 'react-bootstrap';
import { Activity } from '../../../api/activities/ActivityCollection';
import { Calendars } from '../../../api/calendar/CalendarCollection';

import ActivityForm from './ActivityForm';
import AddToCalendar from './AddToCalendar';

const ActivityDashboard = ({ activities, isLoading }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [error, setError] = useState('');

  const openModal = (activity = null) => {
    setCurrentActivity(activity);
    setShowModal(true);
    setError(''); // Clear previous errors
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentActivity(null);
    setError('');
  };

  const handleDelete = (activityId) => {
    Meteor.call('calendar.removeByActivityId', activityId, (error, response) => {
      if (error) {
        setError(`Error removing associated calendar events: ${error.message}`);
      } else {
        Meteor.call('activity.remove', activityId, (removeError) => {
          if (removeError) {
            setError(`Error removing activity: ${removeError.message}`);
          } else {
            // Optionally, you can use a state or context to show success feedback
          }
        });
      }
    });
  };

  if (isLoading) {
    return <div>Loading activities...</div>;
  }

  const checkActivityAddedStatus = (activityId) => !!Calendars.findOne({ activityId });

  return (
    <div>
      <h2>Activity Dashboard</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button onClick={() => openModal()}>Add Activity</Button>
      <ListGroup>
        {activities.map((activity) => (
          <ListGroup.Item key={activity._id}>
            {activity.name} - {activity.time}
            <Button variant="info" onClick={() => openModal(activity)}>Edit</Button>
            <Button variant="danger" onClick={() => handleDelete(activity._id)}>Delete</Button>
            <AddToCalendar activity={activity} isAlreadyAdded={checkActivityAddedStatus(activity._id)} />
          </ListGroup.Item>
        ))}
      </ListGroup>

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentActivity ? 'Edit Activity' : 'Add Activity'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ActivityForm activity={currentActivity} onSuccess={closeModal} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

ActivityDashboard.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      details: PropTypes.string,
      createdAt: PropTypes.instanceOf(Date),
      benefits: PropTypes.string,
      location: PropTypes.exact({
        lat: PropTypes.number,
        lng: PropTypes.number,
      }),
      frequency: PropTypes.string,
      requirement: PropTypes.string,
      contactInfo: PropTypes.string,
      image: PropTypes.string,
      owner: PropTypes.string.isRequired,
    }),
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const handle = Meteor.subscribe('ActivityCollection'); // Ensure this matches the publication name
  return {
    isLoading: !handle.ready(),
    activities: Activity.find().fetch(),
  };
})(ActivityDashboard);
