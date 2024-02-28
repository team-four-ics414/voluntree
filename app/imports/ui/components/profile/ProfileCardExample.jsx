import React from 'react';
import PropTypes from 'prop-types';

const ProfileCardExample = ({ profile }) => (
  <div className="profile-card-example" style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '5px', marginBottom: '10px' }}>
    <h2 className="mt-3 mb-4 text-center">Profile Card Example</h2>

    {/* Profile Image */}
    {profile.picture && (
      <img src={profile.picture} alt={`${profile.firstName} ${profile.lastName}`} style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
    )}

    {/* Name */}
    <h2>{`${profile.firstName} ${profile.lastName}`}</h2>

    {/* Email */}
    {profile.email && <p>Email: {profile.email}</p>}

    {/* Title */}
    {profile.title && <p>Title: {profile.title}</p>}

    {/* Bio */}
    {profile.bio && <p>Bio: {profile.bio}</p>}

    {/* Interests */}
    {profile.interests && profile.interests.length > 0 && (
      <div>
        <h4>Interests:</h4>
        <ul>
          {profile.interests.map((interest, index) => (
            <li key={index}>{interest}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

ProfileCardExample.propTypes = {
  profile: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    picture: PropTypes.string,
    title: PropTypes.string,
    bio: PropTypes.string,
    interests: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default ProfileCardExample;
