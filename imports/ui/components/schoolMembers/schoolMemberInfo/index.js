import React, { Component, Fragment } from 'react';
import get from 'lodash/get';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Input from 'material-ui/Input';
import isEmpty from 'lodash/isEmpty';
import { withStyles } from 'material-ui/styles';
import styled from 'styled-components';
import { verifyImageURL, getUserFullName } from '/imports/util';
import FileUpload from 'material-ui-icons/FileUpload';
import MobileDetect from 'mobile-detect';
import ProgressiveImage from 'react-progressive-image';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';
import UploadAvatar from '/imports/ui/components/schoolMembers/mediaDetails/UploadAvatar.js';
import { withPopUp } from "/imports/util";

import {
	CallMemberDialogBox,
	EmailMemberDialogBox,
	EditMemberDialogBox,
	ManageMemberShipDialogBox,
} from '/imports/ui/components/landing/components/dialogs/';
import {
	FormGhostButton,
	MemberActionButton
} from '/imports/ui/components/landing/components/buttons/';

import ConfirmationModal from '/imports/ui/modal/confirmationModal';
import SubscriptionBox from '/imports/ui/componentHelpers/boxes/subscriptionBox.js';
import SubscriptionsList from '/imports/ui/componentHelpers/subscriptions/SubscriptionsList.jsx';

const styles = (theme) => ({
	avatarCss: {
		minWidth: '100%',
		height: '163px',
		backgroundSize: 'cover',
		backgroundPosition: 'top center',
		borderRadius: '27px'
	},
	btnBackGround: {
		background: `${helpers.action}`
	},
	avatarContainer: {
		width: 100,
		textAlign: 'center'
	}
});


const ActionButtonsWrapper = styled.div`
	left: ${helpers.rhythmDiv * 2}px;
	bottom: ${helpers.rhythmDiv * 2}px;
	right: auto;
	padding: 5px;
	${helpers.flexCenter} @media screen and (max-width: ${helpers.tablet + 100}px) {
		justify-content: flex-start;
		align-items: flex-start;
		bottom: 0;
	}

	@media screen and (max-width: ${helpers.tablet}px) {
		position: initial;
		align-items: center;
		flex-direction: row;
		flex-wrap: wrap;
	}
`;

const ActionButton = styled.div`
	margin-right: ${helpers.rhythmDiv}px;

	@media screen and (max-width: ${helpers.tablet + 100}px) {
		margin-right: 0;
		margin-bottom: ${helpers.rhythmDiv * 2}px;
	}

	@media screen and (max-width: ${helpers.tablet}px) {
		margin-right: ${helpers.rhythmDiv}px;
	}
`;
const ProfilePic = styled.div`
	transition: background-image 1s linear !important;
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	background-image: url(${(props) => props.img});
	height: 150px;
	border-radius: 15px;
	width: 165px;
	border: 2px solid black;
	border-radius: 15px;
`;
const UploadDiv = styled.div`
	background: #448aff;
	/* display: block; */
	/* overflow: hidden; */
	position: relative;
	/* bottom: 21px; */
	margin: 4px auto 0 auto;
	/* overflow: hidden; */
	width: 137px;
	/* background-image: url((unknown)); */
	/* background-size: cover; */
	/* background-position: center; */
	/* height: 250px; */
	/* width: 250px; */
	border: 1px solid #bbb;
	/* width: 122px; */
	/* height: 100pc; */
	color: #fff;
	font-family: inherit;
	font-weight: 400;
`;

const ActionButtons = (props) => (
	<ActionButtonsWrapper>
		<ActionButton
			onClick={() => {
				props.handleCall(props.memberInfo);
			}}
		>
			<MemberActionButton icon iconName="phone" label="Call" />
		</ActionButton>

		<ActionButton
			onClick={() => {
				props.handleEmail(props.memberInfo);
			}}
		>
			<MemberActionButton secondary noMarginBottom label="Email" icon iconName="email" />
		</ActionButton>

		<ActionButton>
			{/*<MemberActionButton
				noMarginBottom
				label="Edit"
				icon
				iconName="edit"
			onClick={props.openEditMemberModal} /> */}
			<MemberActionButton
				noMarginBottom
				label="Edit Membership"
				icon
				iconName="edit"
				onClick={props.onEditMemberClick} />
		</ActionButton>
		{props.adminView &&
			!props.superAdmin && (
				<ActionButton>
					<MemberActionButton
						noMarginBottom
						label="Remove Admin"
						icon
						iconName="remove_circle_outline"
						onClick={props.removeButtonClick}
					/>
				</ActionButton>
			)}
	</ActionButtonsWrapper>
);

