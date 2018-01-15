import uuidv4 from 'uuid/v4';

const perClassPackagesData = [
  {
    _id: uuidv4(),
    title: 'per class package name',
    currency: '$',
    amount: 120,
    expiration: 'none',
    noOfClasses: 1,
    classTypesCovered: 'karate, yoga'
  },
  {
    _id: uuidv4(),
    title: 'per class package name',
    currency: 'Eu',
    amount: 15,
    noOfClasses: 2,
    expiration: '13 days from now',
    classTypesCovered: 'karate, yoga'
  },
  {
    _id: uuidv4(),
    title: 'per class package name',
    currency: '$',
    amount: 18,
    noOfClasses: 7,
    expiration: 'none',
    classTypesCovered: 'all classTypes covered'
  },
  {
    _id: uuidv4(),
    title: 'per class package name',
    currency: 'Eu',
    amount: 120,
    noOfClasses: 9,
    classTypesCovered: 'karate, yoga'
  }
];

export default perClassPackagesData;
