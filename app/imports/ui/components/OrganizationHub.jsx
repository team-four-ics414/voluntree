import React, { useState } from 'react';
import OrganizationLandingPage from '../pages/OrganizationLandingPage';
import SearchOrganizations from './SearchOrganizations';

const OrganizationHub = () => {
  const [selectedOrganization, setSelectedOrganization] = useState(null);

  return (
    <div>
      {selectedOrganization ? (
        <OrganizationLandingPage organization={selectedOrganization} />
      ) : (
        <SearchOrganizations onOrganizationSelect={setSelectedOrganization} />
      )}
    </div>
  );
};

export default OrganizationHub;
