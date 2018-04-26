export const getAverageNoOfRatings = (reviewsData) => {
  if(!reviewsData.length) {
    return ;
  }
  const totalReviews = reviewsData.length;
  const totalRatings = reviewsData.map(data => data.ratings).reduce((acc,currentVal) => acc + currentVal);
  const averageRatings = Math.round(totalRatings/totalReviews * 100)/100;
  const decimalValue = parseFloat(parseFloat(averageRatings % 1).toFixed(2));
  if(decimalValue >= 0.5) {
    return Math.ceil(averageRatings);
  }
  // console.info(totalRatings,totalReviews,totalRatings/totalReviews,averageRatings,"Average Ratings...");
  return Math.floor(averageRatings);
}
