import PropTypes from 'prop-types';

const CardStructure = PropTypes.shape({
    _id: PropTypes.string.isRequired,
    reviews: PropTypes.number,
    ratings: PropTypes.number,
    classTypeImg: PropTypes.string,
    name: PropTypes.string,
    desc: PropTypes.string
});

export default CardStructure;
