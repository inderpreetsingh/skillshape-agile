import React from 'react';
import get from 'lodash/get';
import { createContainer } from 'meteor/react-meteor-data';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';

import SchoolMemberDetails from "/imports/api/schoolMemberDetails/fields";
import School from "/imports/api/school/fields";
import SchoolMemberMedia from '/imports/ui/components/schoolMembers/mediaDetails';
import Preloader from '/imports/ui/components/landing/components/Preloader.jsx';

class MediaContent extends React.Component {

	state = {
    }

    render() {
    	// const { isLoading, schoolList, myMemberIds } = this.state;
    	const { currentUser, schoolData, myMemberIds, isLoading } = this.props;
    	console.log("MediaContent props -->>",this.props);
    	return (
    		<div>
    			{isLoading && <Preloader/>}
    			{
    				isEmpty(schoolData) ? (
                        <Typography type="display2" gutterBottom align="center">
                            Media Data not found!!!
                        </Typography>
                        ) : schoolData.map((school, index)=> {
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

export default createContainer(props => {
    // console.log("MediaContent props -->>",props)
    let { currentUser } = props;
    let email = get(currentUser, "emails[0].address");
    let isLoading = true;
    let subscription;
    let schoolData = [];
    let schoolMembersData = [];
    let myMemberIds = [];

    if(email) {
        subscription = Meteor.subscribe("school.getSchoolWithConnectedTagedMedia", { email });
    }

    if(subscription && subscription.ready()) {
        isLoading = false;
        schoolData = School.find().fetch();
        schoolMembersData = SchoolMemberDetails.find({email}).fetch();
        myMemberIds = schoolMembersData.map(data => data._id);
    }

    return {
        ...props,
        schoolData,
        schoolMembersData,
        myMemberIds
    };

}, MediaContent);