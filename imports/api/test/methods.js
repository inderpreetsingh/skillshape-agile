
import {sendRequestReceivedEmail} from '/imports/api/email/index.js';
Meteor.methods({
    'test.email':()=>{
        try{
            let email = 'ramesh.bansal.daffodilsw.com';
            let name  = "random";
            let url = Meteor.absoluteUrl();
            sendRequestReceivedEmail({toEmail:email, fromEmail:email, ownerName:name, currentUserName:name,  classTypeName:name, schoolPageLink:url, updateLink: url, memberLink:url, requestFor:name});
            
        }
        catch(error){
			console.log('TCL: catch -> error', error)
        }
    }
})