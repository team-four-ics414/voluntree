import React, { useState } from 'react';
import { Toast, Button, Pagination } from 'react-bootstrap';
import { EnvelopeCheckFill, EnvelopeExclamationFill, CheckCircle, XCircle } from 'react-bootstrap-icons';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import swal from 'sweetalert';
import { Roles } from 'meteor/alanning:roles';
import { Pending } from '../../api/activities/PendingCollection';
import { Volunteer } from '../../api/activities/VolunteerCollection';
import { ROLE } from '../../api/role/Role';

const MailBox = () => {
  const [show, setShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 3;

  // eslint-disable-next-line no-unused-vars
  const { notifications, notificationsReady, volunteerActivities } = useTracker(() => {
    const pendingSubscription = Pending.subscribePending();
    const volunteerSubscription = Volunteer.subscribeVolunteer(); // Subscribe to Volunteer
    const ready = pendingSubscription.ready() && volunteerSubscription.ready();
    const pendingNotifications = Pending.find({ organizationID: Meteor.user()?.username }, { sort: { createdAt: -1 } }).fetch();
    const volunteerNotifications = Volunteer.find({ owner: Meteor.user()?.username }, { sort: { createdAt: -1 } }).fetch();
    return {
      notifications: pendingNotifications.map(item => ({
        id: item._id,
        title: item.activityName,
        body: `${item.owner} : ${item.comment}`,
        organizationID: item.organizationID,
        owner: item.owner,
      })),
      volunteerActivities: volunteerNotifications.map(item => ({
        id: item._id,
        activityName: item.activityName,
        participants: item.participant,
      })),
      notificationsReady: ready,
    };
  }, []);

  const toggleShow = () => setShow(!show);

  const lastNotificationIndex = currentPage * notificationsPerPage;
  const firstNotificationIndex = lastNotificationIndex - notificationsPerPage;
  const currentNotifications = notifications.slice(firstNotificationIndex, lastNotificationIndex);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const insertPending = (notification, type) => {
    const newData = {
      activityID: notification.id,
      activityName: notification.title,
      organizationID: notification.owner,
      comment: type,
      owner: notification.organizationID,
    };
    Meteor.call('pending.insert', newData, (error) => {
      if (error) {
        console.log('Error', error.reason, 'error');
      } else {
        console.log('Success', 'Your request has been submitted!', 'success');
      }
    });
  };

  const pendingRemove = (pendingID) => {
    Meteor.call('pending.remove', pendingID, (error) => {
      if (error) {
        console.log('Error', 'Could not complete request', 'error');
      } else {
        console.log('Completed', 'Notification Deleted', 'success');
      }
    });
  };

  const handleCheckClick = (notification) => {
    const ownerEmail = notification.body.split(' : ')[0];
    const volunteerActivity = Volunteer.findOne({ activityName: notification.title });
    if (volunteerActivity && ownerEmail) {
      Meteor.call('volunteer.addToParticipant', volunteerActivity._id, ownerEmail, (error) => {
        if (error) {
          swal('Error', 'Could not add participant to volunteer activity.', 'error');
        } else {
          insertPending(notification, 'Your Participation Request Have Been Accepted');
          pendingRemove(notification.id);
          swal('Success', 'Participant added to volunteer activity.', 'success');
        }
      });
    } else {
      swal('Error', 'No matching volunteer activity found or missing participant information.');
    }
  };

  const handleXClick = (notification) => {
    swal({
      title: 'Confirm Denied?',
      text: 'Once denied, you will not be able to accept again!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        insertPending(notification, 'Your Participation Request Have Been Denied');
        if (willDelete) {
          pendingRemove(notification.id);
          swal('Success', 'Participant have been denied', 'success');
        }
      });
  };

  return (
    <>
      <Button variant="outline-secondary" onClick={toggleShow}>
        {notifications.length > 0 ? (
          <EnvelopeExclamationFill style={{ fontSize: '1.5rem' }} />
        ) : (
          <EnvelopeCheckFill style={{ fontSize: '1.5rem' }} />
        )}
      </Button>

      {show && (
        <div style={{
          position: 'absolute',
          top: '85px',
          right: '0px',
          backgroundColor: 'white',
          padding: '10px',
          border: '5px solid darkcyan',
        }}
        >
          {notificationsReady && currentNotifications.length > 0 ? (
            <>
              {currentNotifications.map((notification) => (
                <Toast key={notification.id} onClose={() => setShow(false)} style={{ marginBottom: '10px', position: 'relative' }}>
                  <Toast.Header>
                    <strong className="mr-auto">{notification.title}</strong>
                  </Toast.Header>
                  <Toast.Body>{notification.body}</Toast.Body>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN]) ? (
                      <>
                        <Button variant="success" onClick={() => handleCheckClick(notification)} style={{ marginRight: '10px', marginBottom: '5px' }}>
                          <CheckCircle style={{ fontSize: '1rem' }} />
                        </Button>
                        <Button variant="danger" onClick={() => handleXClick(notification)} style={{ marginLeft: '10px', marginBottom: '5px' }}>
                          <XCircle style={{ fontSize: '1rem' }} />
                        </Button>
                      </>
                    ) : (
                      <Button variant="danger" onClick={() => pendingRemove(notification.id)} style={{ margin: 'auto', marginBottom: '5px' }}>
                        <XCircle style={{ fontSize: '1rem' }} />
                      </Button>
                    )}
                  </div>
                </Toast>
              ))}
              <Pagination style={{ display: 'flex', justifyContent: 'center' }}>
                {/* eslint-disable-next-line no-shadow */}
                <Pagination.Prev onClick={() => setCurrentPage(currentPage => Math.max(1, currentPage - 1))} />
                {Array(Math.ceil(notifications.length / notificationsPerPage)).fill().map((_, idx) => (
                  <Pagination.Item key={idx + 1} active={idx + 1 === currentPage} onClick={() => paginate(idx + 1)}>
                    {idx + 1}
                  </Pagination.Item>
                ))}
                {/* eslint-disable-next-line no-shadow */}
                <Pagination.Next onClick={() => setCurrentPage(currentPage => Math.min(currentPage + 1, Math.ceil(notifications.length / notificationsPerPage)))} />
              </Pagination>
            </>
          ) : (
            <p>No new messages</p>
          )}
        </div>
      )}
    </>
  );
};

export default MailBox;
