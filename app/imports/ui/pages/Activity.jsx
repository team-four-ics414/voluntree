import React from 'react';
import { Container } from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';
import ActivityList from '../components/activities/ActivityList';
import RecentActivityList from '../components/activities/RecentActivityList';

const Activity = () => (
  <Container id={PAGE_IDS.DEVELOPMENT} style={{ marginBottom: '50px' }}>
    <h1 style={{ textAlign: 'center', margin: '0', padding: '20px 0' }}>Activity Page</h1>
    <ActivityList />
    <RecentActivityList />
  </Container>
);

export default Activity;
