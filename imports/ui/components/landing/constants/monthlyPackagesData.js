import uuidv4 from 'uuid/v4';

const monthlyPackagesData = [
  {
    _id: uuidv4(),
    title: 'One Month Card',
    expiration: '29th May, 2018',
    price: '$800',
    classesCovered: 'Karatey, Yoga, Meditation',
    noOfClasses: 3
  },
  {
    _id: uuidv4(),
    title: 'Two Month Card',
    expiration: '29th May, 2018',
    price: '$1800',
    classesCovered: 'Karatey, Yoga, Meditation, Music',
    noOfClasses: 4
  },
  {
    _id: uuidv4(),
    title: 'Six Month Card',
    expiration: '4th Sept, 2018',
    price: '$3800',
    classesCovered: 'Yoga, Meditation, Music',
    noOfClasses: 3
  },
]

export default monthlyPackagesData;
