import uuidv4 from 'uuid/v4';

const reviewsData = [{
    _id: uuidv4(),
    name: 'Mr. Variable',
    ratings: 5,
    imgSrc: '/images/classtype/reviewer.png',
    comment: 'It was fun having class here, I made so many new friends and new connections here',
},
{
    _id: uuidv4(),
    ratings: 4.5,
    imgSrc: '/images/classtype/default-reviewer.png',
    name: 'Dr. Function',
    comment: 'I have gotten confidence, strength and health from this class. Last time I checked all that was priceless.',
},
{
    _id: uuidv4(),
    ratings: 3,
    imgSrc: '/images/classtype/reviewer2.png',
    name: 'Mr. Sudhir',
    comment: 'Average school, nothing special about it.',
},
{
    _id: uuidv4(),
    ratings: 3,
    imgSrc: '/images/classtype/default-reviewer.png',
    name: 'Mr. Sudhir',
    comment: 'I have gotten confidence, strength and health from this class. Last time I checked all that was priceless.',
},
];

export default reviewsData;
