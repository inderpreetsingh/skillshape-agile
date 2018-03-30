import React,{Fragment} from 'react';
import { Link } from 'react-router';

import Grid from 'material-ui/Grid';
import Card, {CardMedia} from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Edit from 'material-ui-icons/Edit';
import Email from 'material-ui-icons/Email';
import Phone from 'material-ui-icons/Phone';
import Switch from 'material-ui/Switch';

import find from "lodash/find";

import UploadMedia from './uploadMedia';
import config from '/imports/config';
import styles from "./style";
import { withStyles } from "/imports/util";
import { getUserFullName } from '/imports/util/getUserData';

import ClassTimeButton from '/imports/ui/components/landing/components/buttons/ClassTimeButton.jsx';
import ClassTypeCover from '/imports/ui/components/landing/components/class/cover/ClassTypeCover.jsx';
import ClassTypeCoverContent from '/imports/ui/components/landing/components/class/cover/ClassTypeCoverContent.jsx';

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

  	getMailToData = (schoolData) => {
	  	let superAdmin = find(schoolData.adminsData, {_id: schoolData.superAdmin});
	  	let fullName = getUserFullName(superAdmin)
	  	let url = `${Meteor.absoluteUrl()}schools/${schoolData.slug}`;
  		return `mailto:${schoolData.email}?subject=I%20wish%20your%20listing%20was%20up%20to%20date%21&body=Hi%20${fullName}%2C%0A%0AI%20am%20on%20SkillShape.com%20looking%20at%20your%20listing.%20It%20seems%20to%20be%20not%20up%20to%20date.%0AIt%20would%20really%20help%20me%20and%20other%20students%20get%20to%20your%20classes%20if%20it%20was%20updated.%20I%20would%20probably%20attend%20a%20class%21%0AHere%20is%20the%20link%2C%20you%20can%20fix%20it%20and%20I%20will%20use%20it%20when%20you%20do%21%0A${url}%0A%0AThanks`
  	}
  	handleCallUs = (schoolData) => {
  		console.log("schoolData",schoolData)
  		let schoolPhone = "tel:+1-303-499-7111";
  		if(schoolData.phone) {
			schoolPhone = `tel:${schoolData.phone}`;
		}
  		return `${schoolPhone}`;
  	}

	render(){
		const {
		    classes,
		    schoolData,
        schoolLocation,
		    schoolId,
        isPublish,
		    currentUser,
		    isEdit
	  	} = this.props;
	  	const checkUserAccess = checkMyAccess({user: currentUser,schoolId});
			console.info('shcooll data',schoolData,"-------");
		return(<Fragment><ClassTypeCover coverSrc={schoolData.mainImage || config.defaultSchoolImage}>
			<ClassTypeCoverContent
        noClassTypeData
				isEdit={isEdit}
        schoolLocation={schoolLocation}

        publishStatusButton={checkUserAccess && (() => <div>Publish / Unpublish
          <Switch checked={isPublish} onChange={this.props.handlePublishStatus} aria-label={schoolId} /></div>)}
        editButton={checkUserAccess && (() => <Link className={classes.ImageFooterbutton}  to={`/School-Admin/${schoolData._id}/edit`}>
          <ClassTimeButton icon iconName='edit' label="Edit"> Edit </ClassTimeButton> </Link>)}

        onEditLogoButtonClick={() => this.setState({ showBackgroundUpload: true, imageType: "logoImg"})}
				onEditBgButtonClick={() => this.setState({showBackgroundUpload: true, imageType: "mainImage"})}
				coverSrc={schoolData.mainImage || config.defaultSchoolImage}
				schoolDetails={{...schoolData}}
				onCallUsButtonClick={this.handleCallUs}
				onEmailButtonClick={() => this.getMailToData(schoolData)}
				onPricingButtonClick={() => this.scrollTo('price-section')}
			/>
		</ClassTypeCover>
		{
				this.state.showBackgroundUpload && <UploadMedia
						schoolId={schoolId}
						showCreateMediaModal= {this.state.showBackgroundUpload}
						onClose={()=> this.setState({ showBackgroundUpload: false})}
						mediaFormData={schoolData}
						imageType={this.state.imageType}
				/>
		}</Fragment>)
	}
}

export default withStyles(styles)(SchoolViewBanner)
