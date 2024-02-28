import React from 'react';
import PropTypes from 'prop-types';

const UserProfileImage = ({ picture }) => {
  if (!picture) return null; // Optionally handle missing images
  return <img src={picture} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />;
};

UserProfileImage.propTypes = {
  picture: PropTypes.string, // Define 'picture' prop type
};

UserProfileImage.defaultProps = {
  picture: '/images/defaultuserprofile.png', // Set default prop value for 'picture'
};

export default UserProfileImage;
