import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Button, Modal, ListGroup } from 'react-bootstrap';
import { Activity } from '../../../api/activities/ActivityCollection';
import ActivityForm from './ActivityForm';
import AddToCalendar from './AddToCalendar'; // Ensure this is correctly imported

const ActivityDashboard = ({ activities, isLoading }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);

  const openModal = (activity = null) => {
    setCurrentActivity(activity);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentActivity(null); // Reset current activity
  };

  // Combined function to handle both activity and calendar removal
  const handleDelete = (activityId) => {
    // Attempt to remove any associated calendar events
    Meteor.call('calendar.removeByActivityId', activityId, (error, response) => {
      if (error) {
        console.log(`Error removing associated calendar events: ${error.message}`);
        // Proceed to remove the activity even if there's an error
      } else if (response && response.count > 0) {
        console.log(`Calendar events removed: ${response.count}`);
      } else {
        console.log('No calendar events found or removed.');
      }
      // Proceed to remove the activity itself regardless of the calendar events
      Meteor.call('activity.remove', activityId, (removeError) => {
        if (removeError) {
          alert(`Error removing activity: ${removeError.message}`);
        } else {
          alert('Activity removed successfully.');
        }
      });
    });
  };

  if (isLoading) {
    return <div>Loading activities...</div>;
  }

  return (
    <div>
      <h2>Activity Dashboard</h2>
      <Button onClick={() => openModal()}>Add Activity</Button>
      <ListGroup>
        {activities.map((activity) => (
          <ListGroup.Item key={activity._id}>
            {activity.name} - {activity.time}
            <Button variant="info" onClick={() => openModal(activity)}>Edit</Button>
            <Button variant="danger" onClick={() => handleDelete(activity._id)}>Delete</Button>
            <AddToCalendar activity={activity} />
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
      location: PropTypes.shape({
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
  const subscription = Meteor.subscribe('ActivityCollection');
  return {
    isLoading: !subscription.ready(),
    activities: Activity.find().fetch(),
  };
})(ActivityDashboard);
