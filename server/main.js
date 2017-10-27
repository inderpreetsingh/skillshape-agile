import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
        // Accounts.config({
        //   sendVerificationEmail: true
        // });
        Accounts.emailTemplates.from = 'admin <admin@techmeetups.com>';
        // The public name of your application. Defaults to the DNS name of the application (eg: awesome.meteor.com).
        Accounts.emailTemplates.siteName = 'skillshape';
        // A Function that takes a user object and returns a String for the subject line of the email.
        Accounts.emailTemplates.verifyEmail.subject = function(user) {
            return 'Confirm Your Email Address';
        };
        // A Function that takes a user object and a url, and returns the body text for the email.
        // Note: if you need to return HTML instead, use Accounts.emailTemplates.verifyEmail.html
        Accounts.emailTemplates.verifyEmail.text = function(user, url) {
            url = url.replace( '#/', '' );
            return 'click on the following link to verify your email address: ' + url;
        };
        Accounts.urls.resetPassword = function(token) {
          return Meteor.absoluteUrl('reset-password/' + token);
        };
  // code to run on server at startup

var _tagObj={"Dance":["African","Argentine tango","B-boying","Ballet","Ballroom dance","Belly dance","Bounce","Break Dancing","Capoeira","Cha Cha",
"Charleston","Classical Indian dance","Concert dance","Contact improvisation","Contemporary Dance","Disco / electronic dance","East Coast Swing",
"Ethnic dance","Experimental / freestyle","Flamenco","Flexing","Floating","Folk dance","Footwork","Foxtrot","Hip Hop / Street Dance","Jazz dance",
"Jitterbug","Krumping","Locking","MaculelÃª","Mambo","Medieval dance","Merengue","Metal Mosh","Modern dance","Quickstep","Reggaeton","Robot dance",
"Rumba","Salsa","Samba","Swing dance","Tango","Tap dance","Vogue","Waltz","Zumba"],
"Art/ Design/Craft":["Acrylic Painting","Cartoon Art","Crafting","Creative Writing","Crocheting","Drawing","Figure Drawing","Fingernail Art",
"Graphic Design","Hair Styling","Knitting","Makeup","Oil Paint","Sculpture","Sewing","Soap / Cosmetic","Stitching","Watercolor"],
"Sport/Exercise":["American Football","Baseball","Basketball","Boot Camp","Cycling","Darts","Football / Soccer","Frisbee","Gymnastics",
"High Intensity Interval Training","Jogging","Juggling","Other Ball Games","Parkour","Rugby","Sprinting","Swimming","Tai Chi","Tennis",
"Ultimate Frisbee","Walking","Weight / Resistance","Racketball"],
"Language":["Arabic","Bengali","Dutch","English","French","German","Hindi","Italian","Japanese","Mandarin","Portuguese","Russian","Spanish"],
"Coding and Computers":["Android","C#","C+","iOS","Javascript","Javascript","Meteor","Node","PHP","Python"],
"Business/Marketing":["Accounting","Business Strategy","Business Writing","Entrepreneurship","Marketing","Sales","Software Development"],
"Meditation/Religion":["Meditation","Catholic Prayer Meeting","Muslim Prayer Meeting","Buddhist Chanting","Protestant Prayer Meeting",
"Christian Meeting","Bible Study","Koran Study","Sutra Study"],
"Acting/Comedy":["Acting Class","Improvisation","Stand-Up Comedy","Movement / Slapstick"],
"Games":["Video Games","Role Playing Games","Miniature Games","Chess","Checkers","Poker","Board Games","Card Games"],
"Pets":["Dog Walks","Dog Grooming","Dog Meetups","Exotic Pet Meetups","Dog Training"],
"Parents/Children":["Child Meetup by Age","Parents with Autistic Children","Parents with Special Needs Children"],
"Yoga/Pilates":["Anusara","Ashtanga","Bikram","Hatha","Hot Yoga","Iyengar","Jivamukti","Kripalu","Kundalini","Prenatal",
"Restorative","Sivananda","Viniyoga","Vinyasa / Power","Yin"],
"Food and Beverage":["Cooking","Fermentation","Bread Making","Wine Tasting","Beer Making","Cocktail Mixing"]}

  if(tags.find().count()==0){

        for(var key in _tagObj){
            _tagObj[key].forEach((f)=>{
            tags.insert({tag:f,class:key});
        })
        }

        tags.insert({tag:'Aikido',class:'Martial Art'});
        tags.insert({tag:'American Karate',class:'Martial Art'});
        tags.insert({tag:'American Kenpo',class:'Martial Art'});
        tags.insert({tag:'Arnis/Eskrima/Kali',class:'Martial Art'});
        tags.insert({tag:'Brazilian jiu-jitsu',class:'Martial Art'});
        tags.insert({tag:'DaitÅ-ryÅ« Aiki-jÅ«jutsu',class:'Martial Art'});
        tags.insert({tag:'Danzan-ryÅ«',class:'Martial Art'});
        tags.insert({tag:'Hapkido',class:'Martial Art'});
        tags.insert({tag:'Iaido',class:'Martial Art'});
        tags.insert({tag:'Japanese Jujitsu',class:'Martial Art'});
        tags.insert({tag:'Japanese Karate',class:'Martial Art'});
        tags.insert({tag:'Japnese KenPo',class:'Martial Art'});
        tags.insert({tag:'Jeet Kune Do',class:'Martial Art'});
        tags.insert({tag:'Judo',class:'Martial Art'});
        tags.insert({tag:'Jujutsu',class:'Martial Art'});
        tags.insert({tag:'Kalaripayattu',class:'Martial Art'});
        tags.insert({tag:'Kendo',class:'Martial Art'});
        tags.insert({tag:'Kenjutsu',class:'Martial Art'});
        tags.insert({tag:'Kick Boxing',class:'Martial Art'});
        tags.insert({tag:'Krav Maga',class:'Martial Art'});
        tags.insert({tag:'Kung Fu',class:'Martial Art'});
        tags.insert({tag:'Mixed Martial Arts',class:'Martial Art'});
        tags.insert({tag:'Muay Thai',class:'Martial Art'});
        tags.insert({tag:'Ninjutsu',class:'Martial Art'});
        tags.insert({tag:'Nippon Kempo',class:'Martial Art'});
        tags.insert({tag:'Okinawan martial arts',class:'Martial Art'});
        tags.insert({tag:'Japanese Karate',class:'Martial Art'});
        tags.insert({tag:'Other Traditional Martial Art',class:'Martial Art'});
        tags.insert({tag:'Pankration',class:'Martial Art'});
        tags.insert({tag:'Sambo',class:'Martial Art'});
        tags.insert({tag:'Jujutsu',class:'Martial Art'});
        tags.insert({tag:'Savate',class:'Martial Art'});
        tags.insert({tag:'SCA',class:'Martial Art'});
        tags.insert({tag:'Shootfighting (American)',class:'Martial Art'});
        tags.insert({tag:'Small Circle Jujutsu',class:'Martial Art'});
        tags.insert({tag:'Sumo',class:'Martial Art'});
        tags.insert({tag:'Systema',class:'Martial Art'});
        tags.insert({tag:"T'ai chi ch'uan",class:'Martial Art'});
        tags.insert({tag:'Vale Tudo',class:'Martial Art'});
        tags.insert({tag:'Wing Chun',class:'Martial Art'});
        tags.insert({tag:'WuShu',class:'Martial Art'});

}

});

