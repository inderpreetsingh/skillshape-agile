import bodyParser from "body-parser";
import { isEmpty } from "lodash";
Picker.middleware(bodyParser.json());
Picker.middleware(bodyParser.urlencoded({ extended: false }));

Picker.route("/api/v1/users/login", (params, req, res, next) => {
  try {
    const { email, password } = req.body;
    let payload = {};
    if (email && password) {
      user = Meteor.users.findOne({ "emails.address": email });
      if (!isEmpty(user)) {
        let result = Accounts._checkPassword(user, password);
        const { error } = result;
        if (!error) {
          delete user.services;
          payload = user;
        } else if (error) {
          const { reason } = error;
          payload = { error: reason };
        }
      } else {
        payload = { error: "User Not Exists" };
      }
    } else {
      payload = { error: "Email and password is required." };
    }
    res.end(JSON.stringify(payload));
  } catch (error) {
    console.log("Error in /api/v1/users/", error);
    payload = { error: "Something Went Wrong" };
    res.end(JSON.stringify(payload));
  }
});

Picker.route("/api/v1/users/signUp", (params, req, res, next) => {
  try {
    const {
      name,
      email,
      userType,
      sendMeSkillShapeNotification,
      signUpType,
      birthYear,
      schoolName,
      password
    } = req.body;
    let payload = {};
    // If email is not provided.
    if(!email){
      payload = {error:'Email is Required.'};
      res.end(JSON.stringify(payload));
      return;
    }
    // Check is the email is exists;
    else{
      const userRecExist = Meteor.users.findOne({ "emails.address": email });
      if(!isEmpty(userRecExist)){
        payload = {error:'User Already Exists with this email.'};
        res.end(JSON.stringify(payload));
        return;
      }
    }
    let userData = { name, email, userType, sendMeSkillShapeNotification:JSON.parse(sendMeSkillShapeNotification), signUpType, birthYear, schoolName, password };
    // Create the new user
    Meteor.call("user.createUser",userData,(error,result)=>{
      if(error){
        payload = {error:error.error || 'Something Went Wrong!'};
      }
      else if (result){
        payload = {result:'User Created Successfully'}; 
      }
      res.end(JSON.stringify(payload));
    });
  } catch (error) {
    console.log("Error in /api/v1/users/signUp", error);
    payload = { error: "Something Went Wrong" };
    res.end(JSON.stringify(payload));
  }
});
