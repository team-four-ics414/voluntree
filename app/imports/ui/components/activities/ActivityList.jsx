import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Modal, Button } from 'react-bootstrap';
import { AutoForm, LongTextField, ErrorsField } from 'uniforms-bootstrap5';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import swal from 'sweetalert';
import { Activity } from '../../../api/activities/ActivityCollection';

const formatDate = (date) => {
  if (!date || !(date instanceof Date)) {
    return 'N/A';
  }
  return date.toDateString();
};

const ActivitySchema = new SimpleSchema({
  comment: {
    type: String,
    optional: true,
  },
});
const schemaBridge = new SimpleSchema2Bridge(ActivitySchema);

const ActivityList = ({ activities }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);
  const { _id } = useParams();

  const handleOpenModal = (activity) => {
    setCurrentActivity(activity);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const submitForm = (data) => {
    const finalData = {
      ...data,
      activityID: currentActivity._id,
      activityName: currentActivity.name,
      organizationID: currentActivity.owner,
      owner: Meteor.user()?.username || 'Anonymous',
    };
    Meteor.call('pending.insert', finalData, (error) => {
      if (error) {
        swal('Error', error.reason, 'error');
      } else {
        swal('Success', 'Your request has been submitted!', 'success');
        handleCloseModal();
      }
    });
  };

  return (
    <div className="container mt-3">
      <h2 className="mb-4">Activities List</h2>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {activities.filter(activity => !_id || activity._id === _id).map((activity) => (
          <div key={activity._id} className="col">
            <div className="card h-100">
              <img style={{ width: '500px', height: '200px' }} src={activity.image || '/images/volunteers1.jpg'} className="card-img-top" alt={activity.name} />
              <div className="card-body">
                <h5 className="card-title">{activity.name}</h5>
                <p className="card-text">{activity.details}</p>
              </div>
              <div className="card-footer">
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">Event start on {formatDate(activity.startTime)}</small>
                  <Button style={{ borderColor: 'lightgreen', margin: 10, color: 'white', background: 'lightgreen' }} variant="primary" onClick={() => handleOpenModal(activity)}>Register</Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Request Participation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AutoForm schema={schemaBridge} onSubmit={submitForm}>
            <LongTextField name="comment" />
            <ErrorsField />
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
              <Button type="submit" variant="primary">
                Submit
              </Button>
            </Modal.Footer>
          </AutoForm>
        </Modal.Body>
      </Modal>
    </div>
  );
};

ActivityList.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string,
      details: PropTypes.string,
      startTime: PropTypes.instanceOf(Date), // Ensure this matches the expected type
    }),
  ).isRequired,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('ActivityCollection');
  return {
    isLoading: !subscription.ready(),
    activities: Activity.find().fetch(),
  };
})(ActivityList);
