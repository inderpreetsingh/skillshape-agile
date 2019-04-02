import  bodyParser from "body-parser";
Picker.middleware(bodyParser.json());
Picker.middleware(bodyParser.urlencoded({ extended: false }));


Picker.route("/v1/users/:email/:password",(params, request, response, next  )=>{
    const {email,password} = params;
    user = Meteor.users.findOne({ 'emails.address': email });
    if(user){
      let result = Accounts._checkPassword(user, password);
			const {error} = result
      if(!error){
        response.end(JSON.stringify(result));
      }
      else if(error){
        response.end(JSON.stringify(error))
      }
    }
    else{
      response.end('User Not Found')
    }
    })
  
