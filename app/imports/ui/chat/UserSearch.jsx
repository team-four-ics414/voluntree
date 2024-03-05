import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

const UserSearch = ({ onUserSelected }) => {
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState(''); // State to store the error message

  const handleSearch = () => {
    setErrorMsg(''); // Clear previous error messages
    Meteor.call('users.findByEmail', email, (err, user) => {
      if (err) {
        console.error('Search error:', err);
        setErrorMsg(err.reason || 'Failed to search for user.'); // Set the error message
      } else if (user) {
        onUserSelected(user);
      } else {
        setErrorMsg('No user found with that email.'); // Set a custom error message
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
      <button type="button" className="btn btn-primary" onClick={handleSearch}>Search</button>
      {errorMsg && <p className="text-red-500">{errorMsg}</p>} {/* Display error message */}
    </div>
  );
};

UserSearch.propTypes = {
  onUserSelected: PropTypes.func.isRequired, // Prop types validation
};

export default UserSearch;
