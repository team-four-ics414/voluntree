import React from 'react';
import PropTypes from 'prop-types';

const UserProfileImage = ({ picture }) => {
  if (!picture) return null; // Optionally handle missing images
  return <img src={picture} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />;
};

export default UserProfileImage;
