var bodyParser = require("body-parser");
Picker.middleware(bodyParser.json());
Picker.middleware(bodyParser.urlencoded({ extended: false }));
var dataFile = function(params, request, response, next) {
  console.log(" request============", request.body);
  // var request = request.body;
  // console.log("request type", request.type);
  // switch (request.type) {
  //   case "customer.subscription.updated":
  //     stripeUpdateSubscription(request.data.object);
  //     break;
  //   case "invoice.payment_succeeded":
  //     stripeCreateInvoice(request.data.object);
  //     break;
  // }
  // this.response.statusCode = 200;
  // this.response.end("");
};
Picker.route("/stripe-webhooks", dataFile);
