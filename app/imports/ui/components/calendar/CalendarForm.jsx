import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';

const CalendarForm = ({ existingCalendar }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (existingCalendar) {
      setName(existingCalendar.name);
      setDescription(existingCalendar.description || '');
    }
  }, [existingCalendar]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const calendarData = { name, description };

    if (existingCalendar) {
      Meteor.call('Calendars.update', existingCalendar._id, calendarData, (error) => {
        if (!error) {
          alert('Calendar updated successfully');
        } else {
          alert(error.reason);
        }
      });
    } else {
      Meteor.call('Calendars.insert', calendarData, (error) => {
        if (!error) {
          alert('Calendar created successfully');
        } else {
          alert(error.reason);
        }
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">{existingCalendar ? 'Update' : 'Create'}</button>
    </form>
  );
};

export default CalendarForm;
