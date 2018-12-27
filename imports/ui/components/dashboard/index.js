import React, { Fragment, Component } from 'react';

import { getUserFullName } from '/imports/util';

import Header from './header/index.jsx';
import Body from './body/index.jsx';

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
                <Body
                    schoolsListProps={{
                        mySchools
                    }}
                />
            </Fragment>
        )
    }
}

export default MyDashBoard;