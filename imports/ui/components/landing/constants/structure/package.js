import PropTypes from 'prop-types';

const PackageStructure = PropTypes.shape({
  _id: PropTypes.string,
  title: PropTypes.string,
  expiration: PropTypes.string,
  price: PropTypes.string,
  covers: PropTypes.string,
  noOfClasses: PropTypes.number
});

export default PackageStructure;
