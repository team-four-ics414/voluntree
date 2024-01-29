import React from 'react';
import { Button, Dialog } from '@material-ui/core';
import { FaCalendarPlus } from 'react-icons/fa';
import AddEventForm from '../forms/AddEventForm';
import ShowEventForm from '../forms/ShowEventForm';
import UpdateEventForm from '../forms/UpdateEventForm';

import { useEventContext } from '../../contexts/EventContext';

const chooseFormType = (props) => {
  if (props.type === 'add') {
    return <AddEventForm />;
  } if (props.type === 'show') {
    return <ShowEventForm />;
  } if (props.type === 'update') {
    return <UpdateEventForm />;
  }
};

export default function EventModal() {
  const {
    open,
    handleClickOpen,
    handleClose,
    formType,
    setFormType,
  } = useEventContext();

  return (
    <div>
      <Button
        variant="outlined"
        onClick={() => {
          handleClickOpen();
          setFormType('add');
        }}
      >
        <FaCalendarPlus />
      </Button>
      <Dialog open={open} onClose={handleClose}>
        {chooseFormType({ type: formType })}
      </Dialog>
    </div>
  );
}
