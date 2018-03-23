import uuidv4 from 'uuid/v4';

const perClassPackagesData = [
  {
    _id: uuidv4(),
    title: 'Two Class Card',
    expiration: '29th May, 2018',
    price: '$800',
    classesCovered: 'Karatey, Yoga',
    noOfClasses: 2
  },
  {
    _id: uuidv4(),
    title: 'Six Class Card',
    expiration: '29th May, 2018',
    price: '$1200',
    classesCovered: 'Karatey, Yoga, Meditation, Music, Poetry, Dance',
    noOfClasses: 6
  },
  {
    _id: uuidv4(),
    title: 'One Class Card',
    expiration: '29th May, 2018',
    price: '$1200',
    classesCovered: 'Karatey, Yoga, Meditation',
    noOfClasses: 3
  },
];

export default perClassPackagesData;
