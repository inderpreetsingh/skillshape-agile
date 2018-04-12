import React,{Fragment} from 'react';
import {scroller} from 'react-scroll';
import { Link } from 'react-router';
import styled from 'styled-components';
import find from "lodash/find";

import Grid from 'material-ui/Grid';
import Card, {CardMedia} from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Edit from 'material-ui-icons/Edit';
import Email from 'material-ui-icons/Email';
import Phone from 'material-ui-icons/Phone';
import Switch from 'material-ui/Switch';
import MobileDetect from 'mobile-detect';

import ClassTimeButton from '/imports/ui/components/landing/components/buttons/ClassTimeButton.jsx';
import ClassTypeCover from '/imports/ui/components/landing/components/class/cover/ClassTypeCover.jsx';
import ClassTypeCoverContent from '/imports/ui/components/landing/components/class/cover/ClassTypeCoverContent.jsx';

import CallUsDialogBox from '/imports/ui/components/landing/components/dialogs/CallUsDialogBox.jsx';
import EmailUsDialogBox from '/imports/ui/components/landing/components/dialogs/EmailUsDialogBox.jsx';

import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';
import { withStyles } from "/imports/util";
import { getUserFullName } from '/imports/util/getUserData';
import UploadMedia from './uploadMedia';
import config from '/imports/config';
import styles from "./style";

const PublishStatusButtonWrapper = styled.div`
	${helpers.flexCenter}
	justify-content: flex-start;
	font-size: ${helpers.baseFontSize}px;
	font-family: ${helpers.specialFont};
	color: ${helpers.black};
`;

styles.switchButton = {
	width: helpers.rhythmDiv * 5,
	height: helpers.rhythmDiv * 5
}

class SchoolViewBanner extends React.Component {
	constructor(props){
		super(props);
		this.state={
			showBackgroundUpload: false
		}
	}

	checkClaim = (currentUser, schoolId) => {
    if(currentUser && currentUser.profile && currentUser.profile.schoolId === schoolId)
      return false;
    return true;
  }

  // handleEmailUs = (schoolData) => {
  // 	let superAdmin = find(schoolData.adminsData, {_id: schoolData.superAdmin});
  // 	let fullName = getUserFullName(superAdmin)
  // 	let url = `${Meteor.absoluteUrl()}schools/${schoolData.slug}`;
	// 	window.location.href = `mailto:${schoolData.email}?subject=I%20wish%20your%20listing%20was%20up%20to%20date%21&body=Hi%20${fullName}%2C%0A%0AI%20am%20on%20SkillShape.com%20looking%20at%20your%20listing.%20It%20seems%20to%20be%20not%20up%20to%20date.%0AIt%20would%20really%20help%20me%20and%20other%20students%20get%20to%20your%20classes%20if%20it%20was%20updated.%20I%20would%20probably%20attend%20a%20class%21%0AHere%20is%20the%20link%2C%20you%20can%20fix%20it%20and%20I%20will%20use%20it%20when%20you%20do%21%0A${url}%0A%0AThanks`;
  // }

	handleCallUs = (schoolData) => {
		// Detect mobile and dial number on phone else show popup that shows phone information.
		let md = new MobileDetect(window.navigator.userAgent);
		if(md.mobile()) {
			let schoolPhone = "tel:+1-303-499-7111";
			if(schoolData.phone) {
				schoolPhone = `tel:${schoolData.phone}`;
				return `${schoolPhone}`;
			}
		}
		else {
				this.handleCallUsButtonClick();
		}
	}

	// Handle call us button click for school page
	handleCallUsButtonClick = () => {
		this.handleDialogState('callUsDialog',true);
	}

	handleEmailUs = () => {
		console.log('handle email us clicked..')
		this.handleDialogState('emailUsDialog',true);
	}

	handleDialogState = (dialogName,state) => {
		this.setState({
			[dialogName]: state
		})
	}

	getContactNumbers = () => {
		return this.props.schoolData.phone.split(',');
	}

	getOurEmail = () => {
		return this.props.schoolData.email;
	}

	scrollTo(name) {
			scroller.scrollTo((name || 'content-container'), {
					duration: 800,
					delay: 0,
					smooth: 'easeInOutQuart'
			})
	}

	render(){
		const {
		    classes,
		    schoolData,
        schoolLocation,
		    schoolId,
        isPublish,
		    currentUser,
				bestPriceDetails,
		    isEdit
	  	} = this.props;
	  	const checkUserAccess = checkMyAccess({user: currentUser,schoolId});
			const ourEmail = this.getOurEmail();
			const emailUsButton = ourEmail ? true : false;
			console.info('shcooll data',schoolData,"-------");
		return(<Fragment>
			{this.state.callUsDialog && <CallUsDialogBox contactNumbers={this.getContactNumbers()} open={this.state.callUsDialog} onModalClose={() => this.handleDialogState('callUsDialog',false)}/>}
			{this.state.emailUsDialog && <EmailUsDialogBox ourEmail={ourEmail} open={this.state.emailUsDialog} onModalClose={() => this.handleDialogState('emailUsDialog',false)} /> }
			{this.state.showBackgroundUpload && <UploadMedia
						schoolId={schoolId}
						showCreateMediaModal= {this.state.showBackgroundUpload}
						onClose={()=> this.setState({ showBackgroundUpload: false})}
						mediaFormData={schoolData}
						imageType={this.state.imageType}
				/>}
			<ClassTypeCover isEdit={isEdit} coverSrc={schoolData.mainImage || config.defaultSchoolImage}>
				<ClassTypeCoverContent
	        noClassTypeData
					isEdit={isEdit}
					schoolLocation={schoolLocation}
					schoolDetails={{...schoolData}}
					logoSrc={schoolData.logoImg}
					coverSrc={schoolData.mainImage || config.defaultSchoolImage}

					publishStatusButton={checkUserAccess && (() => <PublishStatusButtonWrapper>Publish / Unpublish
						<Switch checked={isPublish} className={this.props.classes.switchButton} onChange={this.props.handlePublishStatus} aria-label={schoolId} /></PublishStatusButtonWrapper>)}
					editButton={checkUserAccess && (() => <Link className={classes.ImageFooterbutton}  to={`/School-Admin/${schoolData._id}/edit`}>
						<ClassTimeButton icon iconName='edit' label="Edit"> Edit </ClassTimeButton> </Link>)}

					actionButtonProps={{
						emailUsButton: emailUsButton,
						scheduleButton: true,
						pricingButton: false,
						onEmailButtonClick: this.handleEmailUs,
						onCallUsButtonClick: () => this.handleCallUs(schoolData),
						onPricingButtonClick: () => this.scrollTo('price-section'),
						onScheduleButtonClick: () => this.scrollTo('schedule-section')
					}}

					bestPriceDetails={bestPriceDetails}

	        onEditLogoButtonClick={() => this.setState({ showBackgroundUpload: true, imageType: "logoImg"})}
					onEditBgButtonClick={() => this.setState({showBackgroundUpload: true, imageType: "mainImage"})}
				/>
			</ClassTypeCover>
			</Fragment>)
	}
}

export default withStyles(styles)(SchoolViewBanner)
