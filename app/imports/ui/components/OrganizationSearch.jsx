import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Organizations } from '../../api/organization/OrganizationCollection';

const OrganizationList = () => {
  // Use Tracker to fetch organizations from the database
  const organizations = useTracker(() => Organizations.find().fetch());

  return (
    <div>
      <h2>Organizations</h2>
      <ul>
        {organizations.map((organization) => (
          <li key={organization._id}>
            <strong>{organization.name}</strong>
            <p>Type: {organization.type}</p>
            <p>About: {organization.missionStatement}</p>
            <p>Description: {organization.description}</p>
            <p>Causes: {organization.causes.join(', ')}</p>
            <p>Contact Email: {organization.contactEmail}</p>
            <p>Phone Number: {organization.phoneNumber}</p>
            <p>Website: <a href={organization.website}>{organization.website}</a></p>
            <p>Address: {organization.address.street}, {organization.address.city}, {organization.address.state} {organization.address.zipCode}, {organization.address.country}</p>
            {/* Add more organization details as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrganizationList;
