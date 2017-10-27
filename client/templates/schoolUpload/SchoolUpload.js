Template.SchoolUpload.events({
"click #project_upload":function(event,template){
  if($("#project_file")[0].files.length > 0){
    var files = $("#project_file")[0].files
    var reader = new FileReader();
     reader.onload = function(fileLoadEvent) {
        Meteor.call('project_upload', files[0], reader.result,function(error, result){
          if(error){
            toastr.error("Please try again. some error in provided data","Error");
          }else{
            try{
              $(".fileinput-box").trigger("reset")
            }catch(e){

            }
            toastr.success("All School data uploaded successfully","Success");
          }
        });
     };
     reader.readAsBinaryString(files[0]);
 }
}
});
