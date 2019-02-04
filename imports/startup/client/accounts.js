import { Accounts } from "meteor/accounts-base";
const clearUserInfoStored = obj => {
  localStorage.setItem("userInfoStored", false);
};

Accounts.onLogin(clearUserInfoStored);
Accounts.onLogout(clearUserInfoStored);
