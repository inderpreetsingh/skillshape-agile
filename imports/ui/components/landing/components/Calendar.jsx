import React from 'react';
import PropTypes from 'prop-types';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';

BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

const Calendar = (props) => (
  <div>
    <BigCalendar
      startAccessor='startDate'
      endAccessor='endDate'
    />
  </div>
);

Calendar.propTypes = {
  startAccessor: PropTypes.string,
  endAccessor: PropTypes.string
}

export default Calendar;