if (Meteor.isServer)
{
  S3.config = {
      key: 'AKIAIUDOMFJ4ZGYKIO6Q',
      secret: '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',
      bucket: 'skillshape',
      region: 'us-west-1'
  };
  Accounts.onCreateUser(function(options, user)
  {
      console.log("on account create");
      console.log(options);
      if(options.profile == null || options.profile == undefined){
        user.profile = {"role":"Admin","access_key":Math.random().toString(36).slice(2)}
        // Roles.addUsersToRoles(user._id,'admin')
        // console.log(Roles.userIsInRole(Meteor.userId(),'admin'));
      }else{
        user.profile =  options.profile
      }
      user.profile = _.extend(user.profile, {"user_type":"C"});

      debugger;

     if(options.preverfiedUser) {
        user.emails[0].verified=true;
        return user;
     }

      console.log("--------------------USER-------------------")
      
      console.log(user);

      console.log("--------------------OPTIONS-------------------")

      console.log(options);

      if(options.auto_created == true){
        try {
          userRegistration(user,options.password)
        } catch (e) {

        }
        return user;
      }
      try {
        userRegistration(user,"hidden")
      } catch (e) {
        console.log(e)
      }
      return user;
  });
  
    var userRegistration = function(user,pass)
    {
        var fromEmail = "admin@techmeetups.com";
        var toEmail = user.emails[0].address;
        Email.send({
            from: fromEmail,
            to: toEmail,
            replyTo: fromEmail ,
            subject: "skillshape Registration",
            text: "Hi "+user.emails[0].address+",\nYour Email: "+user.emails[0].address+" has been registered."+
            "\nYour password is : "+pass+"\n\n"+
            "Thank you.\n"+
            "The skillshape Team.\n"+Meteor.absoluteUrl()+"\n"
            // + "http://www.graphical.io/assets/img/Graphical-IO.png"
        });
    }

    var userFeedBack = function(user,email,message,request)
    {
        var fromEmail = "admin@techmeetups.com";
        var toEmail = "admin@techmeetups.com";
        Email.send({
            from: fromEmail,
            to: toEmail,
            replyTo: fromEmail ,
            subject: "skillshape Feedback",
            text: "Hi ,\nWe have feedback from : "+user+"("+email+")"+
            "\nHis feedback request is : "+request+"\n"+
            "\nMessage : "+message+"\n\n"+
            "Thank you.\n"+
            "The skillshape Team.\n"+Meteor.absoluteUrl()+"\n"
            // + "http://www.graphical.io/assets/img/Graphical-IO.png"
        });
    }

    var userPasswordReset = function(user,pass)
    {
        var fromEmail = "admin@techmeetups.com";
        var toEmail = user.emails[0].address;
        Email.send({
            from: fromEmail,
            to: toEmail,
            replyTo: fromEmail ,
            subject: "skillshape Password Reset",
            text: "Hi "+user.emails[0].address+",\nYour password has been reset."+
            "\nYour new password is : "+pass+"\n\n"+
            "Thank you.\n"+
            "The skillshape Team.\n"+Meteor.absoluteUrl()+"\n"
            // +"http://www.graphical.io/assets/img/Graphical-IO.png"
        });
    }

    Meteor.publish("roles", function ()
    {
        return Meteor.roles.find({});
    });

    var absolutePath = function(domain,href)
    {
        var url = require('url') ;
        var link = url.resolve(domain,href)
        return link
    }


    Meteor.methods({
      sendVerificationLink() {
         var userId = Meteor.userId();
         if ( userId ) {
           return Accounts.sendVerificationEmail( userId );
         }
       },
      get_url :function(url)
      {
        return Meteor.http.get(url, {headers: {"User-Agent": "Meteor/1.0"},timeout:25000});
      },
      sendfeedbackToAdmin : function(user,email,message,request){
        userFeedBack(user,email,message,request)
        return true;
      }
    });
  var restServiceGetCall = function (url)
  {
      var result = HTTP.get(url);
      if (result.statusCode == 200)
      {
          response = JSON.parse(result.content);
          return response;
      }
      else
      {
          var json = JSON.parse(result.content);
          throw new Meteor.Error(result.statusCode, json.error);
      }
  };
}
