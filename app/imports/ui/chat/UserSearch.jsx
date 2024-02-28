import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';

const UserSearch = ({ onUserSelected }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(''); // State to store the error message

  const handleSearch = () => {
    setError(''); // Clear previous error messages
    Meteor.call('users.findByEmail', email, (error, user) => {
      if (error) {
        console.error('Search error:', error);
        setError(error.reason || 'Failed to search for user.'); // Set the error message
      } else if (user) {
        onUserSelected(user);
      } else {
        setError('No user found with that email.'); // Set a custom error message
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
      <button className="btn btn-primary" onClick={handleSearch}>Search</button>
      {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
    </div>
  );
};

export default UserSearch;
