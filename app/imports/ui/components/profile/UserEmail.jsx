import React from 'react';
import PropTypes from 'prop-types';

const UserEmail = ({ email }) => (
  <div>{email}</div>
);

UserEmail.propTypes = {
  email: PropTypes.string.isRequired,
};

export default UserEmail;
