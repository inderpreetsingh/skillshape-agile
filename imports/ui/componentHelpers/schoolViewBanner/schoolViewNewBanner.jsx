import React,{Fragment} from 'react';
import {scroller} from 'react-scroll';
import {isEmpty} from 'lodash';
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

import withImageExists from '/imports/util/withImageExists.js';
import {imageExists} from '/imports/util';
import { withStyles } from "/imports/util";
import { getUserFullName } from '/imports/util/getUserData';
import config from '/imports/config';
import styles from "./style";
import UploadMedia from './uploadMedia';

import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';
import { schoolDetailsImgSrc } from '/imports/ui/components/landing/site-settings.js';

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

const imageExistsConfig = {
	originalImagePath: 'schoolData.mainImage',
	defaultImage: schoolDetailsImgSrc
}

class SchoolViewBanner extends React.Component {
	constructor(props){
		super(props);
		this.state={
			showBackgroundUpload: false,
		}
	}

	checkClaim = (currentUser, schoolId) => {
    if(currentUser && currentUser.profile && currentUser.profile.schoolId === schoolId)
      return false;
    return true;
  }

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
		this.handleDialogState('emailUsDialog',true);
	}

	handleDialogState = (dialogName,state) => {
		this.setState({
			[dialogName]: state
		})
	}

	getContactNumbers = () => {
		return this.props.schoolData.phone.split(/[\|\,\\]/);
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
				reviewsStats,
				bestPriceDetails,
		    isEdit,
				bgImg,
	  	} = this.props;
	  	const checkUserAccess = checkMyAccess({user: currentUser,schoolId});
			const ourEmail = this.getOurEmail();
			const emailUsButton = ourEmail ? true : false;
			// console.info('shcooll data',schoolData,"-------");
		return(<Fragment>
			{this.state.callUsDialog && <CallUsDialogBox contactNumbers={this.getContactNumbers()} open={this.state.callUsDialog} onModalClose={() => this.handleDialogState('callUsDialog',false)}/>}
			{this.state.emailUsDialog && <EmailUsDialogBox
					ourEmail={ourEmail}
					schoolData={schoolData}
					open={this.state.emailUsDialog}
					onModalClose={() => this.handleDialogState('emailUsDialog',false)} /> }
			{this.state.showBackgroundUpload && <UploadMedia
						schoolId={schoolId}
						showCreateMediaModal= {this.state.showBackgroundUpload}
						onClose={()=> this.setState({ showBackgroundUpload: false})}
						mediaFormData={schoolData}
						imageType={this.state.imageType}
				/>}
			<ClassTypeCover isEdit={isEdit} coverSrc={bgImg}>
				<ClassTypeCoverContent
	        noClassTypeData
					isEdit={isEdit}
					schoolLocation={schoolLocation}
					schoolDetails={{...schoolData}}
					logoSrc={schoolData.logoImg}
					coverSrc={bgImg}

					publishStatusButton={checkUserAccess && (() => <PublishStatusButtonWrapper>Publish / Unpublish
						<Switch checked={isPublish} className={this.props.classes.switchButton} onChange={this.props.handlePublishStatus} aria-label={schoolId} /></PublishStatusButtonWrapper>)}
					editButton={checkUserAccess && (() => <Link className={classes.ImageFooterbutton}  to={`/SchoolAdmin/${schoolData._id}/edit`}>
						<ClassTimeButton icon iconName='edit' label="Edit"> Edit </ClassTimeButton> </Link>)}

					actionButtonProps={{
						emailUsButton: emailUsButton,
						visitSiteButton: true,
						pricingButton: false,
						siteLink: schoolData.website,
						onEmailButtonClick: this.handleEmailUs,
						onCallUsButtonClick: () => this.handleCallUs(schoolData),
						onPricingButtonClick: () => this.scrollTo('price-section'),
						onScheduleButtonClick: () => this.scrollTo('schedule-section')
					}}

					reviews={reviewsStats}

					bestPriceDetails={bestPriceDetails}

	        onEditLogoButtonClick={() => this.setState({ showBackgroundUpload: true, imageType: "logoImg"})}
					onEditBgButtonClick={() => this.setState({showBackgroundUpload: true, imageType: "mainImage"})}
				/>
			</ClassTypeCover>
			</Fragment>)
	}
}

export default withStyles(styles)(withImageExists(SchoolViewBanner,imageExistsConfig));
