import React, { Fragment, Component } from 'react';
import styled from 'styled-components';
import { browserHistory } from 'react-router';
import { getUserFullName } from '/imports/util';

import BrandBar from '/imports/ui/components/landing/components/BrandBar.jsx';
import Footer from "/imports/ui/components/landing/components/footer/index.jsx";
import Header from './header/index.jsx';
import { SchoolsList } from './schools/';

import { ContainerLoader } from "/imports/ui/loading/container.js";
import { withPopUp } from '/imports/util';
import { SubHeading, Text } from '/imports/ui/components/landing/components/jss/sharedStyledComponents.js';
import { rhythmDiv, primaryColor } from '/imports/ui/components/landing/components/jss/helpers.js';

const BodyWrapper = styled.div`
    padding: ${rhythmDiv * 4}px ${rhythmDiv * 2}px;
`;

const Content = SubHeading.extend`
    text-align: center;
    margin-bottom: ${rhythmDiv * 4}px;
`;

const MyLink = Text.withComponent('a').extend`
    font-size: inherit;
    color: ${primaryColor};
    cursor: pointer;
    transition: color .1s linear;
    
    &:hover {
        color: ${primaryColor};
    }
`;

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
            <Fragment>
                <BrandBar
                    positionStatic
                    currentUser={currentUser}
                    isUserSubsReady={isUserSubsReady}
                />
                <Header
                    userImage={currentUser && currentUser.profile.pic}
                    userName={getUserFullName(currentUser)} />
                <BodyWrapper>
                    <Content>If you want to add a new school, <MyLink onClick={this.handleCreateNewSchool}>click here.</MyLink></Content>
                    <SchoolsList schools={mySchools} />
                </BodyWrapper>
                <Footer />
            </Fragment>
        )
    }
}

export default withPopUp(MyDashBoard);