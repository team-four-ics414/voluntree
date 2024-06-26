import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Col } from 'react-bootstrap';
import { Activity } from '../../../api/activities/ActivityCollection';
import ActivityForm from './ActivityForm';
import AddToCalendar from './AddToCalendar';
import { Calendars } from '../../../api/calendar/CalendarCollection';
import { Volunteer } from '../../../api/activities/VolunteerCollection';

const ActivityDashboard = ({ activities, isLoading }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [error, setError] = useState('');

  const notifyParticipants = (activity, comment) => {
    const volunteer = Volunteer.findOne({ activityName: activity.name });
    if (volunteer && volunteer.participant.length > 0) {
      volunteer.participant.forEach((participant) => {
        const notificationData = {
          activityID: activity._id,
          activityName: activity.name,
          organizationID: participant,
          comment: comment,
          owner: Meteor.user()?.username,
        };
        // eslint-disable-next-line no-shadow
        Meteor.call('pending.insert', notificationData, (error) => {
          if (error) {
            console.error(`Error inserting notification: ${error.message}`);
          } else {
            console.log('Notification inserted successfully');
          }
        });
      });
    }
  };

  const openModal = (activity = null) => {
    setCurrentActivity(activity);
    notifyParticipants(activity, 'Activity was edited');
    setShowModal(true);
    setError('');
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentActivity(null);
    setError('');
  };

  const handleDelete = (activity) => {
    Meteor.call('calendar.removeByActivityId', activity._id, (Calendarerror, response) => {
      if (Calendarerror) {
        console.error(`Error removing associated calendar events: ${Calendarerror.message}`);
      } else if (response && response.count > 0) {
        console.log(`Calendar events removed: ${response.count}`);
      } else {
        console.log('No calendar events found or removed.');
      }
      Meteor.call('activity.remove', activity._id, (removeError) => {
        if (removeError) {
          setError(`Error removing activity: ${removeError.message}`);
        } else {
          notifyParticipants(activity, 'Activity was removed');
          setError('');
          alert('Activity removed successfully.');
        }
      });
    });
  };

  const removeCalendarEvents = (activityId) => {
    Meteor.call('calendar.removeByActivityId', activityId, (removeerror, response) => {
      if (removeerror) {
        console.error('Error removing calendar events:', removeerror);
        alert(`Error: ${removeerror.message}`);
      } else {
        console.log('Calendar events removed:', response);
        alert('Calendar events removed successfully.');
        // Optionally, refresh the activities list or update UI accordingly
      }
    });
  };

  /**
   * Formats the date into a human-readable string.
   * If the date is not provided or invalid, returns 'N/A'.
   * @param {Date} date - The date to format.
   * @returns {string} - The formatted date string or 'N/A'.
   */
  const formatDate = (date) => {
    if (!date || !(date instanceof Date)) {
      return 'N/A';
    }
    return date.toDateString();
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><div className="text-lg font-medium">Loading activities...</div></div>;
  }

  const checkActivityAddedStatus = (activityId) => !!Calendars.findOne({ activityId });

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Activity Dashboard</h2>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>}
      <button type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4" onClick={() => openModal()}>Add Activity</button>
      <div className="divide-y divide-gray-200">
        {activities.map((activity) => (
          <div className="flex justify-between items-center py-3" key={activity._id}>
            <div>
              {activity.name} - {formatDate(activity.startTime)}
            </div>
            <div className="flex items-center space-x-2">
              <button type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded" onClick={() => openModal(activity)}>Edit</button>
              <button type="button" className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded" onClick={() => handleDelete(activity)}>Delete</button>
              <button type="button" className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded" onClick={() => removeCalendarEvents(activity._id)}>Remove Calendar Events</button>
              <AddToCalendar activity={activity} isAlreadyAdded={checkActivityAddedStatus(activity._id)} />
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75" />
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                      {currentActivity ? 'Edit Activity' : 'Add Activity'}
                    </h3>
                    <div className="mt-2">
                      <ActivityForm activity={currentActivity} onSuccess={closeModal} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Col className="">

                  <button
                    type="button"
                    onClick={closeModal}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300,
                             shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50,
                             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0,
                             sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Close
                  </button>
                </Col>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ActivityDashboard.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      startTime: PropTypes.instanceOf(Date),
      endTime: PropTypes.instanceOf(Date),
      details: PropTypes.string,
      createdAt: PropTypes.instanceOf(Date),
      benefits: PropTypes.string,
      location: PropTypes.exact({
        lat: PropTypes.number,
        lng: PropTypes.number,
      }),
      frequency: PropTypes.string,
      requirement: PropTypes.string,
      contactInfo: PropTypes.string,
      image: PropTypes.string,
      owner: PropTypes.string.isRequired,
    }),
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const handle = Meteor.subscribe('ActivityCollection');
  return {
    isLoading: !handle.ready(),
    activities: Activity.find().fetch(),
  };
})(ActivityDashboard);
