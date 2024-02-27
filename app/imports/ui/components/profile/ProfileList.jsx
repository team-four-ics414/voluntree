import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Container, Alert } from 'react-bootstrap'; // Ensure Alert is imported for error and empty state feedback
import { UserProfiles } from '../../../api/user/UserProfileCollection'; // Ensure correct path
import ProfileCard from './ProfileCard'; // Adjust path as needed
import LoadingSpinner from '../LoadingSpinner';

const ProfileList = ({ profilesData, ready, hasError }) => {
  if (!ready) {
    return <LoadingSpinner />;
  }

  if (hasError) {
    return (
      <Container>
        <Alert variant="danger">Error loading profiles. Please try again later.</Alert>
      </Container>
    );
  }

  if (ready && profilesData.length === 0) {
    return (
      <Container>
        <Alert variant="info">No profiles available.</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mt-3 mb-4 text-center">Profile List</h2>

      <div className="d-flex flex-wrap justify-content-start">
        {profilesData.map((profile, index) => (
          <ProfileCard key={profile._id || index} profile={profile} />
        ))}
      </div>
    </Container>
  );
};

ProfileList.propTypes = {
  profilesData: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    picture: PropTypes.string, // Optional
    // Add more props as needed
  })).isRequired,
  ready: PropTypes.bool.isRequired,
  hasError: PropTypes.bool, // Include error handling in propTypes
};

ProfileList.defaultProps = {
  hasError: false,
};

export default withTracker(() => {
  const handle = Meteor.subscribe('UserProfilesPublication');
  const ready = handle.ready();
  const hasError = !ready; // Simplified error handling, adjust based on your error handling logic
  const profilesData = ready ? UserProfiles.find().fetch() : [];

  return {
    profilesData,
    ready,
    hasError, // Pass error state to the component
  };
})(ProfileList);
