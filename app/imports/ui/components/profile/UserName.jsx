import React from 'react';
import PropTypes from 'prop-types';

const UserName = ({ firstName, lastName }) => (
  <div>
    <h2>{firstName} {lastName}</h2>
  </div>
);

UserName.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
};

export default UserName;
