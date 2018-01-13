const monthlyPackagesData = [
  {
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