class SchoolMemberInfo extends Component {
	constructor(props) {
		super(props);
		this.state = this.initializeState(this.props);
	}

	initializeState = ({ memberInfo, view }) => {
		let state = {};
		state.showConfirmation = false;
		// if (view === 'admin') {
			state.notes = get(memberInfo, 'adminNotes', '');
			state.subscriptionsData = [];
			// } else {
			//   state.notes = get(
			//     memberInfo,
			//     `classmatesNotes[${Meteor.userId()}].notes`,
			//     ""
			//   );
		// }
		this.classDataFinder();	
		return state;
	};

	saveMyNotesInMembers = (event) => {
		const { memberInfo, view } = this.props;
		let payload = {};

		// if (view === 'admin' && Meteor.userId()) {
			payload.adminNotes = this.state.notes;
		// } else if (view === 'classmates' && Meteor.userId()) {
		// 	payload.classmatesNotes = {
		// 		[Meteor.userId()]: {
		// 			notes: this.state.notes
		// 		}
		// 	};
		// }
		Meteor.call(
			'schoolMemberDetails.editSchoolMemberDetails',
			{ doc_id: memberInfo.memberId, doc: payload },
			(err, res) => {
				if (res) {
				}
				if (err) {
				}
			}
		);
	};

	// Handle call button for member's view.
	handleCall = (memberInfo) => {
		// Detect mobile and dial number on phone else show popup that shows phone information.
		let md = new MobileDetect(window.navigator.userAgent);
		if (md.mobile()) {
			let schoolPhone = 'tel:+1-303-499-7111';
			if (schoolData.phone) {
				schoolPhone = `tel:${schoolData.phone}`;
				return `${schoolPhone}`;
			}
		} else {
			this.handleCallButtonClick();
		}
	};
	handleEmail = (memberInfo) => {
		this.handleEmailButtonClick();
	};

	handleEmailButtonClick = () => {
		this.handleDialogState('emailMemberDialog', true);
	};
	// Handle call us button click for school page
	handleCallButtonClick = () => {
		this.handleDialogState('callMemberDialog', true);
	};

