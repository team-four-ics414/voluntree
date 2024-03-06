import React from 'react';
import PropTypes from 'prop-types';

const CalendarDateOverlay = ({ date }) => {
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' }).toUpperCase();

  return (
    <div className="calendar-overlay">
      <div className="calendar-overlay-day">{day}</div>
      <div className="calendar-overlay-month">{month}</div>
    </div>
  );
};

CalendarDateOverlay.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
};

export default CalendarDateOverlay;
