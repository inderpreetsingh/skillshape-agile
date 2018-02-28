import React from 'react';
import get from 'lodash/get';
import { createContainer } from 'meteor/react-meteor-data';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';

import SchoolMemberMedia from '/imports/ui/components/schoolMembers/mediaDetails';
import Preloader from '/imports/ui/components/landing/components/Preloader.jsx';

class MediaContent extends React.Component {

	constructor(props) {
        super(props);
        this.state = {
        	schoolList: [],
            myMemberIds: [],
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
	    		let state = {
	                isLoading: false,
	            }
	            if(res) {
	            	state.schoolList = res.schools || [];
                    state.myMemberIds = res.myMemberIds || [];
	            } else if(err) {
	                state.errorText = err.reason || err.message;
	            }
            	this.setState(state)
	    	})
    	}
    }

    render() {
    	const { isLoading, schoolList, myMemberIds } = this.state;
    	const { currentUser } = this.props;
    	console.log("MediaContent state -->>",this.state);
    	return (
    		<div>
    			{this.state.isLoading && <Preloader/>}
    			{
    				isEmpty(schoolList) ? (
                        <Typography type="display2" gutterBottom align="center">
                            Media Data not found!!!
                        </Typography>
                        ) : schoolList.map((school, index)=> {
    					return  <SchoolMemberMedia
    						key={school._id}
	                        schoolData={school}
	                        currentUser={currentUser}
                            schoolMemberDetailsFilters={{schoolId: school._id, activeUserId: currentUser._id}}
                            mediaListfilters={
                                {
                                    '$or': [
                                        { taggedMemberIds: { '$in': myMemberIds} },
                                        { createdBy: currentUser._id }
                                    ]
                                }
                            }
	                    />
    				})
    			}
    		</div>
    	)
    }
}

export default MediaContent