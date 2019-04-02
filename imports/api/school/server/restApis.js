import  bodyParser from "body-parser";
Picker.middleware(bodyParser.json());
Picker.middleware(bodyParser.urlencoded({ extended: false }));


Picker.route("/restApiTest",(params, request, response, next  )=>{
    response.end('Success Message');
  })
