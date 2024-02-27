import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { UserProfiles } from '../../../api/user/UserProfileCollection';
import ProfileCardExample from './ProfileCardExample';

const ProfilesDisplay = ({ profile, isLoading }) => {
  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  return profile ? (
    <ProfileCardExample profile={profile} />
  ) : (
    <div>No profile found.</div>
  );
};

ProfilesDisplay.propTypes = {
  profile: PropTypes.shape({
    _id: PropTypes.string,
    email: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    picture: PropTypes.string, // Optional
    // Add more props as needed
  }),
  isLoading: PropTypes.bool.isRequired,
};

ProfilesDisplay.defaultProps = {
  profile: null, // Default value when no profile is provided
};

export default withTracker(() => {
  const handle = Meteor.subscribe('CurrentUserProfile');
  const isLoading = !handle.ready(); // Renamed from 'ready' to 'isLoading' to match the expected prop
  const profile = handle.ready() ? UserProfiles.find().fetch() : [];

  return {
    profile: profile[0] || null, // Ensure a single profile or null is passed
    isLoading, // Correctly pass isLoading to match PropTypes expectation
  };
})(ProfilesDisplay);
