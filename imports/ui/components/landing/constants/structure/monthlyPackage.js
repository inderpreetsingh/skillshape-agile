import PropTypes from 'prop-types';

const MonthlyPackage = PropTypes.shape({
  _id: PropTypes.string,
  title: PropTypes.string,
  paymentType: PropTypes.string,
  classTypesCovered: PropTypes.string,
  packages: PropTypes.arrayOf(PropTypes.shape({
    currency: PropTypes.string,
    amount: PropTypes.number,
    noOfMonths: PropTypes.number
  }))
});

export default MonthlyPackage;
