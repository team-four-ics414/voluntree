import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Activity } from '../../../api/activities/ActivityCollection'; // Adjust the import path as necessary

/**
 * Component to display a list of activities.
 * @param {Object[]} activities - Array of activity objects to display.
 */
const ActivityList = ({ activities }) => (
  <div className="container mt-3">
    <h2 className="mb-4">Activities List</h2>
    <div className="row row-cols-1 row-cols-md-3 g-4">
      {activities.map((activity) => (
        <div key={activity._id} className="col">
          <div className="card h-100">
            <img src={activity.image || '/images/volunteers1.jpg'} className="card-img-top" alt={activity.name} />
            <div className="card-body">
              <h5 className="card-title">{activity.name}</h5>
              <p className="card-text">{activity.details}</p>
            </div>
            <div className="card-footer">
              <small className="text-muted">Event start on {new Date(activity.createdAt).toDateString()}</small>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

ActivityList.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      // Add more specific PropTypes for other properties as needed
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
