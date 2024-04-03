import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Volunteer } from '../../api/activities/VolunteerCollection';
import ParticipantsModal from '../components/ParticipantsModal';

const VolunteerList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [currentParticipants, setCurrentParticipants] = useState([]);
  const itemsPerPage = 10;

  const { volunteerData, isDataReady } = useTracker(() => {
    const subscription = Meteor.subscribe('VolunteerCollection');
    const dataReady = subscription.ready();
    const data = Volunteer.find({ owner: Meteor.user()?.username }, { sort: { createdAt: -1 } }).fetch();
    return {
      volunteerData: data,
      isDataReady: dataReady,
    };
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = volunteerData.slice(indexOfFirstItem, indexOfLastItem);

  const handleShowModal = (participants) => {
    setCurrentParticipants(participants);
    setShowModal(true);
  };

  const renderTableRows = () => {
    const emptyRows = itemsPerPage - currentItems.length;
    return (
      <>
        {currentItems.map((item, index) => (
          <tr key={index}>
            <td style={{ textAlign: 'center' }}>{item.activityName}</td>
            <td style={{ textAlign: 'center' }}>{item.participant.length}</td>
            <td style={{ textAlign: 'center' }}>
              <Button variant="link" onClick={() => handleShowModal(item.participant)}>
                View More
              </Button>
            </td>
          </tr>
        ))}
        {Array.from({ length: emptyRows }, (_, index) => (
          <tr key={`empty-${index}`}>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
        ))}
      </>
    );
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(volunteerData.length / itemsPerPage); i++) {
    pageNumbers.push(
      <Button key={i} onClick={() => setCurrentPage(i)} style={{ margin: '5px' }}>
        {i}
      </Button>,
    );
  }

  return (
    <div>
      {isDataReady ? (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th style={{ fontSize: '20px', textAlign: 'center' }}>Activity Name</th>
                <th style={{ fontSize: '20px', textAlign: 'center' }}>Number of Participants</th>
                <th style={{ fontSize: '20px', textAlign: 'center' }}>Participants</th>
              </tr>
            </thead>
            <tbody>
              {renderTableRows()}
            </tbody>
          </Table>
          <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>
            {pageNumbers}
          </div>
          <ParticipantsModal
            showModal={showModal}
            onHide={() => setShowModal(false)}
            participants={currentParticipants}
          />
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default VolunteerList;
