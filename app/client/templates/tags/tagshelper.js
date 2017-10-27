getEntTags = function ( tagstr, tagclass, max)
{
  	var taglist = tag2List(tagstr) ; 
      var $set = {} ; 

      if( tagclass)
          $set['class'] = tagclass ; 

      if( !tagEmpty (taglist))
          $set['tag'] = {$nin: taglist } ;
      
      var ret = typeof tagclass=="undefined"?[]:tags.find($set).fetch() ;

      var tagtyped = Session.get('tagInstant') ; 

      

      if( tagtyped && ret.length > 0) 
      {
        for( i=0;i<ret.length;i++)
        {
            var tl = tagtyped.toLowerCase() ;
            var tag = ret[i].tag ;   
            tag = tag.toLowerCase() ; 
            if( tag.indexOf(tl) < 0)
            {
                ret.splice(i,1) ;
                -- i ; 
            }  
              
        }    
      }

      
      if(ret.length > 10 )
          ret = ret.slice(0, 10)
      return ret ; 
  }

  cutstring = function (name,len, noellips)
{
    if(!name || name==='' ||name===undefined)
        return name ;

    if(!len)
      len = 200 ;

    var cutstr ; 
    if (name.length > len)
    {
        if( noellips === "yes" )
        {
          cutstr = name.substr(0,len);
        } 
        else 
        {
          cutstr = name.substr(0,len-3);
          cutstr = cutstr +"..." ;  
        } 
        
    }
    else 
        cutstr = name.substr(0,len);

    return cutstr;
}

mergeTags = function(tag1, tag2)
{
 var jtag = null ;

 if( !tag1)
 { 
  if( !tag2 )
   return null ; 
  else
   return tag2 ;  
 } 

 if( !tag2 )
  return tag1 ; 
 else 
  jtag = tag1 + tag2 ; 

 return jtag ; 
}

extractTags = function( message ) 
{
 var wordlist = [] ; 
 var tag = "", tagStr="" ; 
 var words = message.split(" ") ;

    for(i=0;i<words.length;i++)
    {
        //console.log('words:'+words[i]) ;

        if( words[i].charAt(0) === '#')
        {
            tag = words[i].slice(1,words[i].length) ; 
            wordlist.push(tag) ;  
            //console.log('tag:'+words[i]) ;
        }
    }

    tagStr = list2Tag(wordlist) ; 
    
    return tagStr ; 
}

tagAdd = function (tagTable, tagId, tagStr, tag, cl, col ) 
{
 //console.log('tagAdd:'+tag) ; 


 if( !tag )
  return false ; 
 
 var table = window[tagTable] ; 

 if( table )
 { 
  var tagList = [] ; 

  tagList = tag2List(tagStr) ; 
  if( !tagExist( tagList,tag) )
  {
   tagList = tagAppend(tagList,tag) ; 
   tagStr = list2Tag(tagList) ; 
   
   var exist = tags.findOne( {tag : tag,  class : cl } ) ; 

   if( !exist )
    tags.insert( {  tag : tag ,  class : cl } ) ; 

   var $setobj = {} ; 
   if( col )
    $setobj[col] = tagStr ; 
   else 
    $setobj['tags'] = tagStr ; 

   return table.update({ _id : tagId}, { $set : $setobj }) ;  
  }   
  
 }
  
 return false ; 
}

tagDelete = function (tagTable, tagId, tagStr, tagDel, col ) 
{
 var table = window[tagTable] ; 

 if( table )
 { 
  if( tagStr )
  {
   var tagList = [] ; 

   tagList = tag2List(tagStr) ; 
   tagList = tagRemove(tagList,tagDel) ; 
   tagStr = list2Tag(tagList) ; 
  }   
  
  var $setobj = {} ; 

  if( col )
   $setobj[col] = tagStr; 
  else 
   $setobj['tags'] = tagStr; 

  return table.update({_id:tagId},{$set:$setobj}); 
 }
 else 
  return false ; 
}

tag2List = function(tagstr, char) 
{
 //console.log('tag2List:'+tagstr) ; 
 var taglist = [] ; 
 var sep = ',' ; 

 if( char )
  sep = char ; 

 if(tagstr)
   taglist = tagstr.split(sep);

 for(i=0;i<taglist.length;i++)
 {
  if( ! taglist[i])
  {
   taglist.splice(i,1) ; 
   --i ; 
  } 
 }  
  
 //console.log('List:'+taglist) ;  
 return taglist ;  
}

list2Tag = function(taglist) 
{
 //console.log('list2Tag:'+taglist) ; 

 if(!taglist)
       return "" ;

 var tagStr = ""; 

 for(i=0;i<taglist.length;i++)
 {
  if( taglist[i] && taglist[i] !== '' )
  {
   tagStr = tagStr + taglist[i] + ',' ;  
  }  
 }  
  
 //console.log('String:'+tagStr) ;  
 return tagStr ;  
}

tagRemove = function(taglist, tagdel)
{
//console.log('tagRemove:'+taglist) ; 

 if(!taglist)
       return null ;

 for(i=0;i<taglist.length;i++)
 {
  if( taglist[i] === tagdel )
  {
   taglist.splice(i,1) ; 
   --i ; 
  }  
 }  
//console.log('tagRemove:'+taglist) ; 
 
 return taglist ; 
}

tagAppend = function(taglist, tag)
{
//console.log('tagAppend:'+taglist) ; 

 if(!taglist)
       return null ;

   taglist.push(tag) ; 

//console.log('tagAppend:'+taglist) ; 
 
 return taglist ; 
}

tagEmpty = function(taglist)
{
  if( !taglist || taglist.length <= 0)
   return true ; 
  else 
   return false; 

}

tagExist = function(taglist, tag)
{
 if(!taglist)
      return false ;

 for(i=0;i<taglist.length;i++)
 {
  if( taglist[i] === tag )
   return true ; 
 }  
 
 return false ; 
}

tagAddUI = function(event, template, tag )
{
 if( !tag )
      return false ; 

 var obj = $(event.currentTarget).siblings('.addTag')  ; 
 var tagId = obj.attr('id');
 var tagTable = obj.attr('table');
 var tagClass = obj.attr('tagclass');
 var tagColumn = obj.attr('column');
 var tagStr = obj.attr('tag');

   if( ! tagAdd(tagTable, tagId, tagStr, tag, tagClass, tagColumn) )
        //animateThis($(event.currentTarget),'shake') ; 

    $(event.currentTarget).find('#newTag').andSelf().filter('#newTag').val("")  ;

    //obj.fadeOut() ;    
    // $(event.currentTarget).siblings('.addTag').fadeOut()  ; 
    // $(event.currentTarget).siblings('.cancelTag').fadeOut()  ;   
    //$(event.currentTarget).siblings('.showEntTag').fadeOut()  ;                   
    // $(event.currentTarget).siblings('#newTag').addClass('hide') ;  

   return true ; 

}