Template.sidebar.helpers(
{
    helperSlabColour : function(rule, value)
    {
        console.log('helperSlabColour:'+rule)
        console.log('helperSlabColour.val:'+value)
        return getColour( rule, value )
    },
    render_graph : function(value){
      if(value == undefined){
        value= 0;
      }
      Meteor.defer(function(){
      console.log(value);
      $('#test-circle').empty().removeData();
      console.log("-------------remove---------------");
      $("#test-circle").circliful({
             animationStep: 5,
             foregroundColor: '#35b729',
             foregroundBorderWidth: 15,
             backgroundBorderWidth: 15,
             percent: value,
             noPercentageSign: true
         });
       });
    },
    helperAdvice : function(advice)
    {
        if( advice )
          return advice ;
        else
          return 'No Advice...' ;
    },
  	digi_page_url :function()
  	{
      var website_name="";
      var company="";
      if(Meteor.user()){
        if(Meteor.user().profile.role == "Admin"){
          company = Company.findOne({base_company:true})
        }else{
          company_id = Meteor.user().profile.company_id;
          company = Company.findOne({_id:company_id})
        }
        if(company){
          website_name = company.url
        }
      }else{
        website_name =   Cookie.get('digi_page_url') == undefined ? "" : Cookie.get('digi_page_url');
      }
      return website_name;
	    // var website_name =   Cookie.get('digi_page_url') == undefined ? "" : Cookie.get('digi_page_url');
	    // return ReactiveMethod.call('page_scrap',website_name,1,1);
  	},
    validate_user : function(){
      if(Meteor.userId() && Meteor.user().profile){
        return true;
      }else{
        return false;
      }
    },
    current_user_pic_id : function(){
      return Meteor.user().profile.pic
    },
    digi_company_name : function(){
      if(Meteor.user()){
        if(Meteor.user().profile.role == "Admin"){
          company = Company.findOne({base_company:true})
        }else{
          company_id = Meteor.user().profile.company_id;
          company = Company.findOne({_id:company_id})
        }
        if(company){
          return company.name;
        }
      }else{
        return ""
      }
    },
  	greeting :function()
  	{
      var website_name="";
      if(Meteor.user()){
        if(Meteor.user().profile.role == "Admin"){
          company = Company.findOne({base_company:true})
        }else{
          company_id = Meteor.user().profile.company_id;
          company = Company.findOne({_id:company_id})
        }
        if(company){
          website_name = company.url
        }
      }else{
        website_name =   Cookie.get('digi_page_url') == undefined ? "" : Cookie.get('digi_page_url');
      }

 		var ret  = {} ;
 			ret =  DigitalAssessmentReports.findOne({ website_name: website_name} ,
 			{ sort : { created_at : -1 } } ) ;

 			if( !ret )
 			{

 				ret = { website_name : website_name , website_basic_score : 0 } ;
 			}

      if( ret.top_score )
      {
        console.log('ret.top_score:'+ret.top_score)

        //$("#test-circle").remove() ;

        //$('#test-circle').empty().removeData().attr('data-percent', ret.top_score).circliful()


         // $("#test-circle").circliful(
         // {
         //      animationStep: 5,
         //      foregroundColor: '#35b729',
         //      foregroundBorderWidth: 15,
         //      backgroundBorderWidth: 15,
         //      percent: ret.top_score
         //  });

      }

 		return ret ;
	},
  is_image_available : function(desktop_image){
      return desktop_image != undefined && desktop_image.length > 1;
  },
	webnamer :function()
	{
    	var website_name =   Cookie.get('digi_page_url') == undefined ? "" : Cookie.get('digi_page_url');
		//DigitalAssessmentReports.find({"website_name":"www.fb1.com"}).fetch()
		return website_name;
	},
  	digi_page_result :function()
  	{
    	var website_name =   Cookie.get('digi_page_url') == undefined ? "" : Cookie.get('digi_page_url');
    	// return ReactiveMethod.call('page_scrap',website_name,1,0);
  	},
  	website_name:function()
	{
    	var website_name =   Cookie.get('digi_page_url') == undefined ? "" : Cookie.get('digi_page_url');
    	return website_name;
  	},
  	count_data: function(data)
  	{
    	return data.length
  	},
    show_last_date : function( dt )
    {
        if( !dt )
          return 'No last scan date' ;
        else
          return dt.toDateString() ;

    },
    base_company : function(){
      if(Meteor.user()){
        if(Meteor.user().profile.role == "Admin"){
          company = Company.findOne({base_company:true})
        }else{
          company_id = Meteor.user().profile.company_id;
          company = Company.findOne({_id:company_id})
        }
        return company
      }else{
        return[];
      }
    },
    companylogo: function (id)
    {
      return CompanyImages.find({_id:id});
    }
});
Template.registerHelper("latest_domain_report", function () {
  var website_name="";
  if(Meteor.user()){
    if(Meteor.user().profile.role == "Admin"){
      company = Company.findOne({base_company:true})
    }else{
      company_id = Meteor.user().profile.company_id;
      company = Company.findOne({_id:company_id})
    }
    if(company){
      website_name = company.url
    }
  }else{
    var website_name =   Cookie.get('digi_page_url') == undefined ? "" : Cookie.get('digi_page_url');
  }

  var ret  = {} ;
   ret =  DigitalAssessmentReports.findOne({ website_name: website_name} ,
   { sort : { created_at : -1 } } ) ;

   if( !ret )
   {
     startDAR();
     ret = { website_name : website_name , website_basic_score : 0 } ;
   }
  return ret ;
});

Template.sidebar.rendered = function()
{

}
Template.sidebar.events(
{
  "click .startRefresh": function(event, template)
  {
     if( startDAR() )
          Router.go('/assessment') ;

    // event.preventDefault();
    // 	var notify = $.notify('<strong>Scanning</strong> This will take some time...',
    // 	 {
    // 		type: 'success',
  		// 	allow_dismiss: true,
  		// 	showProgressbar: false,
    //     delay:0
  		// });
    //   var website_name = "";
  		// $('#refreshIcon').toggleClass('fa-spin','');
  		// $('#assessmentScore').toggleClass('hide','') ;


    //   if(Meteor.user()){
    //     if(Meteor.user().profile.role == "Admin"){
    //       company = Company.findOne({base_company:true})
    //     }else{
    //       company_id = Meteor.user().profile.company_id;
    //       company = Company.findOne({_id:company_id})
    //     }
    //     if(company){
    //       website_name = company.url
    //     }else{
    //       return;
    //     }
    //   }else{
    //     website_name =   Cookie.get('digi_page_url') == undefined ? "" : Cookie.get('digi_page_url');
    //   }

    //   if(company && Meteor.userId()){
    //     var doc = { website_name:website_name,created_at : new Date(),company_id:company._id,user_id:Meteor.userId()};
    //   }else{
    //     var doc = { website_name:website_name,created_at : new Date()};
    //   }

    //   try {
    //     get_urlscore(website_name,notify,doc);

    //     console.log("Assessment");
    //   } catch (e) {
    //       console.log(e);
    //   } finally {

    //   }
    //   Router.go('/assessment')
  },
  "click .comming_soon": function(){
    swal({
        title: 'Comming Soon',
        text: "Comming Soon !",
        type: 'success',
        // showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ok'
      }).then(function()
      {})
  },
  "click .scroll_top" : function(event, template){
    $('.sidebar-wrapper').animate({ scrollTop: $(event.currentTarget).offset().top+300}, 500);
  }
});