	handleDialogState = (dialogName, state) => {
		//debugger;
		if(dialogName=='manageMemberShipDialog'){
			this.classDataFinder();
		}
		this.setState({
			[dialogName]: state
		});
	};
	classDataFinder = ()=>{
		let {schoolId,activeUserId} = this.props.memberInfo;
		Meteor.call('classInterest.findClassTypes',schoolId,activeUserId,(err,res)=>{
			if(res)
			this.setState({subscriptionsData:res})
			else
			this.setState({subscriptionsData:[]})
		})
	}
	getContactNumber = () => {
		return this.props.memberInfo && this.props.memberInfo.phone;
	};
	componentWillMount = () => {
		const { memberInfo } = this.props;
		verifyImageURL(memberInfo.pic, (res) => {
			if (res) {
				this.setState({ bgImg: memberInfo.pic });
			} else {
				this.setState({ bgImg: config.defaultProfilePic });
			}
		});
	};
	componentWillReceiveProps = (nextProps, nextState) => {
		const { memberInfo } = nextProps;
		this.setState(this.initializeState(nextProps));
		verifyImageURL(memberInfo.pic, (res) => {
			if (res) {
				this.setState({ bgImg: memberInfo.pic });
			} else {
				this.setState({ bgImg: config.defaultProfilePic });
			}
		});
	};
	handleRemove = () => {
		let _id, schoolId, to, userName, schoolName;
		const { memberInfo } = this.props;
		_id = memberInfo._id;
		schoolId = memberInfo.schoolId;
		to = memberInfo.email;
		userName = memberInfo.firstName;
		schoolName = memberInfo.schoolName;
		Meteor.call('school.manageAdmin', _id, schoolId, 'remove', to, userName, schoolName, (err, res) => {
			if (res) {
				this.setState({ showConfirmation: false });
			}
		});
	};
	removeAll = (classTimes,classTypeName)=>{
	const { memberInfo} = this.props;
	let userId = get(memberInfo,'activeUserId',null),data={};
	this.setState({all:true});
	classTimes.map((obj,index)=>{
		data.userId = userId;
		data.classTimeId = obj._id;
		data.classTypeName = classTypeName;
		data.classTimeName = obj.name;
		data.all = true ;
		this.removeFromCalendar(data);
	})
	}
	stopNotification = (payload)=>{
		this.setState({isBusy:true});
		let data = {};
		data.classTypeId = payload.classTypeId;
		data.userId = payload.userId;
		data.notification = !payload.notification;
		Meteor.call("classTypeLocationRequest.updateRequest", data, (err, res) => {
			const { popUp } = this.props;
			if (res) {
			  Meteor.call("classTimesRequest.updateRequest", data, (err1, res1) => {
				if (res1) {
					this.setState({isBusy:false});
				  popUp.appear("success", {
					content: `Notification ${data.notification ? 'enabled' : 'disabled'} successfully.`
				  });
				}
			  });
			}
			else{
				this.setState({isBusy:false});
				  popUp.appear("success", {
					content: `Notification ${data.notification ? 'enabled' : 'disabled'} successfully.`
				  });
			}
		  });
	}
	leaveSchool = ()=>{
	let {subscriptionsData} = this.state;
	this.setState({all:true});
	if(!isEmpty(subscriptionsData)){
		subscriptionsData.map((obj,index)=>{
			this.removeAll(obj.classTimes,obj.name);
		})
	}
	}
	removeFromCalendar = (data)=>{
		let {memberInfo} = this.props;
		let {classTimeName,classTypeName} = data;
		let schoolName = get(memberInfo,'schoolName','Hidden Leaf');
		this.setState({ isBusy: true});
		Meteor.call(
			"classInterest.removeClassInterestByClassTimeId",
			data,
			(error, res) => {
			  if(res){
				  this.setState({ isBusy: false});
				  const { popUp } = this.props;
				  popUp.appear("success", {
					content: `${data.all ? `Successfully removed all classes from ${schoolName}.` : `Successfully removed from ${classTypeName} : ${classTimeName}.`}.`
				  });
			  }
			 
			}
		  );
	}
	render() {
		const { memberInfo, view, classes, adminView, currentUser,notClassmatePage } = this.props;
		const { showUploadAvatarModal, mediaFormData, filterStatus, limit, bgImg, showConfirmation,subscriptionsData,isBusy } = this.state;
		let subscriptionList = get(memberInfo, 'subscriptionList', []);
		let superAdmin = get(memberInfo, 'superAdmin', false);
		let schoolName = get(memberInfo,'schoolName','Hidden Leaf');
		let studentName = get(memberInfo,'firstName',get(memberInfo,'name','Old Data'))
		let userId = get(memberInfo,'activeUserId',null);
		return (
			<Grid container>
				{showConfirmation && (
					<ConfirmationModal
						open={showConfirmation}
						submitBtnLabel="Yes, Remove"
						cancelBtnLabel="Cancel"
						message="You will remove this admin, Are you sure?"
						onSubmit={this.handleRemove}
						onClose={() => this.setState({ showConfirmation: false })}
					/>
				)}
				{this.state.manageMemberShipDialog && (
					<ManageMemberShipDialogBox
						subscriptionsData={subscriptionsData || []}
						studentName={studentName}
						open={this.state.manageMemberShipDialog}
						onModalClose={() => this.handleDialogState('manageMemberShipDialog', false)}
						removeAll = {this.removeAll}
						stopNotification = {this.stopNotification}
						leaveSchool = {this.leaveSchool}
						removeFromCalendar = {this.removeFromCalendar}
						schoolName = {schoolName}
						isBusy = {isBusy}
						userId = {userId}
					/>
				)}
				{this.state.callMemberDialog && (
					<CallMemberDialogBox
						contactNumbers={this.getContactNumber()}
						open={this.state.callMemberDialog}
						onModalClose={() => this.handleDialogState('callMemberDialog', false)}
					/>
				)}
				{this.state.emailMemberDialog && (
					<EmailMemberDialogBox
						open={this.state.emailMemberDialog}
						onModalClose={() => this.handleDialogState('emailMemberDialog', false)}
					/>
				)}
				{this.state.openEditMemberModal && (
					<EditMemberDialogBox
						open={this.state.openEditMemberModal}
						onModalClose={() => this.setState({ openEditMemberModal: false })}
						openEditTaggedModal={this.openEditMemberModal}
						memberInfo={memberInfo}
						classTypeData={this.props.classTypeData}
						reRender={this.props.handleMemberDetailsToRightPanel}
						schoolId={this.props.memberInfo && this.props.memberInfo.schoolId}
					/>
				)}
				<Grid container className="userInfoPanel" style={{ borderTop: 'solid 3px #ddd', display: 'flex' }}>
					<Grid
						item
						sm={8}
						xs={12}
						md={8}
						style={{
							display: 'flex',
							justifyContent: 'space-evenly',
							padding: '24px'
						}}
					>
						<Grid className={classes.avatarContainer} item sm={4} xs={4} md={4} key={memberInfo._id}>
							<ProgressiveImage src={bgImg} placeholder={config.blurImage}>
								{(src) => <ProfilePic img={src} />}
							</ProgressiveImage>

							{view === 'admin' ? (
								<UploadDiv
									onClick={() =>
										this.setState({
											showUploadAvatarModal: true,
											mediaFormData: null,
											filterStatus: false
										})}
								>
									Upload Image <FileUpload />
								</UploadDiv>
							) : (
									''
								)}
						</Grid>
						{
							<UploadAvatar
								showUploadAvatarModal={showUploadAvatarModal}
								onClose={() => {
									this.setState({ showUploadAvatarModal: false });
								}}
								formType={showUploadAvatarModal}
								ref="uploadAvatar"
								onAdd={this.onUploadAvatar}
								onEdit={this.onEditAvatar}
								memberInfo={memberInfo}
							/>
						}

						<Grid item sm={4} xs={4} md={4}>
							<Typography>{memberInfo.name}</Typography>
							{view === 'admin' && (
								<React.Fragment>
									<Typography>{memberInfo.phone}</Typography>
									<Typography>{memberInfo.email}</Typography>
								</React.Fragment>
							)}
							<ActionButtonsWrapper>
								<ActionButton onClick={() => { }}>
									<FormGhostButton icon iconName="remove_from_queue" label="Edit Membership" onClick={() => this.handleDialogState('manageMemberShipDialog', true)} />
								</ActionButton>
							</ActionButtonsWrapper>
						</Grid>
					</Grid>
					{notClassmatePage && (<Grid item sm={3} xs={12} md={3} style={{ padding: '28px' }}>
						<div className="notes">Admin Notes</div>
						<Input
							onBlur={this.saveMyNotesInMembers}
							value={this.state.notes}
							onChange={(e) => this.setState({ notes: e.target.value })}
							style={{ border: '1px solid', backgroundColor: '#fff' }}
							multiline
							rows={4}
							fullWidth
						/>
					</Grid>)}
					
				</Grid>
				{view === 'admin' && (
					<Grid container style={{ backgroundColor: 'darkgray', marginTop: '22px' }}>
						<Grid item>
							<ActionButtons
								memberInfo={this.props.memberInfo}
								handleCall={this.handleCall}
								handleEmail={this.handleEmail}
								onEditMemberClick={() => this.handleDialogState('manageMemberShipDialog', true)}
								openEditMemberModal={(event) => {
									this.setState({ openEditMemberModal: true });
								}}
								adminView={adminView}
								removeButtonClick={() => {
									this.setState({ showConfirmation: true });
								}}
								superAdmin={superAdmin}
							/>
						</Grid>
					</Grid>
				)}
				{!isEmpty(subscriptionList) &&
					view === 'admin' &&
					Meteor.settings.public.paymentEnabled &&
					(
						<SubscriptionsList
							maxListHeight={500}
							packageProps={{ bgColor: "white", opacity: 1 }}
							title={"Subscriptions"}
							subsType="adminSubscriptions"
							subsData={subscriptionList} />
					)}
				
			</Grid>
		);
	}
}
export default withStyles(styles, { withTheme: true })(withPopUp(SchoolMemberInfo));
