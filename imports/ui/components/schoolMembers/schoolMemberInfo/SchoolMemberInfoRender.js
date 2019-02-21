import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import FileUpload from 'material-ui-icons/FileUpload';
import Grid from 'material-ui/Grid';
import Input from 'material-ui/Input';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import MobileDetect from 'mobile-detect';
import React, { Component } from 'react';
import ProgressiveImage from 'react-progressive-image';
import styled from 'styled-components';
import SubscriptionsList from '/imports/ui/componentHelpers/subscriptions/SubscriptionsList.jsx';
import IconButton from "material-ui/IconButton";
import MenuIcon from 'material-ui-icons/Menu';
import { FormGhostButton, PrimaryButton, MemberActionButton } from '/imports/ui/components/landing/components/buttons/';
import { CallMemberDialogBox, EditMemberDialogBox, EmailMemberDialogBox, ManageMemberShipDialogBox } from '/imports/ui/components/landing/components/dialogs/';
import UploadAvatar from '/imports/ui/components/schoolMembers/mediaDetails/UploadAvatar.js';
import ConfirmationModal from '/imports/ui/modal/confirmationModal';
import { verifyImageURL, withPopUp, confirmationDialog } from '/imports/util';
import { Text, SubHeading } from '/imports/ui/components/landing/components/jss/sharedStyledComponents.js';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

const AVATAR_SIZE = 165;

const styles = (theme) => ({
	avatarCss: {
		minWidth: '100%',
		height: '160px',
		backgroundSize: 'cover',
		backgroundPosition: 'top center',
		borderRadius: '24px'
	},
	btnBackGround: {
		background: `${helpers.action}`
	},
	avatarContainer: {
		width: 100,
		textAlign: 'center'
	},
	adminNotesInput: {
		background: '#fff',
		borderRadius: 5,
		border: `1px solid ${helpers.darkBgColor}`
	}
});

const Wrapper = styled.div`
	width: 100%;
	background-color: white;
	position: relative;
	padding: ${helpers.rhythmDiv * 2}px;
`;

const UserInfoPanel = styled.div`
	display: flex;
	flex-direction: column;
	max-width: 400px;
	margin: 0 auto ${helpers.rhythmDiv * 2}px auto;
	padding: ${helpers.rhythmDiv * 2}px;

	@media screen and (max-width: ${helpers.tablet}px) {
		width: 100%;
		flex-direction: column;
		padding-top: ${helpers.rhythmDiv * 4}px;
	}
`;

const UserProfile = styled.div`
	display: flex;

	@media screen and (max-width: ${helpers.tablet}px) {
		justify-content: space-between;
		align-items: center;
		margin-bottom: ${helpers.rhythmDiv * 2}px;
	}

	@media screen and (max-width: ${helpers.mobile}px) {
		margin-bottom: 0;
		flex-direction: column;
	}
`;

const UIPanelElem = styled.div`
	
	@media screen and (max-width: ${helpers.tablet}px) {
		margin-right: 0;
	}

	@media screen and (max-width: ${helpers.mobile}px) {
		margin-bottom: ${helpers.rhythmDiv * 2}px;
	}
`;

const AvatarContainer = UIPanelElem.extend`
	text-align: center;
	
	@media screen and (max-width: ${helpers.tablet}px) {
		margin-right: ${helpers.rhythmDiv}px;
	}
	
	@media screen and (max-width: ${helpers.mobile}px) {
		margin-right: 0;
		margin-bottom: ${helpers.rhythmDiv * 2}px;
	}
`;

const MemberDetails = UIPanelElem.extend`
	display: flex;
	justify-content: flex-start;
	margin-bottom: ${helpers.rhythmDiv * 2}px;

	@media screen and (max-width: ${helpers.mobile}px) {
		flex-direction: column;
		align-items: center;
		margin-bottom: 0;
	}
`;

const AdminNotes = UIPanelElem.extend`
	margin-right: 0;
	display: flex;
	flex-direction: column;
`;

const ButtonWrapper = styled.div`margin-bottom: ${helpers.rhythmDiv}px;`;

