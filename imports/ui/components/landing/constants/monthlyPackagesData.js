import uuidv4 from 'uuid/v4';

const monthlyPackagesData = [
  {
    _id: uuidv4(),
    title: 'Monthly Package Name',
    paymentType: 'monthly direct deposit',
    classTypesCovered: 'karate, yoga',
    packages: [
      {
        currency: '$',
        amount: 120,
        noOfMonths: 4
      },
      {
        currency: 'Eu',
        amount: 15,
        noOfMonths: 6
      },
      {
        currency: '$',
        amount: 18,
        noOfMonths: 11
      },
      {
        currency: 'Eu',
        amount: 115,
        noOfMonths: 1
      }
    ]
  },
  {
    _id: uuidv4(),
    title: 'Monthly Package Name',
    paymentType: 'monthly deposit with installments',
    classTypesCovered: 'all class types covered',
    packages: [
      {
        currency: '$',
        amount: 12,
        noOfMonths: 4
      },
      {
        currency: 'Eu',
        amount: 115,
        noOfMonths: 6
      },
      {
        currency: '$',
        amount: 189,
        noOfMonths: 11
      },
      {
        currency: 'Eu',
        amount: 75,
        noOfMonths: 9
      }
    ]
  },
]

export default monthlyPackagesData;
