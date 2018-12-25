export const normalizeMonthlyPricingData = monthlyPricingData => {
  if (monthlyPricingData) {
    let normalizedMonthlyPricingData = [];

    for (let monthlyPricingObj of monthlyPricingData) {
      monthlyPricingObj &&
        monthlyPricingObj.pymtDetails &&
        monthlyPricingObj.pymtDetails.forEach(payment => {
          const myMonthlyPricingObj = Object.assign({}, monthlyPricingObj);
          myMonthlyPricingObj.pymtDetails = monthlyPricingObj.pymtDetails;
          myMonthlyPricingObj.uiPayment = [];
          myMonthlyPricingObj.uiPayment.push(payment);
          normalizedMonthlyPricingData.push(myMonthlyPricingObj);
        });
    }

    return normalizedMonthlyPricingData;
  } else {
    return monthlyPricingData;
  }
};

export const seperatePackagesPerClass = (packagesData, classTypeIds) => {
  return classTypeIds.map(classTypeId => {
    return {
      classTypeId,
      packages: packagesData.filter(packageData => packageData.classTypeId.includes(classTypeId))
    }
  })
}
