import Checkbox from "material-ui/Checkbox";
import Dialog, { DialogActions, DialogContent, withMobileDialog } from 'material-ui/Dialog';
import { FormControl, FormControlLabel } from "material-ui/Form";
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
import React from 'react';
import Select from "react-select";
import '/imports/api/media/methods';
import MediaUpload from '/imports/ui/componentHelpers/mediaUpload';
import FormGhostButton from "/imports/ui/components/landing/components/buttons/FormGhostButton.jsx";
import { ContainerLoader } from '/imports/ui/loading/container.js';
import { withStyles } from "/imports/util";
import {get,isEmpty} from 'lodash';
const formId = "create-media";


class CreateMedia extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isBusy: false,
			currentMediaData: null,
			checkedAll: false,
			selectedOption: [],
		}
	}
	componentWillReceiveProps() {
		this.setState({ fileUploadError: false });
	}
	componentWillMount() {
		try {

			let schoolId = this.props.schoolId;
			if (schoolId) {
				this.setState({ isBusy: true });
				Meteor.call(
					"schoolMemberDetails.getAllSchoolMembers",
					{ schoolId },
					(err, res) => {
						let state = { isBusy: false };
						state.schoolMembers = [];
						if (err) {
							state.error = err.reason || err.message;
						}
						if (!isEmpty(res)) {
							res.map((current, index) => {
								let {profile:{profile:{firstName,lastName,name},emails}} = current;
								let label = '';
								if(firstName || lastName || name){
								 label = `${firstName ? firstName : name} ${lastName ? lastName : ''}`;
								}
								else if(!isEmpty(emails)){
								 label = `${emails[0].address}`;
								}
								state.schoolMembers.push({ value: current._id, label})
							})
						}

						this.setState(state);
					}
				);
			}
			this.setState({ isBusy: false });
		} catch (error) {

		}

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

	handleChange = (file) => {
		this.setState({ fileUploadError: false });
		this.state.file = file;
	}

	onSubmit = (event) => {
		event.preventDefault()
		let file;
		let mediaData = {};
		const { mediaFormData, formType } = this.props;
		if (!this.state.file) {
			this.setState({ fileUploadError: true })
			return
		} else {
			this.props.showLoading();
			this.setState({ isBusy: true, fileUploadError: false })
		}
		if (this.state.file.isUrl) {
			mediaData.sourcePath = this.state.file.file;
			mediaData.type = "url"
		} else {
			file = this.state.file.fileData;
			mediaData.type = this.getFileType(file, mediaFormData)
		}

		mediaData.name = this.mediaName.value
		mediaData.desc = this.mediaNotes.value
		mediaData.schoolId = this.props.schoolId
		mediaData.taggedMemberIds = [];
		this.state.selectedOption.map((current, index) => {
			mediaData.taggedMemberIds.push(current.value);
		})

		if (mediaFormData) {
			this.props.onEdit({ editKey: mediaFormData._id, data: mediaData, fileData: file });
		} else {
			if (this.props.tagMember) {
				mediaData.taggedMemberIds.push(this.props.taggedMemberInfo._id);
				mediaData.taggedMemberIds = (_.uniq(mediaData.taggedMemberIds));
			}
			this.props.onAdd({ data: mediaData, fileData: file, isUrl: this.state.file.isUrl });
		}

		this.setState({ isBusy: false })
		this.props.onClose();

	}
	collectSchoolMembers = values => {
		this.setState({ taggedMemberIds: values.map(ele => ele._id) });
	};
	handleSelectAll = (e) => {
		e.target.checked ? this.setState({ checkedAll: e.target.checked, selectedOption: this.state.schoolMembers }) : this.setState({ checkedAll: e.target.checked, selectedOption: [] })
	}
	handleChangeForTagging = (selectedOption) => {
		this.setState(state => {
			return {
				selectedOption: selectedOption
			};
		});
		if (_.isEmpty(selectedOption)) {
			this.setState({ checkedAll: false })
		}
	}
	
	render() {
		let { mediaFormData, formType, fullScreen, showCreateMediaModal, onClose, taggedMemberInfo, openEditTaggedModal, _id, closeEditTaggedModal } = this.props;
		const { selectedOption, schoolMembers } = this.state;
		
		return (
			<Dialog
				fullScreen={fullScreen}
				open={showCreateMediaModal}
				onClose={onClose}
				aria-labelledby="responsive-dialog-title"
			>
				<DialogContent >
					{
						this.state.isBusy && <ContainerLoader />
					}

					<form id={formId} onSubmit={this.onSubmit}>
						<Grid container >
							<Grid item xs={12} sm={6}>
								<TextField
									required={true}
									defaultValue={mediaFormData && mediaFormData.name}
									margin="dense"
									inputRef={(ref) => this.mediaName = ref}
									label="Media Name"
									type="text"
									fullWidth
								/>
								<TextField
									required={false}
									defaultValue={mediaFormData && mediaFormData.desc}
									margin="dense"
									inputRef={(ref) => this.mediaNotes = ref}
									label="Media Note"
									type="text"
									multiline={true}
									rows={2}
									fullWidth
								/>
								<div style={{display:'flex'}}>
								<Grid item md={4} sm={4} xs={4} style={{marginTop:'22px'}}>
									<Typography >Members: </Typography>
								</Grid>
								<Grid item md={8} sm={8} xs={8} >
									<FormControl fullWidth margin="dense">
										<FormControlLabel
											control={
												<Checkbox
													checked={this.state.checkedAll}
													onChange={(e) => { this.handleSelectAll(e) }}
													value="checkedAll"
												/>
											}
											label="Select All Members"
											style={{width:'100%'}}
										/>
									</FormControl>
									
								</Grid>
								</div>
								<Select
										name="filters"
										placeholder="School Members"
										value={selectedOption}
										options={schoolMembers}
										onChange={this.handleChangeForTagging}
										multi
									/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<MediaUpload fullScreen={fullScreen} width={275} onChange={this.handleChange} data={mediaFormData && { file: mediaFormData.sourcePath, isUrl: true }} showVideoOption={false} />
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
						{/* <Button style={{ color: helpers.cancel }} onClick={onClose} >
							Cancel
				    </Button>
						<Button style={{ color: helpers.action }} type="submit" form={formId} >
							Save
				    </Button> */}
						<FormGhostButton
							darkGreyColor
							onClick={onClose}
							label="Cancel"
						/>
						<FormGhostButton
							type='submit'
							form={formId}
							label="Save"
						/>
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
