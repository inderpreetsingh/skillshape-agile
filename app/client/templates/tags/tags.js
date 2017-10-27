subscribeTags = function()
{
    Meteor.autorun(function()
    {
      if( getCurrentUserId() != undefined ) 
      {
          window.tagSub = Meteor.subscribe("tags",getCurrentUserId(), 
          function()
          {
            console.log('Tags loaded') ; 
          }) ;
      } 

    }) ;
}

Template.registerHelper('entTags', function ( tagstr, tagclass, noupdatemode, max )
{
    if( noupdatemode )
        tagstr = Session.get('tagStr') ; 

    return getEntTags(tagstr, tagclass , max) ; 
});

Template.registerHelper('parseTags', function ( tagstr, noupdatemode  )
{
    if( noupdatemode )
        tagstr= Session.get('tagStr');
    
    var ret = tag2List(tagstr) ; 
    
    if(ret.length > 10 )
      ret = ret.slice(0, 10)
    
    return ret ; 
});

Template.registerHelper('storedTags', function (  )
{
    tagstr = Session.get('tagStr') ; 
    return tag2List(tagstr) ; 
});




Template.registerHelper('countTags', function ( tagstr )
{
    
   if( !tagstr )
    return '' ; 

   var taglist = tag2List(tagstr) ; 
     
   return taglist.length ; 
});

Template.registerHelper('colourClickedTag', function ( tag )
{
    if( Session.get('clickedTag') !== tag) 
      return 'label-default' ;   
    else   
      return 'label-success' ;  
});

Template.registerHelper('helperTags', function ( tag, tagicon )
{
    if( tagicon )
        return tagicon ; 

    var taglist = tag2List( tag ) ;  

    if( tagEmpty( taglist ) )
      return 'fa fa-tag' ; 
    else
      return 'fa fa-tags' ;   
});

Template.registerHelper('helperClassName', function ( tc, tcd  )
{
    if( tcd )
        return tcd ; 
    else if( tc )
        return tc ; 
    else 
        return 'Tag' ;      
}) ; 


