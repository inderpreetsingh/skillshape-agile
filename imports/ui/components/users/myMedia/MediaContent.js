import React from 'react';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

import SchoolMemberMedia from '/imports/ui/components/schoolMembers/mediaDetails';
import Preloader from '/imports/ui/components/landing/components/Preloader.jsx';

class MediaContent extends React.Component {

	constructor(props) {
        super(props);
        this.state = {
        	schoolList: [],
        }
    }

    componentWillMount() {
    	this.getSchoolWithConnectedTagedMedia()
    }

    getSchoolWithConnectedTagedMedia = () => {
    	let email = get(this.props, "currentUser.emails[0].address")
    	if(email) {
	    	this.setState({isLoading: true});
	    	Meteor.call("school.getSchoolWithConnectedTagedMedia", {email}, (err, res) => {
	    		console.log("Call res -->>",err,res)
	    		let state = {
	                isLoading: false,
	            }
	            if(res) {
	            	state.schoolList = res;
	            } else if(err) {
	                state.errorText = err.reason || err.message;
	            }
            	this.setState(state)
	    	})
    	}
    }

    render() {
    	const { isLoading, schoolList } = this.state;
    	const { currentUser } = this.props;
    	console.log("MediaContent state -->>",this.state);
    	return (
    		<div>
    			{this.state.isLoading && <Preloader/>}
    			{
    				!isEmpty(schoolList) && schoolList.map((school, index)=> {
    					return  <SchoolMemberMedia
    						key={school._id}
	                        schoolData={school}
	                        currentUser={currentUser}
	                    />
    				})
    			}
    		</div>
    	)
    }
}

export default MediaContent