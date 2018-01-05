import React,{Fragment} from 'react';
import Grid from 'material-ui/Grid';
import Card, {CardMedia} from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Edit from 'material-ui-icons/Edit';
import Email from 'material-ui-icons/Email';
import Phone from 'material-ui-icons/Phone';
import { Link } from 'react-router';

import UploadMedia from './uploadMedia';
import config from '/imports/config';
import styles from "./style";
import { withStyles } from "/imports/util";

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

	render(){
		const {
		    classes,
		    schoolData,
		    schoolId,
		    currentUser,
		    isEdit
	  	} = this.props;
	  	const checkUserAccess = checkMyAccess({user: currentUser,schoolId});
		return(
			<Grid container className={classes.schoolHeaderContainer}>
	            <Grid item xs={12}  style={{paddingTop: 0}}>

	                    <CardMedia  className={classes.cardMedia} >
	                        {schoolData.mainImage && <img style={{maxHeight: 320, maxWidth:'100%', marginBottom: 64 }} src={ schoolData.mainImage || config.defaultSchoolImage } />}
	                        <div className={classes.imageHeader}>
	                        	{isEdit &&
	                        		<Button raised dense color="accent" className={classes.bgEditButton1}  onClick={() => this.setState({ showBackgroundUpload: true, imageType: "mainImage"})}>
					                              <Edit className={classes.ImageFooterIcon} />
					                              Background
					                </Button>
	                        		}
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
					                       {
					                        !checkUserAccess &&
					                          <Fragment>
					                            <Button className={classes.ImageFooterbutton} raised color="accent">
					                              <Phone className={classes.ImageFooterIcon} />
					                              Call Us
					                            </Button>
					                            <Button className={classes.ImageFooterbutton} raised color="accent">
					                              <Email className={classes.ImageFooterIcon} />
					                              Email Us
					                            </Button>
					                          </Fragment>
					                        }
					                        {
					                          checkUserAccess && (
					                            <Link className={classes.ImageFooterbutton}  to={`/SchoolAdmin/${schoolData._id}/edit`}>
					                              <Button raised color="accent">
					                                Edit
					                              </Button>
					                            </Link>
					                          )
					                        }
					                        { this.checkClaim(currentUser, schoolId) && (
					                          <Button className={classes.ImageFooterbutton} onClick={this.claimASchool && this.claimASchool.bind(this,currentUser,schoolData)} raised color="accent">
					                            Claim
					                          </Button>
					                          )
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
	        </Grid>
		)
	}
}

export default withStyles(styles)(SchoolViewBanner)