Template.tags.helpers(
    {
        helperTagCountStyle : function( tagstr)
        {
               if( !tagstr )
                    return '' ; 

               var taglist = tag2List(tagstr) ; 
                 
               if( taglist.length > 0)
                    return 'badge' ; 
        }, 

        emptyTags : function( tag )
        {
          // var tagId = $(event.currentTarget).attr('id');

          // if( Session.get('addTagChatId') === tagId)
          //   return false ; 

            var taglist = tag2List( tag ) ; 
            return tagEmpty( taglist ) ; 
        }, 
        showEntTagClicked : function(id)
        {
            if( Session.get('showEntTagId') === id )
              return true ; 
            else
              return false ; 
        }
    }) ; 


    Template.tags.events(
    {
        "click .clickEntTag": function(event, template)
        {
            var tagId = $(event.currentTarget).attr('data');
            var tagTable = $(event.currentTarget).attr('table');
            var tagColumn = $(event.currentTarget).attr('column');
            var tagClass = $(event.currentTarget).attr('tagclass');
            var tagStr = $(event.currentTarget).attr('tag');    
            var tagClick = $(event.currentTarget).attr('enttag');
            var tagNoupdate = $(event.currentTarget).attr('tagnoupdate');

            if( tagNoupdate )
            {
                tagStr = Session.get('tagStr') ; 
                var tagList = [] ; 

                tagList = tag2List(tagStr) ; 
                if( !tagExist( tagList,tagClick) )
                {
                    tagList = tagAppend(tagList,tagClick) ; 
                    tagStr = list2Tag(tagList) ; 
                    Session.set('tagStr',tagStr) ; 

                    //animateThis($(event.currentTarget),'bounce') ;
                }   

                return ; 

            }   


            if( ! tagAdd(tagTable, tagId, tagStr, tagClick, tagClass, tagColumn, tagNoupdate) )
                //animateThis($(event.currentTarget),'shake') ;
                console.log('cannot add')
            else     
                console.log('added')
                //animateThis($(event.currentTarget),'bounce') ;

            $(event.currentTarget).siblings('#newTag').val("")  ;              
        },
        "autocompleteselect input": function(event, template, selectedObject)
        {
          var type = $(event.currentTarget).attr('id');
          
          if(type === 'newTag')
          {
              if( selectedObject )
              {
                  var tag = selectedObject.tag ; 

                  tagAddUI( event, template, tag ) ; 
              }                  
              else 
                console.log( $(event.currentTarget).val() ) ; 
          }  
        }, 
        "click #newTag": function(event, template)
        {
            console.log( $(event.currentTarget).val() ) ; 

            $(event.currentTarget).siblings('.addTag').fadeIn() ; 
            $(event.currentTarget).siblings('.cancelTag').fadeIn() ; 
            //$(event.currentTarget).siblings('.showEntTag').fadeIn() ; 
        },  
        "keyup #newTag": function(event, template)
        {
            var tag = $(event.currentTarget).val() ;
            Session.set('tagInstant',tag) ;

            if (event.keyCode === 13)
                tagAddUI(event, template, tag) ;             
        },  
        "click .addTag": function(event, template)
        {
            var tagId = $(event.currentTarget).attr('id');
            var tagTable = $(event.currentTarget).attr('table');
            var tagColumn = $(event.currentTarget).attr('column');
            var tagStr = $(event.currentTarget).attr('tag');
            var tagClass = $(event.currentTarget).attr('tagclass');

            var tag = $(event.currentTarget).siblings('#newTag').val()  ; 
            tag = tag.trim() ; 

            if( ! tagAdd(tagTable, tagId, tagStr, tag, tagClass, tagColumn) )
                //animateThis($(event.currentTarget),'shake') ; 

            $(event.currentTarget).siblings('#newTag').val("")  ; 

            $(event.currentTarget).fadeOut() ;    
            $(event.currentTarget).siblings('.cancelTag').fadeOut() ; 
            //$(event.currentTarget).siblings('#newTag').addClass('hide') ;
            Session.set('tagInstant',null) ;  
        
        } , 
        "click .cancelTag": function(event, template)
        {
            $(event.currentTarget).siblings('#newTag').val("")  ; 

            $(event.currentTarget).fadeOut() ;    
            $(event.currentTarget).siblings('.addTag').fadeOut();  
            Session.set('tagInstant',null) ; 
            //$(event.currentTarget).siblings('#newTag').addClass('hide') ;  
        } , 
        "click .deleteTag": function(event, template)
        {
            event.stopPropagation() ; 

            var tagId = $(event.currentTarget).attr('id');
            var tagTable = $(event.currentTarget).attr('table');
            var tagClass = $(event.currentTarget).attr('tagclass');
            var tagColumn = $(event.currentTarget).attr('column');
            var tagStr = $(event.currentTarget).attr('tag');
            var tagDel = $(event.currentTarget).attr('deltag');
            var tagNoupdate = $(event.currentTarget).attr('tagnoupdate');

            if( Session.get('clickedTag') === tagDel) 
            {
                Session.set('clickedTag',null) ; 
                // Session.set('searchValue',null) ; 
                // $('#searchValue').val(null) ; 
            }  

            console.log('Deleting'+tagDel)

            if( tagNoupdate )
            {
                tagStr = Session.get('tagStr') ; 
                var tagList = [] ; 

                tagList = tag2List(tagStr) ; 
                tagList = tagRemove(tagList,tagDel) ; 
                tagStr = list2Tag(tagList) ;    
                Session.set('tagStr',tagStr) ; 
                return ; 

            }   

            
            tagDelete(tagTable, tagId, tagStr, tagDel, tagColumn) ;
        } ,
        "click .clickTag": function(event, template)
        {
            var tagClick = $(event.currentTarget).attr('clicktag');
            console.log('Clicking'+tagClick) ; 

            if( tagClick === Session.get('clickedTag') )
            {
                Session.set('clickedTag',null) ; 
                //animateThis($(event.currentTarget),'pulse') ;
            } 
            else 
            {
                Session.set('clickedTag',tagClick) ; 
                //animateThis($(event.currentTarget),'tada') ;
            } 
        },
        "click .showTagAdd": function(event, template)
        {
            var id = $(event.currentTarget).attr('id');

            if( id === Session.get('showEntTagId') )
            {
              Session.set('showEntTagId',null) ; 
              //$(event.currentTarget).switchClass('btn-warning','btn-default') ;   
            }  
            else
            {
              Session.set('showEntTagId',id) ; 
              //$(event.currentTarget).switchClass('btn-default','btn-warning') ; 
            } 

            Session.set('tagInstant',null) ;  
            
            //var div = "#chatPDFPanel"+id ;  
            //$(div).animate({ scrollTop: $(div).prop("scrollHeight")}, 1000);  
        } 

    }); 


    Template.showTags.events(
    {
        "click .clickTag": function(event, template)
        {
            var tagClick = $(event.currentTarget).attr('clicktag');
            console.log('Clicking'+tagClick) ; 

            if( tagClick === Session.get('clickedTag') )
            {
                Session.set('clickedTag',null) ; 
                //animateThis($(event.currentTarget),'pulse') ;
            } 
            else 
            {
                Session.set('clickedTag',tagClick) ; 
                //animateThis($(event.currentTarget),'tada') ;
            }
        }
    }) ; 

    Template.registerHelper('helperSessionVariable', function ( sess )
    {
     var sv = Session.get(sess) ;  
              if( sv )
                return sv ;  
              else    
               return '' ;
    });

    Template.selectTags.events(
    {
        // "click .clickTag": function(event, template)
        // {
        //     var tagClick = $(event.currentTarget).attr('clicktag');
        //     console.log('Clicking'+tagClick) ; 

        //     if( tagClick === Session.get('clickedTag') )
        //     {
        //         Session.set('clickedTag',null) ; 
        //         animateThis($(event.currentTarget),'pulse') ;
        //     } 
        //     else 
        //     {
        //         Session.set('clickedTag',tagClick) ; 
        //         animateThis($(event.currentTarget),'tada') ;
        //     }
        // },
        "keyup #searchTag" : function(event, template)
        {
            event.stopPropagation() ; 

            var ent = $(event.currentTarget).val() ; 
            Session.set('tagInstant', ent ) ; 
        },
        "click .clickEntTag": function(event, template)
        {
            var tagClick = $(event.currentTarget).attr('enttag');
            console.log('Clicking'+tagClick) ; 

            if( tagClick === Session.get('clickedTag') )
            {
                Session.set('clickedTag',null) ; 
                //animateThis($(event.currentTarget),'pulse') ;
            } 
            else 
            {
                Session.set('clickedTag',tagClick) ; 
                //animateThis($(event.currentTarget),'tada') ;
            }
        },
    }) ;     
