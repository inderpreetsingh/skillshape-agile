import React from 'react';
import PropTypes from 'prop-types';
import { Calendar } from 'react-widgets';


// BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

const MyCalendar = (props) => (
  <div>
      <Calendar
        dateFormat={dt => String(dt.getDate())}
    />
  </div>
);

MyCalendar.propTypes = {
  startAccessor: PropTypes.string,
  endAccessor: PropTypes.string
}

export default MyCalendar;
