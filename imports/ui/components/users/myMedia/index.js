import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Card, { CardHeader, CardMedia, CardContent, CardActions } from 'material-ui/Card';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import IconButton from 'material-ui/IconButton';
import Collapse from 'material-ui/transitions/Collapse';
import classnames from 'classnames';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormControlLabel, FormControl } from 'material-ui/Form';
import Button from 'material-ui/Button';

import Preloader from '/imports/ui/components/landing/components/Preloader.jsx';
import { withStyles, toastrModal } from '/imports/util';
import { ContainerLoader } from '/imports/ui/loading/container';
import MediaContent from './MediaContent';

const style = theme => {
	return {
		card: {
			margin: 5,
		},
	}
}

const SaveBtnWrapper = styled.div`
    margin: 10px;
`;

class MyMedia extends React.Component {

	constructor(props) {
    	super(props);
    	this.state = this.initializeState();
  	}

  	initializeState = () => {
  		let state = {
    		mediaExpanded: true,
    		isBusy: false,
    		mediaDefaultValue: "",
    	};
    	const mediaAccessType = get(this.props, "currentUser.media_access_permission");
  		if(mediaAccessType) {
  			state.mediaDefaultValue = (mediaAccessType["public"] &&  "public") || (mediaAccessType["member"] &&  "member") || "";
  		}
  		return state;
  	}

  	componentWillReceiveProps(nextProps) {
		const mediaAccessType = get(nextProps, "currentUser.media_access_permission");
  		if(mediaAccessType) {
  			this.setState({
  				mediaDefaultValue: (mediaAccessType["public"] &&  "public") || (mediaAccessType["member"] &&  "member") || "",
  			})
  		}
  	}

  	handleExpandClick = (field) => {
    	this.setState({ [field]: !this.state[field] });
  	}

  	validateUser = () => {
    	const { currentUser } = this.props;
    	const paramId = get(this.props, "params.id", null);
    	if(currentUser && currentUser._id === paramId)
    		return true;
    	return false;
    }

    handleMediaSettingChange = (event, type) => {
    	console.log("handleMediaSettingChange -->>",event.target.value, type)
    	this.setState({mediaDefaultValue: type})
    }

    submitMediaDetails = (event)=> {
    	event.preventDefault();
    	const { currentUser, toastr } = this.props;
    	console.log("submitMediaDetails state -->>",this.state);
    	if(currentUser) {

    		if(this.state.mediaDefaultValue) {
    			this.setState({ isBusy: true})
    			let userObj = {
    				media_access_permission:{
    					[this.state.mediaDefaultValue]: true
    				}
    			}
		    	Meteor.call("user.editUser", { doc: userObj , docId: currentUser._id}, (error, result) => {
			      let state = {isBusy: false}
			      if(error) {
			      	state.errorText = error.reason || error.message;
			      	toastr.error(state.errorText,"Error");
			      }
			      if(result) {
			      	toastr.success("Successfully edit your media settings.","Success");
			      }
			      this.setState(state);
			    });
    		}

    	} else {
    		toastr.error("Access Denied!!!","Error");
    	}
    }

  	render() {
	  	console.log("MyMedia props --->>", this.props);
	  	console.log("MyMedia state --->>", this.state);
	  	let { currentUser, classes, isUserSubsReady } = this.props;

	  	if(!isUserSubsReady)
			return <Preloader/>

	    if(!currentUser) {
	        return  <Typography type="display2" gutterBottom align="center">
	            User not found!!!
	        </Typography>
	    }

	    if(this.validateUser()) {
    		return (
    			<Grid container>
    				{ this.state.isBusy && <ContainerLoader/>}
    				<Grid item xs={12} sm={12}>
                    	<Card className={classes.card}>
	                        <CardHeader
	                            title="Media Settings"
	                            action={
	                                <IconButton
	                                  className={classnames(classes.expand, {
	                                    [classes.expandOpen]: this.state.mediaExpanded,
	                                  })}
	                                  onClick={this.handleExpandClick.bind(this, "mediaExpanded")}
	                                  aria-expanded={this.state.mediaExpanded}
	                                  aria-label="Show more"
	                                >
	                                  <ExpandMoreIcon />
	                                </IconButton>
	                            }
	                        />
	                        <Collapse in={this.state.mediaExpanded} timeout="auto" unmountOnExit>
	                            <CardContent>
	                                <Typography type="headline">Media Display Setting Defaults</Typography>
	                                <Typography type="subheading">These defaults can be set differently for specific media of you.</Typography>
	                                <Typography type="subheading">Unless progress or a video is public, it cannot be shared to Social Media.</Typography>
	                            	<br></br>
	                                <Typography type="subheading">As a default setting for videos and pictures for you:</Typography>
	                            	<br></br>
	                            	<form onSubmit={this.submitMediaDetails}>
		                            	<FormControl component="fieldset" required >
						                    <RadioGroup
						                        aria-label="mediaSetting"
						                        value={this.state.mediaDefaultValue}
						                        name="mediaSetting"
						                        onChange={this.handleMediaSettingChange}
						                        defaultSelected="both"
						                    >
						                        <FormControlLabel value="public" control={<Radio />} label="Make media public so you can share them on social media." />
						                        <FormControlLabel value="member" control={<Radio />} label="Make media from a school only available to members of the school that posted it." />
						                    </RadioGroup>
						                </FormControl>
						                <br></br>
						                <SaveBtnWrapper>
							                <Button type="submit" color="accent" raised dense>
			                                    Save
			                                </Button>
						                </SaveBtnWrapper>
	                            	</form>
	                            </CardContent>
	                        </Collapse>
                        </Card>
                        <Card className={classes.card}>
                        	<CardContent>
                        		<MediaContent currentUser={currentUser}/>
                        	</CardContent>
                        </Card>
    				</Grid>
    			</Grid>
    		)
    	} else {
    		return  <Typography type="display2" gutterBottom align="center">
            	Access Denied!!!
        	</Typography>
    	}
    }
}

MyMedia.propTypes = {
	currentUser: PropTypes.object,
	classes: PropTypes.object,
	isUserSubsReady: PropTypes.bool,
}

export default withStyles(style)(toastrModal(MyMedia));