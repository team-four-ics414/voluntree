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
  const userId = Meteor.userId();
  // console.log('Current User ID:', userId); // Debugging line

  const handle = Meteor.subscribe('CurrentUserProfile');
  const isLoading = !handle.ready();
  const profile = UserProfiles.findOne({ userID: userId });
  // const profile = UserProfiles.findOne({ userId }); // this was wrong
  // admin profile doesn't show up
  // console.log('Profile found:', profile); // Debugging line

  return {
    profile,
    isLoading,
  };
})(ProfilesDisplay);
