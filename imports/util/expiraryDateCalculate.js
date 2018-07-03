//Get Expiry date if no. of years to be added

export const getExpiryDateForPackages = (startDate, expPeriod, expDuration) => {
  console.log(
    "startDate, expPeriod, expDuration",
    startDate,
    expPeriod,
    expDuration
  );
  if (expDuration == null && expPeriod == null) {
    expDuration = 1;
    expPeriod = "Months";
  }
  if (expPeriod == "Year") {
    let date = new Date(startDate);
    let currentYear = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    let expiryDate = new Date(currentYear + parseInt(expDuration), month, day);
    return expiryDate;
  } else if (expPeriod == "Months") {
    startDate = new Date(startDate);
    return new Date(
      startDate.setMonth(startDate.getMonth() + parseInt(expDuration))
    );
  } else if (expPeriod == "Days") {
    // var someDate = new Date();
    // var numberOfDaysToAdd = 6;
    // let x = new Date(someDate.setDate(someDate.getDate() + numberOfDaysToAdd));
    let today = new Date(startDate);
    let newdate = new Date(startDate);
    console.log(
      "today.getDate() + expDuration",
      today.getDate() + parseInt(expDuration)
    );
    return new Date(newdate.setDate(today.getDate() + parseInt(expDuration)));
  }
  return new Date(startDate.setDate(startDate.getDate() + 1));
};
