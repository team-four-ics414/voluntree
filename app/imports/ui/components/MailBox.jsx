import React, { useState } from 'react';
import { Toast, Button, Pagination } from 'react-bootstrap';
import { EnvelopeCheckFill, EnvelopeExclamationFill, CheckCircle, XCircle } from 'react-bootstrap-icons';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Pending } from '../../api/activities/PendingCollection';

const MailBox = () => {
  const [show, setShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 3;

  const { notifications, notificationsReady } = useTracker(() => {
    const subscription = Pending.subscribePending();
    const ready = subscription.ready();
    const pendingNotifications = Pending.find({ organizationID: Meteor.user()?.username }, { sort: { createdAt: -1 } }).fetch();
    return {
      notifications: pendingNotifications.map(item => ({
        id: item._id,
        title: item.activityName,
        body: `${item.owner} : ${item.comment}`,
      })),
      notificationsReady: ready,
    };
  }, []);

  const toggleShow = () => setShow(!show);

  const lastNotificationIndex = currentPage * notificationsPerPage;
  const firstNotificationIndex = lastNotificationIndex - notificationsPerPage;
  const currentNotifications = notifications.slice(firstNotificationIndex, lastNotificationIndex);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleCheckClick = () => {
    console.log('Check clicked');
  };

  const handleXClick = () => {
    console.log('X clicked');
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
                    <Button variant="success" onClick={handleCheckClick} style={{ marginRight: '10px', marginBottom: '5px' }}>
                      <CheckCircle style={{ fontSize: '1rem' }} />
                    </Button>
                    <Button variant="danger" onClick={handleXClick} style={{ marginLeft: '10px', marginBottom: '5px' }}>
                      <XCircle style={{ fontSize: '1rem' }} />
                    </Button>
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
