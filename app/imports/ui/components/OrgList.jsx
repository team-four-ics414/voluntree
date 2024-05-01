import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';
import { withTracker } from 'meteor/react-meteor-data';
import { Organizations } from '../../api/organization/OrganizationCollection';

const OrganizationList = ({ organizations, isLoading }) => {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Email</th>
          <th>Contact Email</th>
          <th>Website</th>
          <th>Phone Number</th>
        </tr>
      </thead>
      <tbody>
        {organizations.map(org => (
          <tr key={org._id}>
            <td>{org.name}</td>
            <td>{org.type}</td>
            <td>{org.email}</td>
            <td>{org.contactEmail}</td>
            <td>{org.website}</td>
            <td>{org.phoneNumber}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

OrganizationList.propTypes = {
  organizations: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    contactEmail: PropTypes.string,
    website: PropTypes.string,
    phoneNumber: PropTypes.string,
  })),
  isLoading: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const handle = Meteor.subscribe('OrganizationsOnly');
  const isLoading = !handle.ready();
  const organizations = Organizations.find({}).fetch();
  return {
    organizations,
    isLoading,
  };
})(OrganizationList);