const ActionButtonsBar = styled.div`
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	margin: 0 auto;
	width: 100%;

	@media screen and (max-width: ${helpers.mobile}px) {
		justify-content: center;
	}
`;

const Avatar = styled.div`
	margin-right: ${helpers.rhythmDiv * 2}px;

	@media screen and (max-width: ${helpers.mobile}px) {
		margin-right: 0;
		margin-bottom: ${helpers.rhythmDiv * 2}px;
	}
`;

const MemberActions = styled.div`
	display: flex;
	flex-direction: column;
`;

const MemberName = SubHeading.extend`
	font-size: ${helpers.baseFontSize * 2}px;
	word-break: break-all;

	@media screen and (max-width: ${helpers.mobile}px) {
		margin-bottom: ${helpers.rhythmDiv * 2}px;
		font-size: ${helpers.baseFontSize * 2}px;
		text-align: center;
	}
`;

const MediaTitle = SubscriptionsTitle = MemberName.extend`
	font-size: ${helpers.baseFontSize * 1.5}px;
	text-align: center;
	font-weight: 300;
	font-style: italic;

	@media screen and (max-width: ${helpers.mobile}px) {
		font-size: ${helpers.baseFontSize * 1.5}px;
	}
`;


const ActionBtnsWrapper = styled.div` 
	display: flex;
	flex-wrap: wrap;
`;

const ActionBtn = styled.div`
	margin-bottom: ${helpers.rhythmDiv}px;
	
	:last-of-type {
		margin-bottom: 0;
	}
`;

const ProfilePic = styled.div`
	transition: background-image 1s linear !important;
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	background-image: url(${(props) => props.img});
	height: 100px;
	width: 100px;
	border-radius: 50%;
	border: 2px solid black;
`;
const UploadDiv = styled.div`
	// background: #448aff;
	
	/* display: block; */
	/* overflow: hidden; */
	/* bottom: 21px; */
	/* overflow: hidden; */
	/* background-image: url((unknown)); */
	/* background-size: cover; */
	/* background-position: center; */
	/* height: 250px; */
	/* width: 250px; */
	background: ${helpers.primaryColor};
	position: relative;
	margin: ${helpers.rhythmDiv}px auto 0 auto;
	width: ${AVATAR_SIZE}px;
	border: 1px solid #bbb;
	color: #fff;
	font-family: inherit;
	font-weight: 400;
	height: ${helpers.rhythmDiv * 4}px;
	border-radius: 5px;
	font-family: ${helpers.specialFont};
	${helpers.flexCenter}

	@media screen and (max-width: ${helpers.mobile - 50}px) {
		width: 100%;
	}
`;


const CornerBtnWrapper = styled.div`
	position: absolute;
	top: -16px;
	right: 0;
`;

const MenuIconWrapper = CornerBtnWrapper.extend`
	display: none;
	top: 8px;
	left: 8px;
	right: auto;

	@media screen and (max-width: ${helpers.tablet}px) {
		display: block;
	}
`;


