import React from 'react';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withMobileDialog,
} from 'material-ui/Dialog';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import { withStyles, imageRegex } from "/imports/util";

import { ContainerLoader } from '/imports/ui/loading/container';
import '/imports/api/media/methods';
import MediaUpload from  '/imports/ui/componentHelpers/mediaUpload';

class UploadMedia extends React.Component {

	constructor(props) {
        super(props);
        this.state = {
        	isBusy: false,
        }
    }

  	handleChange = (file)=> {
  		console.log("handleChange -->>",file);
  		this.state.file = file;
  		// this.setState({file})
  	}

  	onSubmit = (event)=> {
  		event.preventDefault()
  		console.log("handleSubmit state -->>",this.state);
  		const mediaData = {};
  		const { file } = this.state;
  		this.setState({isBusy: true})
  		if(file && file.isUrl) {
  			this.handleSubmit({ [this.props.imageType]: file.file })
  		} else {
  			S3.upload({files: { "0": file.file}, path:"schools"}, (err, res) => {
	            if(err) {
	                console.error("err ",err);
	            }
	            if(res) {
  					this.handleSubmit({ [this.props.imageType]: res.secure_url })
	            }
        	})
  		}
  
  	}

  	handleSubmit = ({ logoImg, mainImage })=> {
  		const data = { _id: this.props.schoolId}
  		if(logoImg) {
  			data.logoImg = logoImg;
  		} else if(mainImage) {
  			data.mainImage = mainImage;
  		}

  		Meteor.call("editSchool", data, (error, result) => {
            if(error) {
              console.error("error", error);
            }
            this.setState({isBusy: false})
            this.props.onClose();
        });
  	}

    render() {
    	let { mediaFormData, fullScreen, showCreateMediaModal, onClose } = this.props;
    	console.log("UploadMedia props -->>",this.props)
    	console.log("UploadMedia state -->>",this.state)
	    return (
	    	<Dialog
				fullScreen={fullScreen}
				open={showCreateMediaModal}
				onClose={onClose}
				aria-labelledby="responsive-dialog-title"
	        >
	        	<form  onSubmit={this.onSubmit}>
	        		{ this.state.isBusy && <ContainerLoader/>}
		        	<DialogContent>
			        	<Grid container >
			        		<Grid item xs={12} sm={6}>
			        			<MediaUpload 
			        				fullScreen={fullScreen} 
			        				width={275} 
			        				onChange={this.handleChange} 
			        				data={mediaFormData && {file: mediaFormData.sourcePath, isUrl: true}}  
			        				showVideoOption={false} 
			        			/>
			        		</Grid>
			        	</Grid>
		        	</DialogContent>
		        	<DialogActions>
		        		<Button color="primary" type="submit"  >
					        Save
					    </Button>
					    <Button color="primary" onClick={onClose} >
					        Close
					    </Button>
		        	</DialogActions>
		        </form>
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

export default withStyles(styles)(withMobileDialog()(UploadMedia));