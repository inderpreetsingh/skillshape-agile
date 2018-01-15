import PropTypes from 'prop-types';

const PerClassPackage = PropTypes.shape({
  _id: PropTypes.string,
  title: PropTypes.string,
  currency: PropTypes.string,
  amount: PropTypes.number,
  expiration: PropTypes.string,
  noOfClasses: PropTypes.number,
  classTypesCovered: PropTypes.string
});

export default PerClassPackage;
