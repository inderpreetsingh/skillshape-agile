import React from 'react';

import { isOption } from './utils';
import './fullcalendar.css'
import './fullcalendar.min.js'

class FullCalendar extends React.Component {
  componentDidMount() {
    const { options, onDateChanged } = this.props;

    this.extendCalendarOptions = (calendarOptions) => {
      const defaultOptions = {
        viewRender(view) {
          const { intervalStart, intervalEnd } = view;

          const toDate = (momentDate) => momentDate.toDate();

          if (onDateChanged && typeof onDateChanged === 'function') {
            onDateChanged(toDate(intervalStart), toDate(intervalEnd));
          }
        },
      };

      return Object.assign({}, defaultOptions, calendarOptions);
    };

    this.calendar = $('#fullcalendar-container');

    const calendarOptions = this.extendCalendarOptions(options);

    this.calendar.fullCalendar(calendarOptions);
  }

  componentWillReceiveProps(newProps) {
    const { options: newOptions } = newProps;
    const { options } = this.props;


    Object.keys(newOptions).forEach(optionName => {
      // update options dynamically
      if (isOption(optionName) && newOptions[optionName] !== options[optionName]) {
        this.calendar.fullCalendar('option', optionName, newOptions[optionName]);
      }
    });

    this.calendar.fullCalendar('refetchEvents');
    //this.calendar.fullCalendar('changeView', newOptions.defaultView);
    // this.calendar.fullCalendar('gotoDate', newOptions.defaultDate);
  }

  render() {
    return (
      <div id="fullcalendar-container"></div>
    );
  }
}


export {
  FullCalendar,
};
