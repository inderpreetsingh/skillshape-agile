import PropTypes from 'prop-types';

const ReviewStructure = PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.number,
    ratings: PropTypes.number,
    comment: PropTypes.string,
    imgSrc: PropTypes.string
});

export default ReviewStructure;
