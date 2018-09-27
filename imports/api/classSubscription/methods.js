import ClassSubscription from "./fields";
import isEmpty from "lodash/isEmpty";
import { check } from 'meteor/check';
Meteor.methods({
'classSubscription.isAlreadyMarked':function({userId, planId}){
    check(userId,String);
    check(planId,String);
    let result = ClassSubscription.find({userId,planId,status:'inProgress'}).fetch();
    if(!isEmpty(result)){
      return true;
    }
    else
    return false;
}

});
