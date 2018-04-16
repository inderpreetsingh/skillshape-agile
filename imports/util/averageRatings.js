export const getAverageNoOfRatings = (reviewsData) => {
  if(!reviewsData.length) {
    return ;
  }
  const totalReviews = reviewsData.length;
  const totalRatings = reviewsData.map(data => data.ratings).reduce((acc,currentVal) => acc + currentVal);
  const averageRatings = Math.round(totalRatings/totalReviews * 10)/10;
  console.info(totalRatings,totalReviews,totalRatings/totalReviews,averageRatings,"Average Ratings...");
  return averageRatings;
}
