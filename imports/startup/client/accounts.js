import { Accounts } from "meteor/accounts-base";
import { clearUserCache } from '/imports/util';

Accounts.onLogin(clearUserCache);
Accounts.onLogout(clearUserCache);
