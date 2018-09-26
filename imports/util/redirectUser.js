import { browserHistory } from "react-router";

export const redirectUserBasedOnType = (currentUser, isUserSubsReady) => e => {
  console.log(currentUser, isUserSubsReady, "-==================");
  const visitorType = localStorage.getItem("visitorType");
  debugger;
  if (
    isUserSubsReady &&
    currentUser &&
    currentUser.profile.userType === "School"
  ) {
    const mySchoolSlug = localStorage.getItem("mySchoolSlug");
    const multipleSchools = JSON.parse(localStorage.getItem("multipleSchools"));
    if (mySchoolSlug !== "null" && !multipleSchools) {
      browserHistory.push(`/schools/${mySchoolSlug}`);
    } else {
      browserHistory.push("/skillshape-for-school");
    }
  } else if (
    isUserSubsReady &&
    currentUser &&
    currentUser.profile.userType !== "School"
  ) {
    browserHistory.push("/");
  } else if (isUserSubsReady && !currentUser) {
    if (visitorType === "school") {
      browserHistory.push("/skillshape-for-school");
    } else {
      browserHistory.push("/");
    }
  }
};
