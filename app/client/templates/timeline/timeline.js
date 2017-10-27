Template.timeline.helpers(
{
    timelist: function ()
    {
      if(Meteor.user())
      {
      return DigitalAssessmentReports.find({company_id:Router.current().params["id"]},{ sort : { created_at : -1 }});
    }else{
      var website_name =   Cookie.get('digi_page_url') == undefined ? "" : Cookie.get('digi_page_url');
      return DigitalAssessmentReports.find({website_name:website_name});
    }
    },
    even: function (value) {
       return (value % 2) === 0;
   },
   show_last_date : function( dt )
    {
        if( !dt )
          return 'Unknown' ;
        else
          return dt.toDateString() ;

    }

});


Template.timeline.events(
{
  "click .startRefresh": function(event, template)
  {
      if( startDAR() )
          Router.go('/assessment') ;
  }

});

startDAR = function()
{
        var notify = $.notify('<strong>Scanning</strong> This will take some time...',
       {
        type: 'success',
        allow_dismiss: true,
        showProgressbar: false,
        delay:0
      });
      var website_name = "";
      $('#refreshIcon').toggleClass('','fa-spin');
      //$('#assessmentScore').toggleClass('hide','') ;


      if(Meteor.user())
      {
        if(Meteor.user().profile.role == "Admin")
        {
          company = Company.findOne({base_company:true})
        }
        else
        {
          company_id = Meteor.user().profile.company_id;
          company = Company.findOne({_id:company_id})
        }
        if(company)
        {
          website_name = company.url
        }
        else
        {
          return;
        }
      }
      else
      {
        website_name =   Cookie.get('digi_page_url') == undefined ? "" : Cookie.get('digi_page_url');
      }


      //console.log(Session.get('finalresult'));

      if(company && Meteor.userId())
      {
        var doc = { website_name:website_name,created_at : new Date(),company_id:company._id,user_id:Meteor.userId()};
      }
      else
      {
        var doc = { website_name:website_name,created_at : new Date()};
      }
      // Meteor.call('addDigitalAssessmentReports',doc) ;
      // addDigitalAssessmentReports(doc) ;
      try
      {
        get_urlscore(website_name,notify,doc);
        // check_urlquality(website_name) ;
        console.log("Assessment");
      }
      catch (e)
      {
          console.log(e);
      }
      finally
      {
          $('#refreshIcon').toggleClass('fa-spin','');
          return true ;
      }
      $('#refreshIcon').toggleClass('fa-spin','');

      return true ;
}

finishDAR = function()
{
    notify.close();
    $('#refreshIcon').toggleClass('fa-spin','');
}
