import React from 'react';
import Button from 'material-ui/Button';
import Dialog, {
	DialogActions,
	DialogContent,
	withMobileDialog
} from 'material-ui/Dialog';
import Grid from 'material-ui/Grid';

import MediaUpload from '/imports/ui/componentHelpers/mediaUpload';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';
import { ContainerLoader } from '/imports/ui/loading/container';
import { compressImage, withPopUp, withStyles } from "/imports/util";
import '/imports/api/media/methods';


class UploadMedia extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isBusy: false,
		}
	}

	handleChange = (file) => {
		// console.log("handleChange -->>",file);
		this.state.file = file;
		// this.setState({file})
	}

	getFileType = (file, mediaFormData) => {
		if (file) {
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

	onSubmitForClassTypeData = (schoolId, classTypeId) => (e) => {
		e.preventDefault();

		const { file } = this.state;
		let allUploadPromise = [];
		let doc = {
			schoolId: schoolId
		};
		this.setState({ isBusy: true });
		try {
			compressImage(file["org"], file.file, file.isUrl).then(result => {
				console.group("ClassTypeDetails");
				if (_.isArray(result)) {
					console.log("Non-cors");
					for (let i = 0; i <= 1; i++) {
						allUploadPromise.push(
							new Promise((resolve, reject) => {
								S3.upload(
									{ files: { "0": result[i] }, path: "compressed" },
									(err, res) => {
										if (res) {
											if (i == 0) {
												doc.medium = res.secure_url;
												resolve();
											} else {
												doc.low = res.secure_url;
												resolve();
											}
										}
									}
								);
							})
						);
					}
					Promise.all(allUploadPromise).then(() => {
						if (file && file.fileData && !file.isUrl) {
							S3.upload(
								{ files: { "0": file.fileData }, path: "schools" },
								(err, res) => {
									if (err) {
									}
									if (res) {
										doc.classTypeImg = res.secure_url;
										this.editClassType({ doc_id: classTypeId, doc });
									}
								}
							);
						} else if (file && file.isUrl) {
							doc.classTypeImg = file.file;
							this.editClassType({ doc_id: classTypeId, doc });
						} else {
							doc.classTypeImg = null;
							this.editClassType({ doc_id: classTypeId, doc });
						}
					});
				} else {
					console.log("cors");
					if (file && file.fileData && !file.isUrl) {
						S3.upload(
							{ files: { "0": file.fileData }, path: "schools" },
							(err, res) => {
								if (err) {
								}
								if (res) {
									doc.classTypeImg = res.secure_url;
									this.editClassType({ doc_id: classTypeId, doc });
								}
							}
						);
					} else if (file && file.isUrl) {
						doc.classTypeImg = file.file;
						this.editClassType({ doc_id: classTypeId, doc });
					} else {
						doc.classTypeImg = null;
						this.editClassType({ doc_id: classTypeId, doc });
					}
				}
				console.groupEnd("ClassTypeDetails");
			});
		} catch (error) {
			throw new Meteor.Error(error);
		}
	};


	editClassType = ({ doc, doc_id }) => {
		const { popUp } = this.props;
		Meteor.call("classType.editClassType", { doc, doc_id }, (error, result) => {
			this.setState({ isBusy: false });
			if (error) {
			}
			if (result) {
				popUp.appear("success", {
					title: "Message",
					content: "Image Saved Successfully"
				});
				this.props.onClose();
			}
		});
	};


	onSubmit = (event) => {
		event.preventDefault()
		const mediaData = {};
		const { file } = this.state;
		this.setState({ isBusy: true })
		let doc = {};
		let allUploadPromise = [];
		try {
			compressImage(file['org'], file.file, file.isUrl).then((result) => {
				console.group("UploadMedia");
				if (_.isArray(result)) {
					console.log('Non-cors');
					for (let i = 0; i <= 1; i++) {
						allUploadPromise.push(new Promise((resolve, reject) => {
							S3.upload({ files: { "0": result[i] }, path: "compressed" }, (err, res) => {
								if (res) {
									if (i == 0) {
										doc[[this.props.imageType] + 'Medium'] = res.secure_url;
									} else {
										doc[[this.props.imageType] + 'Low'] = res.secure_url;
									}
									resolve(true);
								} else {
									reject();
								}

							});
						}))
					}
					Promise.all(allUploadPromise).then(() => {
						if (file && file.isUrl) {
							doc[this.props.imageType] = file.file;
							this.handleSubmit(doc)
						} else {
							S3.upload({ files: { "0": file.fileData }, path: "schools" }, (err, res) => {
								if (res) {
									doc[this.props.imageType] = res.secure_url;
									this.handleSubmit(doc);
								}
							})
						}
					})
				}
				else {
					console.log('cors');
					if (file && file.isUrl) {
						doc[this.props.imageType] = file.file;
						this.handleSubmit(doc)
					} else {
						S3.upload({ files: { "0": file.fileData && file.fileData }, path: "schools" }, (err, res) => {
							if (res) {
								doc[this.props.imageType] = res.secure_url;
								this.handleSubmit(doc);
							}
						})
					}
				}
				console.groupEnd("UploadMedia");
			})
		} catch (error) {
			this.handleSubmit(doc);
			throw new Meteor.Error(error);
		}
	}

	handleSubmit = (doc) => {
		const data = doc;
		const { forClassType } = this.props;

		Meteor.call("editSchool", this.props.schoolId, data, (error, result) => {
			if (error) {

			}
			this.setState({ isBusy: false })
			this.props.onClose();
		});
	}



	render() {
		const {
			schoolId,
			classTypeId,
			mediaFormData,
			fullScreen,
			showCreateMediaModal,
			onClose,
			imageType,
			classes,
			forClassType
		} = this.props;
		// console.log("UploadMedia props -->>",this.props)
		// console.log("UploadMedia state -->>",this.state)
		const mediaUploadData = forClassType ?
			mediaFormData && { file: mediaFormData['classTypeImg'], isUrl: true } :
			mediaFormData && { file: mediaFormData[imageType], isUrl: true };

		return (
			<Dialog
				classes={{ paper: classes.dialogBoxPaper }}
				fullScreen={fullScreen}
				open={showCreateMediaModal}
				onClose={onClose}
				aria-labelledby="responsive-dialog-title"
			>
				<form onSubmit={forClassType ? this.onSubmitForClassTypeData(schoolId, classTypeId) : this.onSubmit}>
					{this.state.isBusy && <ContainerLoader />}
					<DialogContent>
						<Grid container >
							<Grid item xs={12} sm={6}>
								<MediaUpload
									fullScreen={fullScreen}
									width={275}
									onChange={this.handleChange}
									data={mediaUploadData}
									showVideoOption={false}
								/>
							</Grid>
						</Grid>
					</DialogContent>
					<DialogActions>
						<Button style={{ color: helpers.cancel }} color="primary" onClick={onClose} >
							Cancel
  					    </Button>
						<Button style={{ color: helpers.action }} color="primary" type="submit"  >
							Save
                </Button>
					</DialogActions>
				</form>
			</Dialog>
		)
	}
}

UploadMedia.defaultProps = {
	forClassType: false,
}

const styles = theme => {
	return {
		button: {
			margin: 5,
			width: 150
		},
		dialogBoxPaper: {
			[`@media screen and (max-width: ${helpers.mobile}px)`]: {
				margin: helpers.rhythmDiv
			}
		}
	}
}

export default withStyles(styles)(withMobileDialog()(withPopUp(UploadMedia)));