const ActionButtons = (props) => (
	<ActionBtnsWrapper>
		<ActionBtn
			onClick={() => {
				props.handleCall(props.memberInfo);
			}}
		>
			<FormGhostButton icon iconName="phone" label="Call" />
		</ActionBtn>

		<ActionBtn
			onClick={() => {
				props.handleEmail(props.memberInfo);
			}}
		>
			<FormGhostButton noMarginBottom label="Email" icon iconName="email" />
		</ActionBtn>

		{/*<ActionBtn>
			<MemberActionButton
				noMarginBottom
				label="Edit"
				icon
				iconName="edit"
			onClick={props.openEditMemberModal} /> 
			<MemberActionButton
				noMarginBottom
				label="Edit Membership"
				icon
				iconName="edit"
				onClick={props.onEditMemberClick} />
		</ActionBtn>*/}
		{props.isAdmin &&
			!props.superAdmin && props.view == "admin" && (
				<ActionBtn>
					<MemberActionButton
						noMarginBottom
						label="Remove Admin"
						icon
						iconName="remove_circle_outline"
						onClick={props.removeButtonClick}
					/>
				</ActionBtn>
			)}
	</ActionBtnsWrapper>
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
	purchasePackageDataChecker = (classTimes, classTypeName, _id, schoolId) => {
		Meteor.call('enrollment.checkPackagesFromClassTypeAndSchoolId', { classTypeId: _id, schoolId }, (err, res) => {
			const { popUp } = this.props;
			if (!isEmpty(res)) {
				let data = {}, latestExpirationDate = get(res[0], 'endDate', new Date());
				data = {
					popUp,
					title: 'Confirmation',
					type: 'inform',
				}
				if (_id) {
					data.content = `You have one or more active subscriptions until ${formatDate(latestExpirationDate)}. Do you want to remove this class from your calendar? If you join again before the expiration, your Packages will still be active.`
					data.buttons = [{ label: 'Leave Class', onClick: () => { this.removeAll(classTimes, classTypeName, _id) }, alert: true }, { label: 'Cancel', onClick: () => { }, greyColor: true }];
				}
				else {
					data.content = `You have one or more active subscriptions until ${formatDate(latestExpirationDate)}. Do you want to remove the school and all classes from your calendar? If you join again before the expiration, your Packages will still be active.`
					data.buttons = [{ label: 'Leave School', onClick: () => { this.leaveSchoolHandler() }, alert: true }, { label: 'Cancel', onClick: () => { }, greyColor: true }];
				}
				confirmationDialog(data);
			}
			else {
				_id ? this.removeAll(classTimes, classTypeName, _id) : this.leaveSchoolHandler();
			}
		})
	}
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
		// let md = new MobileDetect(window.navigator.userAgent);
		// debugger;
		// console.log(md.mobile(), md.maxMobileWidth, "...........");	
		// if (md.mobile()) {
		// 	let schoolPhone = 'tel:+1-303-499-7111';
		// 	if (memberInfo.phone) {
		// 		schoolPhone = `tel:${schoolData.phone}`;
		// 		return `${schoolPhone}`;
		// 	}
		// } else {
		// }
		this.handleCallButtonClick();
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
		if (dialogName == 'manageMemberShipDialog') {
			this.classDataFinder();
		}
		this.setState({
			[dialogName]: state
		});
	};
	classDataFinder = () => {
		let { schoolId, activeUserId } = this.props.memberInfo;
		Meteor.call('classInterest.findClassTypes', schoolId, activeUserId, (err, res) => {
			if (res)
				this.setState({ subscriptionsData: res })
			else
				this.setState({ subscriptionsData: [] })
		})
	}
	getContactNumber = () => {
		//console.info(this.props, "........... props, get contact number");
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
	removeAll = (classTimes, classTypeName) => {
		const { memberInfo } = this.props;
		let userId = get(memberInfo, 'activeUserId', null), data = {};
		this.setState({ all: true });
		classTimes.map((obj, index) => {
			data.userId = userId;
			data.classTimeId = obj._id;
			data.classTypeName = classTypeName;
			data.classTimeName = obj.name;
			data.all = true;
			this.removeFromCalendar(data);
		})
	}
	stopNotification = (payload) => {
		this.setState({ isBusy: true });
		let data = {};
		data.classTypeId = payload.classTypeId;
		data.userId = payload.userId;
		data.notification = !payload.notification;
		Meteor.call("classTypeLocationRequest.updateRequest", data, (err, res) => {
			const { popUp } = this.props;
			if (res) {
				Meteor.call("classTimesRequest.updateRequest", data, (err1, res1) => {
					if (res1) {
						this.setState({ isBusy: false });
						popUp.appear(
							'success',
							{
								title: 'Success',
								content: `Notification ${data.notification ? 'enabled' : 'disabled'} successfully.`,
								RenderActions: (
									<ButtonWrapper>
										<FormGhostButton
											label={'Ok'}
											onClick={this.okClick}
											applyClose
										/>
									</ButtonWrapper>
								)
							},
							true
						);
					}
				});
			}
			else {
				this.setState({ isBusy: false });
				popUp.appear(
					'success',
					{
						title: 'Success',
						content: `Notification ${data.notification ? 'enabled' : 'disabled'} successfully.`,
						RenderActions: (
							<ButtonWrapper>
								<FormGhostButton
									label={'Ok'}
									onClick={this.okClick}
									applyClose
								/>
							</ButtonWrapper>
						)
					},
					true
				);
			}
		});
	}
	leaveSchool = () => {
		let { popUp, memberInfo, isAdmin } = this.props;
		let studentName = get(memberInfo, 'firstName', get(memberInfo, 'name', 'No Name'));
		let schoolId = get(memberInfo, 'schoolId', null);
		let superAdmin = get(memberInfo, 'superAdmin', false);
		let schoolName = get(memberInfo, 'schoolName', 'Hidden Leaf');
		let isThisMyMemberShip = get(memberInfo, '_id', 0) == Meteor.userId();
		let content = '';
		if (!isThisMyMemberShip && (superAdmin || isAdmin)) {
			content = `You are about to remove ${studentName} from all class types at ${schoolName}. The classes will no longer appear in their calendar and they will no longer receive notifications. Are you sure?`
		}
		else {
			content = `You are about to leave from all class types at ${schoolName}. The classes will no longer appear in your calendar and you will no longer receive notifications. Are you sure?`
		}
		popUp.appear(
			'inform',
			{
				title: 'Confirmation',
				content,
				RenderActions: (
					<ButtonWrapper>
						<FormGhostButton
							label={'Cancel'}
							applyClose
						/>
						<FormGhostButton
							label={'Yes'}
							onClick={() => { this.purchasePackageDataChecker(null, null, null, schoolId) }}
							applyClose
						/>
					</ButtonWrapper>
				)
			},
			true
		);
	}
	leaveSchoolHandler = () => {
		let { subscriptionsData } = this.state;
		this.setState({ all: true });
		if (!isEmpty(subscriptionsData)) {
			subscriptionsData.map((obj, index) => {
				this.removeAll(obj.classTimes, obj.name);
			})
		}
	}
	okClick = () => {
		this.classDataFinder();
	}
	removeFromCalendar = (data) => {
		let { memberInfo } = this.props;
		let { classTimeName, classTypeName } = data;
		let schoolName = get(memberInfo, 'schoolName', 'Hidden Leaf');
		this.setState({ isBusy: true });
		Meteor.call(
			"classInterest.removeClassInterestByClassTimeId",
			data,
			(error, res) => {
				if (res) {
					this.setState({ isBusy: false });
					const { popUp } = this.props;
					popUp.appear(
						'success',
						{
							title: 'Success',
							content: `${data.all ? `Successfully removed all classes from ${schoolName}.` : `Successfully removed from ${classTypeName} : ${classTimeName}.`}.`,
							RenderActions: (
								<ButtonWrapper>
									<FormGhostButton
										label={'Ok'}
										onClick={this.okClick}
										applyClose
									/>
								</ButtonWrapper>
							)
						},
						true
					);
				}

			}
		);
	}
	render() {
		const {
			memberInfo,
			view,
			classes,
			isAdmin,
			currentUser,
			notClassmatePage,
			selectedSchoolData,
			handleDrawerToggle
		} = this.props;
		const {
			showUploadAvatarModal,
			mediaFormData,
			filterStatus,
			limit,
			bgImg,
			showConfirmation,
			manageMemberShipDialog,
			subscriptionsData,
			isBusy,
			callMemberDialog
		} = this.state;
		let subscriptionList = get(memberInfo, 'subscriptionList', []);
		let superAdmin = get(memberInfo, 'superAdmin', false);
		let schoolName = get(memberInfo, 'schoolName', 'Hidden Leaf');
		let studentName = get(memberInfo, 'firstName', get(memberInfo, 'name', 'Old Data'))
		let userId = get(memberInfo, 'activeUserId', null);
		let schoolImg = (get(memberInfo, 'schoolImg', null));
		let userName = get(memberInfo, 'name', get(memberInfo, 'firstName', get(memberInfo, 'lastName', get(memberInfo, 'email', "Old Data"))));

		console.info(memberInfo, "...................");

		return (
			<Wrapper>
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
				{manageMemberShipDialog && (
					<ManageMemberShipDialogBox
						subscriptionsData={subscriptionsData || []}
						studentName={studentName}
						open={this.state.manageMemberShipDialog}
						onModalClose={() => this.handleDialogState('manageMemberShipDialog', false)}
						removeAll={this.purchasePackageDataChecker}
						stopNotification={this.stopNotification}
						leaveSchool={this.leaveSchool}
						removeFromCalendar={this.removeFromCalendar}
						schoolName={schoolName}
						isBusy={isBusy}
						userId={userId}
						schoolImg={schoolImg}
					/>
				)}
				{callMemberDialog && (
					<CallMemberDialogBox
						contactNumbers={this.getContactNumber()}
						open={callMemberDialog}
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
				<UserInfoPanel className="userInfoPanel" >
					<UserProfile>
						<AvatarContainer key={memberInfo._id}>
							<MemberDetails>
								<Avatar>
									<ProgressiveImage
										src={bgImg}
										placeholder={config.blurImage}>
										{(src) => <ProfilePic img={src} />}
									</ProgressiveImage>
								</Avatar>

								<MemberActions>
									<MemberName>{userName}</MemberName>
									{isAdmin && (
										<ActionButtonsBar>
											<ActionButtons
												memberInfo={this.props.memberInfo}
												handleCall={this.handleCall}
												handleEmail={this.handleEmail}
												onEditMemberClick={() => this.handleDialogState('manageMemberShipDialog', true)}
												openEditMemberModal={(event) => {
													this.setState({ openEditMemberModal: true });
												}}
												isAdmin={isAdmin}
												removeButtonClick={() => {
													this.setState({ showConfirmation: true });
												}}
												superAdmin={superAdmin}
												view={view}
											/>
										</ActionButtonsBar>
									)}
								</MemberActions>
							</MemberDetails>

							{view === 'admin' && (
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
							)}


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
						</AvatarContainer>

						{/* <MemberDetails>
							<Text>{userName}</Text>
							{isAdmin && (
								<React.Fragment>
									{memberInfo.phone && <Text>{memberInfo.phone}</Text>}
									{memberInfo.email && <Text>{memberInfo.email}</Text>}
								</React.Fragment>
							)}
							{/* {(userId === Meteor.userId() || isAdmin) &&
								<FormGhostButton icon iconName="remove_from_queue" label="Edit Membership" onClick={() => this.handleDialogState('manageMemberShipDialog', true)} />
							} 
							{/* &&
								<FormGhostButton icon iconName="remove_from_queue" label="Edit Membership" onClick={() => this.handleDialogState('manageMemberShipDialog', true)} />
							
						</MemberDetails> */}
					</UserProfile>
					{notClassmatePage && <AdminNotes>
						<Text>Admin Notes</Text>
						<Input
							onBlur={this.saveMyNotesInMembers}
							value={this.state.notes}
							onChange={(e) => this.setState({ notes: e.target.value })}
							className={classes.adminNotesInput}
							multiline
							rows={4}
							fullWidth
						/>
					</AdminNotes>}
				</UserInfoPanel>

				{!isEmpty(subscriptionList) &&
					(isAdmin || userId == Meteor.userId()) &&
					Meteor.settings.public.paymentEnabled &&
					(<React.Fragment>
						<SubscriptionsTitle>Subscriptions</SubscriptionsTitle>
						<SubscriptionsList
							listBgColor={helpers.panelColor}
							packageProps={{ bgColor: "white", opacity: 1 }}
							subsType="adminSubscriptions"
							subsData={subscriptionList} />
					</React.Fragment>
					)}
				<MenuIconWrapper>
					<IconButton
						color={helpers.black}
						aria-label="open drawer"
						onClick={handleDrawerToggle}
					>
						<MenuIcon />
					</IconButton>
				</MenuIconWrapper>
				<CornerBtnWrapper>
					<PrimaryButton icon iconName="edit" label="Edit Membership" onClick={() => this.handleDialogState('manageMemberShipDialog', true)} />
				</CornerBtnWrapper>
			</Wrapper>
		);
	}
}
export default withStyles(styles, { withTheme: true })(withPopUp(SchoolMemberInfo));
