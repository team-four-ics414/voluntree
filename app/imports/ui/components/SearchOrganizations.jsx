import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Organizations } from '../../api/organization/OrganizationCollection';

const SearchOrganizations = ({ onOrganizationSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  const searchResults = useTracker(() => {
    if (debouncedTerm) {
      const handle = Meteor.subscribe('organizations.search', debouncedTerm);
      setIsLoading(!handle.ready());
      return Organizations.find({}, { sort: { name: 1 } }).fetch();
    }
    return [];
  }, [debouncedTerm]);

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for organizations..."
      />
      <button onClick={() => setDebouncedTerm(searchTerm)} disabled={isLoading || !searchTerm.trim()}>
        Search
      </button>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {searchResults.length > 0 ? searchResults.map((org) => (
            <li key={org._id} onClick={() => onOrganizationSelect(org)}>
              {org.name}
            </li>
          )) : (
            <li>No results found.</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchOrganizations;
