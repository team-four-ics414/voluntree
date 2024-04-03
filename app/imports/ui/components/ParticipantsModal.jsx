import React, { useState } from 'react';
import { Modal, Table, Button } from 'react-bootstrap';

// eslint-disable-next-line react/prop-types
const ParticipantsModal = ({ showModal, onHide, participants }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // eslint-disable-next-line react/prop-types
  const currentItems = participants.slice(indexOfFirstItem, indexOfLastItem);

  const renderTableRows = () => {
    const rows = currentItems.map((email, index) => (
      <tr key={index}>
        <td>{email}</td>
      </tr>
    ));

    // Fill in the blanks if there are fewer than 10 items
    for (let i = rows.length; i < itemsPerPage; i++) {
      rows.push(
        <tr key={`empty-${i}`}>
          <td>&nbsp;</td>
        </tr>,
      );
    }

    return rows;
  };

  const pageNumbers = [];
  // eslint-disable-next-line react/prop-types
  for (let i = 1; i <= Math.ceil(participants.length / itemsPerPage); i++) {
    pageNumbers.push(
      <Button
        key={i}
        onClick={() => setCurrentPage(i)}
        style={{ margin: '5px' }}
      >
        {i}
      </Button>,
    );
  }

  return (
    <Modal show={showModal} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Participants</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Username</th>
            </tr>
          </thead>
          <tbody>
            {renderTableRows()}
          </tbody>
        </Table>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          {pageNumbers}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ParticipantsModal;
