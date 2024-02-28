import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';

const UserSearch = ({ onUserSelected }) => {
  const [email, setEmail] = useState('');

  const handleSearch = () => {
    // Implement the logic to search for the user by email.
    // This might involve calling a Meteor method or querying a collection.
    // For demonstration, let's assume we have a method 'users.findByEmail'
    Meteor.call('users.findByEmail', email, (error, user) => {
      if (error) {
        console.error('Search error:', error);
      } else if (user) {
        onUserSelected(user);
      } else {
        alert('No user found with that email');
      }
    });
  };

  return (
    <div className="flex items-center space-x-2 p-4">
      <input
        type="text"
        placeholder="Search user by email..."
        className="input input-bordered flex-1"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="btn btn-primary" onClick={handleSearch}>Search</button>
    </div>
  );
};

export default UserSearch;
