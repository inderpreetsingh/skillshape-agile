import React, { Component,lazy,Suspense } from 'react';
import { browserHistory } from 'react-router';
import { get } from 'lodash';

import { withPopUp, getUserFullName } from '/imports/util';
import { ContainerLoader } from "/imports/ui/loading/container";
const DashBoardRender = lazy(()=>import('./DashboardRender'));

class MyDashBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mySchools: null
        }
    }

    _createNewSchool = () => {
        const { currentUser } = this.props;
        if (currentUser) {
            // Start Lodaing
            this.setState({ isLoading: true });
            Meteor.call("school.addNewSchool", currentUser, (err, res) => {
                let state = {
                    isLoading: false
                };

                if (err) {
                    state.error = err.reason || err.message;
                }
                // Redirect to school Edit view
                if (res) {
                    browserHistory.push(res);
                }

                this.setState(state);
            });
        } else {
            // Show Login popup
            Events.trigger("loginAsUser");
        }
    }

    handleEditProfileClick = (e) => {
        e.preventDefault();
        const currentUserId = Meteor.user()._id;
        browserHistory.push(`/profile/${currentUserId}`);
    }


    handleCreateNewSchoolClick = () => {
        const { popUp } = this.props;
        popUp.appear('inform', {
            title: 'Confirm',
            content: 'This will create a new school listing. Do you wanna continue ?',
            defaultButtons: true,
            onAffirmationButtonClick: this._createNewSchool,
        }, true)
    };

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
        const { mySchools, isBusy } = this.state;
        const {
            currentUser,
            isUserSubsReady
        } = this.props;
        return (
            <Suspense fallback={<ContainerLoader/>}>
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