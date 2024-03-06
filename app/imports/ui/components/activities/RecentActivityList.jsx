import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Activity } from '../../../api/activities/ActivityCollection'; // Ensure the path is correct

/**
 * Component to display a list of the 3 most recent activities.
 * @param {Object[]} recentActivities - Array of activity objects to display.
 */
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
              <small className="text-muted">Posted on {activity.startTime.toDateString()}</small>
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
      createdAt: PropTypes.instanceOf(Date),
      image: PropTypes.string,
      // Add any other fields you need from the activity
    }),
  ).isRequired,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('recentActivities.public');
  // Fetch the 3 most recent activities by createdAt field in descending order
  const recentActivities = Activity.find({}, { sort: { createdAt: -1 }, limit: 3 }).fetch();

  // Reverse the array to display them in ascending order
  const reversedActivities = recentActivities.reverse();

  return {
    isLoading: !subscription.ready(),
    recentActivities: reversedActivities, // Now in ascending order
  };
})(RecentActivityList);
