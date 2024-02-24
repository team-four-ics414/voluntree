import React, { useState, useEffect } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Button, Modal, ListGroup } from 'react-bootstrap';
import { Activity } from '../../../api/activities/ActivityCollection';
import ActivityForm from './ActivityForm';

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

  const handleDelete = (activityId) => {
    Meteor.call('activity.remove', activityId, (error) => {
      if (error) {
        alert(`Error removing activity: ${error.message}`);
      } else {
        alert('Activity removed successfully');
      }
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

export default withTracker(() => {
  const subscription = Meteor.subscribe('ActivityCollection');
  return {
    isLoading: !subscription.ready(),
    activities: Activity.find().fetch(),
  };
})(ActivityDashboard);
