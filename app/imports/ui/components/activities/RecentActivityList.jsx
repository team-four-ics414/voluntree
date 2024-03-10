import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Activity } from '../../../api/activities/ActivityCollection'; // Ensure the path is correct

/**
 * Component to display a list of the 3 most recent activities.
 * @param {Object[]} recentActivities - Array of activity objects to display.
 */

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

const RecentActivityList = ({ recentActivities }) => (
  <div className="container mt-3">
    <h2 className="mb-4">Recent Activities</h2>
    <div className="row row-cols-1 row-cols-md-3 g-4">
      {recentActivities.map((activity) => (
        <div key={activity._id} className="col">
          <div className="card h-100">
            <img src={activity.image || '/images/volunteers1.jpg'} className="card-img-top" alt={activity.name} />
            <div className="card-body">
              <h5 className="card-title">{activity.name}</h5>
              <p className="card-text">{activity.details}</p>
            </div>
            <div className="card-footer">
              <small className="text-muted">Event start on {formatDate(activity.startTime)}</small>

            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

RecentActivityList.propTypes = {
  recentActivities: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      details: PropTypes.string,
      startTime: PropTypes.instanceOf(Date), // Ensure this matches the expected type
      image: PropTypes.string,
    }),
  ).isRequired,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('recentActivities.public');
  const recentActivities = Activity.find({}, { sort: { createdAt: -1 }, limit: 3 }).fetch();
  return {
    isLoading: !subscription.ready(),
    recentActivities,
  };
})(RecentActivityList);
