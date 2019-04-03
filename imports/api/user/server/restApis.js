import bodyParser from "body-parser";
import { isEmpty } from "lodash";
Picker.middleware(bodyParser.json());
Picker.middleware(bodyParser.urlencoded({ extended: false }));

Picker.route("/api/v1/users/", (params, req, res, next) => {
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
          payload = { error:reason };
        }
      } else {
        payload = { error: "User Not Exists" };
      }
    } else {
      payload = { error: "Email and password is required." };
    }
    res.end(JSON.stringify(payload));
  } catch (error) {
    res.end(JSON.stringify({ error: error }));
  }
});
