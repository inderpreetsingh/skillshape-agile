import React, { Component,lazy,Suspense } from 'react';
import { browserHistory } from 'react-router';
import { get } from 'lodash';
import { Loading } from '/imports/ui/loading';
import { withPopUp, getUserFullName } from '/imports/util';
const DashBoardRender = lazy(()=>import('./DashboardRender'));
import {OnBoardingDialogBox} from '/imports/ui/components/landing/components/dialogs';

class MyDashBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mySchools: null
        }
    }

   

    handleEditProfileClick = (e) => {
        e.preventDefault();
        const currentUserId = Meteor.user()._id;
        browserHistory.push(`/profile/${currentUserId}`);
    }
    handleCreateNewSchoolClick = () => {
        this.setState({onBoardingDialogBox:true})
    }
    componentDidMount() {
        if (Meteor.userId()) {
            Meteor.call("school.getMySchool", null, false, (error, result) => {
                if (result) {
                    {
                        const mySchools = result.map((school, index) => {
                            return {
                                ...school,
                                link: `/schools/${school.slug}`,
                                iconName: "school",
                                schoolEditLink: `/SchoolAdmin/${school._id}/edit`,
                                superAdmin: school && school.superAdmin,
                                admins: school.admins
                            };
                        });
                        this.setState(state => {
                            return {
                                ...state,
                                mySchools
                            }
                        });
                    }
                }
            });
        }
    }



    render() {
        const { mySchools, isBusy ,onBoardingDialogBox} = this.state;
        const {
            currentUser,
            isUserSubsReady
        } = this.props;
        return (
            <Suspense fallback={<Loading/>}>
            {onBoardingDialogBox && <OnBoardingDialogBox
            open={onBoardingDialogBox}
            onModalClose={() => { this.setState({ onBoardingDialogBox: false }) }}
          />}
            <DashBoardRender
                headerProps={{
                    currentUser: currentUser,
                    userImage: currentUser && get(currentUser.profile, "pic", get(currentUser.profile, 'medium', get(currentUser.profile, 'low', ''))),
                    userName: getUserFullName(currentUser),
                    onEditProfileClick: this.handleEditProfileClick
                }}
                bodyProps={{
                    schools: mySchools
                }}
                currentUser={currentUser}
                isUserSubsReady={isUserSubsReady}
                onCreateNewSchoolClick={this.handleCreateNewSchoolClick}
            />
            </Suspense>
        )
    }
}

export default withPopUp(MyDashBoard);