import React from 'react';
import { FaCalendarPlus } from 'react-icons/fa';
import AddEventForm from './formsorms/AddEventForm';
import ShowEventForm from './forms/ShowEventForm';
import UpdateEventForm from './forms/UpdateEventForm';

import { useEventContext } from './EventContext';

const chooseFormType = (props) => {
  switch (props.type) {
  case 'add':
    return <AddEventForm />;
  case 'show':
    return <ShowEventForm />;
  case 'update':
    return <UpdateEventForm />;
  default:
    return null; // or a placeholder component if you prefer
  }
};

const EventModal = () => {
  const {
    open,
    handleClickOpen,
    handleClose,
    formType,
  } = useEventContext();

  // Assuming a simple modal implementation with TailwindCSS
  // adjust the classes based on your layout and design preferences
  return (
    <div>
      <button
        type="button"
        className="p-2 text-white bg-blue-500 hover:bg-blue-700 rounded-md flex items-center justify-center"
        onClick={() => {
          handleClickOpen();
        }}
      >
        <FaCalendarPlus className="mr-2" />
        Add Event
      </button>
      {open && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={handleClose}>
              <div className="absolute inset-0 bg-gray-500 opacity-75" />
            </div>
            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                {chooseFormType({ type: formType })}
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2,
                   bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventModal;
