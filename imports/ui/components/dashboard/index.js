import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import { withPopUp, getUserFullName } from '/imports/util';

import DashBoardRender from './DashboardRender';

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

    handleCreateNewSchool = () => {
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
        if (isBusy) {
            return <ContainerLoader />
        }
        return (
            <DashBoardRender
                currentUser={currentUser}
                isUserSubsReady={isUserSubsReady}
                userImage={currentUser && currentUser.profile.pic}
                userName={getUserFullName(currentUser)}
                schools={mySchools}
                onCreateNewSchoolClick={this.handleCreateNewSchool}
            />
        )
    }
}

export default withPopUp(MyDashBoard);