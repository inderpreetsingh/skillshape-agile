import { browserHistory } from 'react-router';

export const clearUserCache = (obj) => {
  localStorage.setItem('userInfoStored', false);
  localStorage.setItem('visitorRedirected', false);
  localStorage.setItem('mySchoolSlug', null);
  localStorage.setItem('multipleSchools', true);
};

export const redirectUserBasedOnType = (currentUser, isUserSubsReady) => (e) => {
  // console.log(currentUser, isUserSubsReady, "-==================");
  const visitorType = localStorage.getItem('visitorType');
  // debugger;
  if (isUserSubsReady && currentUser && currentUser.profile.userType === 'School') {
    // const mySchoolSlug = localStorage.getItem("mySchoolSlug");
    // const multipleSchools = JSON.parse(localStorage.getItem("multipleSchools"));
    // if (!isEmpty(mySchoolSlug) && !multipleSchools) {
    //   // browserHistory.push(`/schools/${mySchoolSlug}`);
    // }
    browserHistory.push('/dashboard');
  } else if (isUserSubsReady && currentUser && currentUser.profile.userType !== 'School') {
    browserHistory.push('/');
  } else if (isUserSubsReady && !currentUser) {
    if (visitorType === 'school') {
      browserHistory.push('/skillshape-for-school');
    } else {
      browserHistory.push('/');
    }
  }
};
