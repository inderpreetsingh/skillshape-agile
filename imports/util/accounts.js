import { Meteor } from 'meteor/meteor';
import { browserHistory } from 'react-router';

export const logoutUser = () => {
    Meteor.logout();
    setTimeout(function () {
        browserHistory.push("/");
    }, 1000);
}