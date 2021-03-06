//Get Expiry date if no. of years to be added

export const getExpiryDateForPackages = (startDate, expPeriod="Months", expDuration) => {
 if(!expDuration){
  expDuration = 1;
 }
  if (expPeriod == "Years") {
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
    return new Date(newdate.setDate(today.getDate() + parseInt(expDuration)));
  }
  else if(expPeriod == 'Weeks'){
    let days = 7 * parseInt(expDuration);
   return new Date(new Date().getTime()+(days*24*60*60*1000));
  }
  return new Date(startDate.getTime()+1000*60*60*24);
};
