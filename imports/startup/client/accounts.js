import { Accounts } from "meteor/accounts-base";
import { browserHistory } from 'react-router';

const clearUserInfoStored = obj => {
  // console.log(".>>>>>>>>>>>>>>>>>>>>>>>>>>.", obj);
  localStorage.setItem("userInfoStored", false);
};

const onLoginHandle = obj => {
  clearUserInfoStored();
  const currentUser = Meteor.user();
  // console.log(obj, Meteor.user(), " ....");
  // debugger;
  if (window.location.pathname === '/'
    && currentUser.profile
    && currentUser.profile.userType === 'School') {
    localStorage.setItem('visitorRedirected', true);
    setTimeout(() => {
      browserHistory.push('/dashboard');
    }, 0)
  }

}

Accounts.onLogin(onLoginHandle);
Accounts.onLogout(clearUserInfoStored);
