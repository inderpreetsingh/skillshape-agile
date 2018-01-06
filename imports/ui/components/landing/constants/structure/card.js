import PropTypes from 'prop-types';

const CardStructure = PropTypes.shape({
    id: PropTypes.string.isRequired,
    reviews: PropTypes.number,
    ratings: PropTypes.number,
    imgSrc: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string
});

export default CardStructure;
