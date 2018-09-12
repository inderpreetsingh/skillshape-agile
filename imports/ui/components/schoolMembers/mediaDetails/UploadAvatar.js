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
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';
import { withStyles, imageRegex ,imageCompress} from "/imports/util";
import '/imports/api/media/methods';
import MediaUpload from  '/imports/ui/componentHelpers/mediaUpload';
import { ContainerLoader } from '/imports/ui/loading/container.js';
import { compressImage } from '../../../../util';
const formId = "create-media";

class UploadAvatar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
        }
    }
    componentWillReceiveProps() {
        this.setState({fileUploadError: false});
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

    handleChange = (file)=>{
        this.setState({fileUploadError: false});
        this.state.file = file;
    }

    onSubmit = async(event) => {
        event.preventDefault();
        let file = this.state.file;
        if (!this.state.file) {
            this.setState({ fileUploadError: true })
            return
        } else {
            this.setState({ isLoading: true, fileUploadError: false })
        }
       
        const memberData = this.props.memberInfo;
        compressImage(file['org']).then((result)=>{
        console.log('TCL: UploadAvatar -> onSubmit -> result', result);
        S3.upload({ files: { "0": result[0] }, path: "memberAvatar" }, (err, res) => {
            if (res) {
                memberData["medium"] = res.secure_url
  
            }
           
        });
        S3.upload({ files: { "0": result[1] }, path: "memberAvatar" }, (err, res) => {
            if (res) {
                memberData["low"] = res.secure_url
            }
           
        });
        })
        
        if (file && file.fileData && !file.isUrl) {
            S3.upload({ files: { "0": file.fileData }, path: "memberAvatar" }, (err, res) => {
                if (err) {
                    this.setState({ isBusy: false, errorText: err.reason || err.message })
                }
                if (res) {
                    memberData["pic"] = res.secure_url
                   
                    this.editUserCall(memberData);
                }
               
            });
        } else if (file && file.isUrl) {
            memberData["pic"] = file.file;
            
            this.editUserCall(memberData);
        } else {
            this.editUserCall(memberData);
        }
       
       
    }
    editUserCall = (memberData) => {
        console.log('TCL: editUserCall -> memberData', memberData);
        let payload = {};
        payload.pic = memberData.pic;
        payload.medium= memberData.medium;
        payload.low= memberData.low;
        console.log('TCL: editUserCall -> payload', payload);
        Meteor.call(
            "schoolMemberDetails.editSchoolMemberDetails", { doc_id: memberData._id, doc: payload },
            (err, res) => {
                if (res) {
                }
                if (err) {
                }
                // Stop loading and close modal.
                this.setState({ isLoading: false });
                this.props.onClose();
            }
        );
    }

    render() {
        let { mediaFormData, formType, fullScreen, showUploadAvatarModal, onClose } = this.props;
        return (
            <Dialog
                fullScreen={fullScreen}
                open={showUploadAvatarModal}
                onClose={onClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogContent>
                    <form id={formId} onSubmit={this.onSubmit}>
                    <Grid container >
                        <Grid item xs={12} sm={12}>
                            <MediaUpload fullScreen={fullScreen} width={275} onChange={this.handleChange} data={mediaFormData && {file: mediaFormData.sourcePath, isUrl: true}}  showVideoOption={false} />
                        </Grid>
                    </Grid>
                    </form>
                </DialogContent>
                {
                    this.state.isLoading && <ContainerLoader />
                }
                <DialogActions>
                    <div>
                    {
                        this.state.fileUploadError && <Typography color="error" type="caption">
                            *Image is required
                        </Typography>
                    }
                    <Button style={{ color: helpers.cancel}} onClick={onClose} >
                        Cancel
                    </Button>
                    <Button style={{ color: helpers.action}} type="submit" form={formId} >
                        Save
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

export default withStyles(styles)(withMobileDialog()(UploadAvatar));
