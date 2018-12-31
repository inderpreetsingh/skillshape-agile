
import { HTTP } from 'meteor/http';
import {errorBoundaryEmail} from '/imports/api/email';
Meteor.methods({
    'urlToBase64.urlToBase64':(url)=>{
        try{
            let response = HTTP.call('GET', url,{npmRequestOptions: { encoding: null }})
            let data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(response.content).toString('base64');
            return data;
        }catch(error){
          return error;
        }
      
    },
    'urlToBase64.errorBoundary':({error,errorInfo})=>{
        errorBoundaryEmail({error,errorInfo});
    }
})