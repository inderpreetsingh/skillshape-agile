// Function for getting the maxmium classes text related to monthly package.
export const maximumClasses = (monthPrice) => {
  let result;
  if (monthPrice && monthPrice.noClasses) {
    result = `${monthPrice.noClasses} classes per `;
    if (monthPrice.duPeriod) {
      result += monthPrice.duPeriod;
    } else {
      result += 'month';
    }
  } else {
    result = 'Unlimited classes';
  }
  return result;
};
