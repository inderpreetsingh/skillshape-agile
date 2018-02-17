import PropTypes from 'prop-types';

const ClassTime = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  classTimes: PropTypes.arrayOf(PropTypes.shape({
    time: PropTypes.string,
    timePeriod: PropTypes.string,
    duration: PropTypes.number,
    day: PropTypes.string
  })),
  description: PropTypes.string.isRequired,
  addToCalendar: PropTypes.bool.isRequired,
  scheduleType: PropTypes.string.isRequired,
  isTrending: PropTypes.bool
});

export default ClassTime;
