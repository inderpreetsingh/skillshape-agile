import uuidv4 from 'uuid/v4';

const reviewsData = [{
    _id: uuidv4(),
    name: 'vishal',
    ratings: 5,
    imgSrc: '/images/classtype/reviewer.png',
    comment: 'The school was excellent',
},
{
    _id: uuidv4(),
    ratings: 4.5,
    imgSrc: '/images/classtype/reviewer.png',
    name: 'Arun',
    comment: 'My Time here was so enjoyable',
},
{
    _id: uuidv4(),
    ratings: 3,
    imgSrc: '/images/classtype/reviewer.png',
    name: 'sudhir',
    comment: 'Average school, nothing special about it.',
},
{
    _id: uuidv4(),
    ratings: 4,
    imgSrc: '/images/classtype/reviewer.png',
    name: 'kamil',
    comment: 'Had lots of fun and made a lots of new friends',
},
];

export default reviewsData;
