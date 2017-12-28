import React from 'react';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withMobileDialog,
} from 'material-ui/Dialog';
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';


import { withStyles, imageRegex } from "/imports/util";
import '/imports/api/media/methods';
import MediaUpload from  '/imports/ui/componentHelpers/mediaUpload';


const formId = "create-media";

class CreateMedia extends React.Component {

	constructor(props) {
        super(props);
        this.state = {
        	isBusy: false,
        }
    }

 //    componentDidMount() {
	//     if(!this.props.filterStatus) {
	//     	this.handleModal();
 //    	}
	//     this.initializeFormValues();
	// }

	// componentDidUpdate() {
	// 	if(!this.props.filterStatus) {
	//     	this.handleModal();
 //    	}
	//     this.initializeFormValues();
	// }

	// initializeFormValues = () => {
	// 	let { mediaFormData, formType } = this.props;

	// 	if(mediaFormData) {

	// 		this.refs.mediaName.value = mediaFormData.name || null;
	// 		this.refs.mediaNotes.value = mediaFormData.desc || null;

	// 		if(mediaFormData.type === "url") {
	// 			this.refs.mediaUrl.value = mediaFormData.sourcePath;
	// 		} else {
	// 			this.refs.mediaFile.value = null;
	// 			$(this.refs.mediaFile).change();
	// 			this.refs.mediaImg.src = mediaFormData.sourcePath;
	// 		}

	// 	} else {

	// 		this.refs.mediaName.value = null;
	// 		this.refs.mediaNotes.value = null;

	// 		if(formType === "system") {
	// 			this.refs.mediaFile.value = null;
	// 			$(this.refs.mediaFile).change();
	// 		} else if(formType === "url") {
	// 			this.refs.mediaUrl.value = null;
	// 		}
	// 	}

	// }

 //  	handleModal = () => {
	//     $('#createMedia').appendTo("body").modal('show')
	//     $('#createMedia').on('hidden.bs.modal', () => {
	//       $('#createMedia').modal('hide')
	//     })
 //  	}

 //  	hideModal = () => {
 //  		this.setState({isBusy:false})
 //  		$('#createMedia').modal('hide')
 //  	}


  	getFileType = (file , mediaFormData) => {
  		if(file) {
	  		if (file.type.match('image/*')) {
	        	return "Image";
	      	} else if (file.type.match('video/*') || file.type.match('audio/*')) {
	        	return "Media";
	      	} else {
	        	return "Document";
	      	}
  		} else {
  			return mediaFormData.type

  		}
  	}

  	handleChange = (file)=>{
  		console.log("handleChange>>>file>>>>", file)
  		this.setState({fileUploadError: false});
  		this.state.file = file;
  	}

  	onSubmit = (event) => {
  		event.preventDefault()
  		let file;
  		const mediaData = {};
  		const { mediaFormData, formType } = this.props;
  		if(!this.state.file){
  			this.setState({fileUploadError: true})
  			return
  		} else {
  			this.setState({isBusy:true, fileUploadError: false})
  		}
 		if(this.state.file.isUrl) {
 			mediaData.sourcePath = this.state.file.file;
			mediaData.type = "url"
 		} else {
 			file = this.state.file.fileData;
			mediaData.type = this.getFileType(file, mediaFormData)
 		}

		mediaData.name = this.mediaName.value
		mediaData.desc = this.mediaNotes.value
		mediaData.schoolId = this.props.schoolId

 		console.log("onSubmit file",this.state.file)
 		console.log("onSubmit mediaData",mediaData)
  		if(mediaFormData) {
  			this.props.onEdit({editKey: mediaFormData._id , data: mediaData, fileData:file});
  		} else {
	  		this.props.onAdd({data: mediaData, fileData: file, isUrl: this.state.file.isUrl});
  		}
  	}

    render() {
    	let { mediaFormData, formType, fullScreen, showCreateMediaModal, onClose } = this.props;
    	console.log("createMedia props -->>",this.props)
	    return (
	    	<Dialog
				fullScreen={fullScreen}
				open={showCreateMediaModal}
				onClose={onClose}
				aria-labelledby="responsive-dialog-title"
	        >
	        	<DialogContent>
	        		<form id={formId} onSubmit={this.onSubmit}>
		        	<Grid container >
		        		<Grid item xs={12} sm={6}>
		        			<TextField
	                            required={true}
	                            defaultValue={mediaFormData && mediaFormData.name}
	                            margin="dense"
	                            inputRef={(ref)=> this.mediaName = ref}
	                            label="Media Name"
	                            type="text"
	                            fullWidth
	                        />
	                        <TextField
	                            required={false}
	                            defaultValue={mediaFormData && mediaFormData.desc}
	                            margin="dense"
	                            inputRef={(ref)=> this.mediaNotes = ref}
	                            label="Media Note"
	                            type="text"
	                            multiline = {true}
	                            rows={2}
	                            fullWidth
	                        />
		        		</Grid>
		        		<Grid item xs={12} sm={6}>
		        			<MediaUpload fullScreen={fullScreen} width={275} onChange={this.handleChange} data={mediaFormData && {file: mediaFormData.sourcePath, isUrl: true}}  showVideoOption={false} />
		        		</Grid>
		        	</Grid>
		        	</form>
	        	</DialogContent>
	        	<DialogActions>
	        		<div>
    				{
                    	this.state.fileUploadError && <Typography color="error" type="caption">
				        	*Image is required
				      	</Typography>
				  	}
	        		<Button color="primary" type="submit" form={formId} >
				        Save
				    </Button>
				    <Button color="primary" onClick={onClose} >
				        Close
				    </Button>
				    </div>
	        	</DialogActions>
	        </Dialog>
	    )
    }
}
const styles = theme => {
  return {
	    button: {
	      margin: 5,
	      width: 150
	    }
    }
}

export default withStyles(styles)(withMobileDialog()(CreateMedia));
