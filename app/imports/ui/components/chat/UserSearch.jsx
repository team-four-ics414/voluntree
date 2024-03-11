import React, { useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { Meteor } from 'meteor/meteor';

const UserSearch = ({ onUserSelected }) => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Rename to avoid shadowing

  const handleSearch = () => {
    setErrorMessage(''); // Clear previous error messages
    Meteor.call('users.findByEmail', email, (error, user) => {
      if (error) {
        console.error('Search error:', error);
        setErrorMessage(error.reason || 'Failed to search for user.'); // Use setErrorMessage here
      } else if (user) {
        onUserSelected(user);
      } else {
        setErrorMessage('No user found with that email.'); // Use setErrorMessage here
      }
    });
  };

  return (
    <div className="flex flex-col items-center space-y-2 p-4">
      <input
        type="text"
        placeholder="Search user by email..."
        className="input input-bordered flex-1"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="btn btn-primary" onClick={handleSearch} type="button">Search</button> {/* Add type="button" */}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>} {/* Use errorMessage for display */}
    </div>
  );
};

UserSearch.propTypes = {
  onUserSelected: PropTypes.func.isRequired, // Add PropTypes validation for onUserSelected
};

export default UserSearch;
