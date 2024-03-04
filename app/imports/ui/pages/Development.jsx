import React from 'react';
import { Container } from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';
import CalendarEventsList from '../components/calendar/CalendarEventsList';
import ActivityDashboard from '../components/activities/ActivityDashboard';
import ActivityList from '../components/activities/ActivityList';
import RecentActivityList from '../components/activities/RecentActivityList';
import CalendarWeeklyCard from '../components/calendar/CalendarWeeklyCard';
import ProfileList from '../components/profile/ProfileList';
import ProfilesDisplay from '../components/profile/ProfileCardDisplay';
import ChatComponent from '../chat/ChatComponent';
import TestChatComponent from '../components/chat/Test';

const Development = () => (
  <Container id={PAGE_IDS.DEVELOPMENT}>
    <CalendarEventsList />
    <ActivityDashboard />
    <ActivityList />
    <RecentActivityList />
    <CalendarWeeklyCard />
    <ProfileList />
    <ProfilesDisplay />
    <ChatComponent />
    <TestChatComponent />
  </Container>
);

export default Development;
