import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Button, Modal, ListGroup } from 'react-bootstrap';
import { Roles } from 'meteor/alanning:roles';
import { Activity } from '../../../api/activities/ActivityCollection';
import ActivityForm from './ActivityForm';
import AddToCalendar from './AddToCalendar'; // Ensure this is correctly imported

const ActivityDashboard = ({ activities, isLoading, userIsAuthorized }) => { // Destructured props
  const [showModal, setShowModal] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);

  const toggleModal = (activity = null) => {
    setCurrentActivity(activity);
    setShowModal(!showModal);
  };

  const handleDelete = (activityId) => {
    if (!userIsAuthorized) {
      alert("You're not authorized to delete activities.");
      return;
    }

    Meteor.call('calendar.removeByActivityId', activityId, (error, response) => {
      if (error) {
        alert(`Error removing associated calendar events: ${error.message}`);
      } else {
        Meteor.call('activity.remove', activityId, (removeError) => {
          if (removeError) {
            alert(`Error removing activity: ${removeError.message}`);
          } else {
            alert('Activity and associated calendar events removed successfully.');
          }
        });
      }
    });
  };

  if (isLoading) {
    return <div>Loading Activity Dashboard...</div>;
  }

  return (
    <div>
      <h2>Activity Dashboard</h2>
      <Button onClick={() => toggleModal()}>Add Activity</Button>
      <ListGroup>
        {activities.map((activity) => (
          <ListGroup.Item key={activity._id}>
            {activity.name} - {activity.time}
            <Button variant="info" onClick={() => toggleModal(activity)}>Edit</Button>
            <Button variant="danger" onClick={() => handleDelete(activity._id)}>Delete</Button>
            <AddToCalendar activity={activity} />
          </ListGroup.Item>
        ))}
      </ListGroup>

      <Modal show={showModal} onHide={() => toggleModal()}>
        <Modal.Header closeButton>
          <Modal.Title>{currentActivity ? 'Edit Activity' : 'Add Activity'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ActivityForm activity={currentActivity} onSuccess={() => toggleModal()} />
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
      location: PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
      }),
      frequency: PropTypes.string,
      requirement: PropTypes.string,
      contactInfo: PropTypes.string,
      image: PropTypes.string,
      owner: PropTypes.string.isRequired,
      calendarID: PropTypes.string, // Add this line if calendarID is optional
    }),
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
  userIsAuthorized: PropTypes.bool, // Make optional if necessary
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('ActivityCollection'); // Ensure subscription name is correct
  const isLoading = !subscription.ready();
  const activities = Activity.find().fetch();
  const userIsAuthorized = Roles.userIsInRole(Meteor.userId(), ['admin']); // Check for role correctly

  return {
    isLoading,
    activities,
    userIsAuthorized,
  };
})(ActivityDashboard);
