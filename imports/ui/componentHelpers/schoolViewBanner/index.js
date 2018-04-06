import React,{Fragment} from 'react';
import Grid from 'material-ui/Grid';
import Card, {CardMedia} from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Edit from 'material-ui-icons/Edit';
import Email from 'material-ui-icons/Email';
import Phone from 'material-ui-icons/Phone';
import { Link } from 'react-router';
import find from "lodash/find";


import MobileDetect from 'mobile-detect';
import UploadMedia from './uploadMedia';
import config from '/imports/config';
import styles from "./style";
import { withStyles } from "/imports/util";
import { getUserFullName } from '/imports/util/getUserData';

import ClassTimeButton from '/imports/ui/components/landing/components/buttons/ClassTimeButton.jsx';
import ClassTypeCover from '/imports/ui/components/landing/components/class/cover/ClassTypeCover.jsx';
import ClassTypeCoverContent from '/imports/ui/components/landing/components/class/cover/ClassTypeCoverContent.jsx';
import CallUsDialogBox from '/imports/ui/components/landing/components/dialogs/CallUsDialogBox.jsx';


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
		// Detect mobile and dial number on phone else show popup that shows phone information.
		let md = new MobileDetect(window.navigator.userAgent);
		if(md.mobile()) {
  		let schoolPhone = "tel:+1-303-499-7111";
  		if(schoolData.phone) {
			schoolPhone = `tel:${schoolData.phone}`;
			return `${schoolPhone}`;
		}
		} else {
			this.handleCallUsButtonClick();
		}
  	}

  	// Handle call us button click for school page
    handleCallUsButtonClick = () => {
      this.handleDialogState('callUsDialog',true);
    }

    handleDialogState = (dialogName,state) => {
      this.setState({
        [dialogName]: state
      })
    }
    getContactNumbers = () => {
      return this.props.schoolData.phone.split(',');
    }

	render(){
		const {
		    classes,
		    schoolData,
		    schoolId,
		    currentUser,
		    isEdit
	  	} = this.props;
	  	const checkUserAccess = checkMyAccess({user: currentUser,schoolId});
			console.info('shcooll data',schoolData,"-------");
		return(<Grid container className={classes.schoolHeaderContainer}>
	  <Grid item xs={12}  style={{paddingTop: 0}}>
	  	{this.state.callUsDialog && <CallUsDialogBox contactNumbers={this.getContactNumbers()} open={this.state.callUsDialog} onModalClose={() => this.handleDialogState('callUsDialog',false)}/>}
	    <CardMedia  className={classes.cardMedia} >
	        {schoolData.mainImage && <div className={classes.imageContainer} style={{backgroundImage: `url(${ schoolData.mainImage || config.defaultSchoolImage })`}}> </div>}
	        <div className={classes.imageHeader}>
	          {isEdit ?
	            <Button raised dense color="accent" className={classes.bgEditButton1}  onClick={() => this.setState({ showBackgroundUpload: true, imageType: "mainImage"})}>
	                      <Edit className={classes.ImageFooterIcon} />
	                      Background
	        </Button>
	            : (

	              checkUserAccess && (
	                <Link className={classes.ImageFooterbutton}  to={`/SchoolAdmin/${schoolData._id}/edit`}>
	                  <Button raised color="accent">
	                    Edit
	                  </Button>
	                </Link>
	              )
	          )}

	        </div>
	        <div className={classes.imageFooter}>
	            <Grid container style={{padding: 10}}>
	                <Grid item xs={12} sm={4} md={3}>
	                    <div style={{height: '100%',textAlign: 'left'}}>
	                      <div className={classes.imageLogoContainer}>
	                          {schoolData.logoImg && <img className={classes.logo} src={ schoolData.logoImg || config.defaultSchoolLogo }/>}
	                      </div>
	                      { isEdit &&
	                        <Button raised dense color="accent" className={classes.logoEditButton}  onClick={() => this.setState({ showBackgroundUpload: true, imageType: "logoImg"})}>
	                        <Edit className={classes.ImageFooterIcon} />
	                        Logo
	                      </Button>
	                      }
	                    </div>
	                </Grid>
	                <Grid item xs={12} sm={8} md={6} >
	                    <Typography type="headline" style={{color:"#fff",marginTop: 8}} component="h3"> {schoolData.name} </Typography>
	                </Grid>
	                <Grid item xs={12} sm={12} md={3}>
	                  {!isEdit && <div className={classes.imageFooterBtnContainer}>

	                <Button onClick={()=> {this.handleCallUs(schoolData)}} className={classes.ImageFooterbutton} raised color="primary">
	                  <Phone className={classes.ImageFooterIcon} />
	                  Call Us
	                </Button>
	                {
	                  schoolData.email && (
	                    <Button href={this.getMailToData(schoolData)} className={classes.ImageFooterbutton} raised color="accent">
	                        <Email className={classes.ImageFooterIcon} />
	                        Email Us
	                    </Button>
	                  )
	                }

	                { /*this.checkClaim(currentUser, schoolId) && (
	                  <Button className={classes.ImageFooterbutton} onClick={this.claimASchool && this.claimASchool.bind(this,currentUser,schoolData)} raised color="accent">
	                    Claim
	                  </Button>
	                  )*/
	                }
	            </div>}
	                </Grid>
	            </Grid>
	            {
	                this.state.showBackgroundUpload && <UploadMedia
	                    schoolId={schoolId}
	                    showCreateMediaModal= {this.state.showBackgroundUpload}
	                    onClose={()=> this.setState({ showBackgroundUpload: false})}
	                    mediaFormData={schoolData}
	                    imageType={this.state.imageType}
	                />
	            }
	        </div>
	    </CardMedia>
	  </Grid>
</Grid>)
	}
}

export default withStyles(styles)(SchoolViewBanner)
