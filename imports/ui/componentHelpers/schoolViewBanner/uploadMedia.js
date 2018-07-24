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
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

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
  		// console.log("handleChange -->>",file);
  		this.state.file = file;
  		// this.setState({file})
  	}

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

  	onSubmit = (event)=> {
  		event.preventDefault()
  		// console.log("handleSubmit state -->>",this.state);
  		const mediaData = {};
  		const { file } = this.state;
  		this.setState({isBusy: true})
      if(file && file.isUrl) {
        this.handleSubmit({ [this.props.imageType]: file.file })
      } else {

        // console.log("yessssssssssssssssssssssssssssssssssssfile", file.fileData)
  			S3.upload({files: { "0": file.fileData}, path:"schools"}, (err, res) => {
	            if(err) {
	                // console.log("err s3 >>>>>>>????????>>>> ",err);
	            }
	            if(res) {
                // console.log("res from s3>>>>>>>>>>>>>>>>>> ", res)
                this.handleSubmit({ [this.props.imageType]: res.secure_url })
	            }
        	})
  		}

  	}

  	handleSubmit = ({ logoImg, mainImage })=> {
  		const data = {}
  		if(logoImg) {
  			data.logoImg = logoImg;
  		} else if(mainImage) {
  			data.mainImage = mainImage;
  		}
      // console.log("calling >>>>>>>>>>> editSchool")
  		Meteor.call("editSchool", this.props.schoolId, data, (error, result) => {
            if(error) {
              
            }
            this.setState({isBusy: false})
            this.props.onClose();
        });
  	}

    render() {
    	let { mediaFormData, fullScreen, showCreateMediaModal, onClose, imageType } = this.props;
    	// console.log("UploadMedia props -->>",this.props)
    	// console.log("UploadMedia state -->>",this.state)
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
			        				data={mediaFormData && {file: mediaFormData[imageType], isUrl: true}}
			        				showVideoOption={false}
			        			/>
			        		</Grid>
			        	</Grid>
		        	</DialogContent>
		        	<DialogActions>
  					    <Button style={{ color: helpers.cancel}} color="primary" onClick={onClose} >
  					        Cancel
  					    </Button>
                <Button style={{ color: helpers.action}} color="primary" type="submit"  >
                    Save
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