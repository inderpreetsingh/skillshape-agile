import React, { Fragment, Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router';
import { getUserFullName } from '/imports/util';

import Header from './header/index.jsx';
import { SchoolsList } from './schools/';

import { SubHeading } from '/imports/ui/components/landing/components/jss/sharedStyledComponents.js';
import { rhythmDiv, primaryColor } from '/imports/ui/components/landing/components/jss/helpers.js';

const BodyWrapper = styled.div`
    padding: ${rhythmDiv * 4}px ${rhythmDiv * 2}px;
`;

const Content = SubHeading.extend`
    text-align: center;
    margin-bottom: ${rhythmDiv * 2}px;
`;

const MyLink = styled(Link)`
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
        const { mySchools } = this.state;
        return (
            <Fragment>
                <Header userName={getUserFullName(Meteor.user())} />
                <BodyWrapper>
                    <Content>If you want to add a new school, <MyLink>click here</MyLink> </Content>
                    <SchoolsList
                        schools={mySchools}
                    />
                </BodyWrapper>
            </Fragment>
        )
    }
}

export default MyDashBoard;