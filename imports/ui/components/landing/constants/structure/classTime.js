import PropTypes from 'prop-types';

const ClassTime = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  timePeriod: PropTypes.string.isRequired,
  days: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  addToCalendar: PropTypes.bool.isRequired,
  scheduleType: PropTypes.string.isRequired,
  isTrending: PropTypes.bool
});

export default ClassTime;
