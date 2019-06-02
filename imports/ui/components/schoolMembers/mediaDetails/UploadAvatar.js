import Button from 'material-ui/Button';
import Dialog, { DialogActions, DialogContent, withMobileDialog } from 'material-ui/Dialog';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import React from 'react';
import { compressImage } from '../../../../util';
import '/imports/api/media/methods';
import MediaUpload from '/imports/ui/componentHelpers/mediaUpload';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers';
import { ContainerLoader } from '/imports/ui/loading/container';
import { withPopUp, withStyles } from '/imports/util';


const formId = 'create-media';

class UploadAvatar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isBusy: false,
    };
  }

  componentWillReceiveProps() {
    this.setState({ fileUploadError: false });
  }

    getFileType = (file, mediaFormData) => {
      if (file) {
        if (file.type.match('image/*')) {
          return 'Image';
        } else if (file.type.match('video/*') || file.type.match('audio/*')) {
          return 'Media';
        }
        return 'Document';
      }
      return mediaFormData.type;
    }

    handleChange = (file) => {
      this.setState({ fileUploadError: false });
      this.state.file = file;
    }

    onSubmit = (event) => {
      event.preventDefault();
      const { file } = this.state;
      const allUploadPromise = [];
      if (!this.state.file) {
        this.setState({ fileUploadError: true });
        return;
      }
      this.setState({ isLoading: true, fileUploadError: false });


      const memberData = this.props.memberInfo;
      try {
        compressImage(file.org, file.file, file.isUrl).then((result) => {
          const optimizedImages = [];
          console.group('UploadAvatar');
          if (_.isArray(result)) {
            console.log('Non-cors');
            for (let i = 0; i <= 1; i++) {
              allUploadPromise.push(new Promise((resolve, reject) => {
                S3.upload({ files: { 0: result[i] }, path: 'compressed' }, (err, res) => {
                  if (res) {
                    optimizedImages.push(res.secure_url);
                    resolve(i);
                  }
                });
              }));
            }
            Promise.all(allUploadPromise).then((x) => {
              memberData.optimizedImages = optimizedImages;
              if (file && file.fileData && !file.isUrl) {
                S3.upload({ files: { 0: file.fileData }, path: 'memberAvatar' }, (err, res) => {
                  if (err) {
                    this.setState({ isBusy: false, errorText: err.reason || err.message });
                  }
                  if (res) {
                    memberData.pic = res.secure_url;
                    this.editUserCall(memberData);
                  }
                });
              } else if (file && file.isUrl) {
                memberData.pic = file.file;
                this.editUserCall(memberData);
              } else {
                this.editUserCall(memberData);
              }
            });
          } else {
            console.log('cors');
            if (file && file.fileData && !file.isUrl) {
              S3.upload({ files: { 0: file.fileData }, path: 'memberAvatar' }, (err, res) => {
                if (err) {
                  this.setState({ isBusy: false, errorText: err.reason || err.message });
                }
                if (res) {
                  memberData.pic = res.secure_url;
                  this.editUserCall(memberData);
                }
              });
            } else if (file && file.isUrl) {
              memberData.pic = file.file;
              this.editUserCall(memberData);
            } else {
              this.editUserCall(memberData);
            }
          }
          console.groupEnd('UploadAvatar');
        });
      } catch (error) {
        throw new Meteor.Error(error);
      }
    }

    editUserCall = (memberData) => {
      const payload = {};
      payload.pic = memberData.pic;
      payload.medium = memberData.optimizedImages && memberData.optimizedImages[0];
      payload.low = memberData.optimizedImages && memberData.optimizedImages[1];
      Meteor.call(
        'schoolMemberDetails.editSchoolMemberDetails', { doc_id: memberData._id, doc: payload },
        (err, res) => {
          if (res) {
          }
          if (err) {
          }
          // Stop loading and close modal.
          this.setState({ isLoading: false });
          this.props.onClose();
        },
      );
    }

    render() {
      const {
        mediaFormData, fullScreen, showUploadAvatarModal, onClose,
      } = this.props;
      return (
        <Dialog
          fullScreen={fullScreen}
          open={showUploadAvatarModal}
          onClose={onClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogContent>
            <form id={formId} onSubmit={this.onSubmit}>
              <Grid container>
                <Grid item xs={12} sm={12}>
                  <MediaUpload fullScreen={fullScreen} width={275} onChange={this.handleChange} data={mediaFormData && { file: mediaFormData.sourcePath, isUrl: true }} showVideoOption={false} />
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
                        this.state.fileUploadError && (
                        <Typography color="error" type="caption">
                            *Image is required
                        </Typography>
                        )
                    }
              <Button style={{ color: helpers.cancel }} onClick={onClose}>
                        Cancel
              </Button>
              <Button style={{ color: helpers.action }} type="submit" form={formId}>
                        Save
              </Button>
            </div>
          </DialogActions>
        </Dialog>
      );
    }
}
const styles = theme => ({
  button: {
    margin: 5,
    width: 150,
  },
});
export default withStyles(styles)(withMobileDialog()(withPopUp(UploadAvatar)));
