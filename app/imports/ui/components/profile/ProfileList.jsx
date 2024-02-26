import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Container } from 'react-bootstrap'; // Adjust path as needed
import { UserProfiles } from '../../../api/user/UserProfileCollection'; // Ensure correct path
import ProfileCard from './ProfileCard'; // Adjust path as needed
import LoadingSpinner from '../LoadingSpinner';

const ProfileList = ({ profilesData, ready }) => (
  ready ? (
    <Container>
      <div>
        {profilesData.map((profile, index) => (
          <ProfileCard key={profile._id || index} profile={profile} />
        ))}
      </div>
    </Container>
  ) : <LoadingSpinner />

);

ProfileList.propTypes = {
  profilesData: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    picture: PropTypes.string, // Optional
    // Simplify according to your actual UserProfile schema
  })).isRequired,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('UserProfilesPublication'); // Use your actual publication name
  const ready = subscription.ready();
  const profilesData = ready ? UserProfiles.find().fetch() : [];

  return {
    profilesData,
    ready,
  };
})(ProfileList);
