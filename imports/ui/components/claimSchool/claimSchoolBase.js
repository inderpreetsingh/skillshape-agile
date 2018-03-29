import React from "react";
var ReactDOM = require("react-dom");
import {browserHistory} from 'react-router';
import Events from '/imports/util/events';


export default class ClaimSchoolBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filters: {},
            sticky: false,
            filterPanelDialogBox: false,
            tempFilters: {},
            error: null
        };
    }
    handleFixedToggle = state => {
        // console.log("handleFixedToggle", defaultPosition);
        // const stickyPosition = !defaultPosition;
        // console.log(this.state.sticky, defaultPosition);
        // if (this.state.sticky != stickyPosition) {
        //   this.setState({
        //     sticky: stickyPosition
        //   });
        // }
        console.log(status, "status....");
        if (state.status === 2) {
            if (!this.state.sticky) {
                this.setState({
                    sticky: true
                });
            }
        } else if (state.status === 0) {
            this.setState({
                sticky: false
            });
        }
    };


    handleFiltersDialogBoxState = (state) => {
        this.setState({
            filterPanelDialogBox: state
        })
    }

    // This is used to handle listing of a new school for a login user.
    handleListingOfNewSchool = () => {
        let currentUser = Meteor.user();
        if(currentUser) {
            // Start Lodaing
            this.setState({isLoading: true});
            Meteor.call("school.addNewSchool", currentUser, (err, res) => {
                let state = {
                    isLoading:false,
                }

                if(err) {
                    state.error = err.reason || err.message;
                }
                // Redirect to school Edit view
                if(res) {
                    browserHistory.push(res);
                }

                this.setState(state);
            })
        } else {
            // Show Login popup
            Events.trigger("loginAsUser");
        }

    }

    onLocationChange = (location, updateKey1, updateKey2) => {
        let stateObj = {};

        if (updateKey1) {
            stateObj[updateKey1] = {
                ...this.state[updateKey1],
                coords: location.coords,
                locationName: location.fullAddress,
            }
        }

        if (updateKey2) {
            stateObj[updateKey2] = {
                ...this.state[updateKey2],
                coords: location.coords,
                locationName: location.fullAddress
            }
        }

        this.setState(stateObj);
    }

    /*When user empties the location filter then need to update state
    so that no data is available on the basis of location filter*/
    locationInputChanged = (event, updateKey1, updateKey2) => {
        let stateObj = {};

        if (updateKey1) {
            stateObj[updateKey1] = {
                ...this.state[updateKey1],
                coords: null,
                locationName: event.target.value
            }
        }

        if (updateKey2) {
            stateObj[updateKey2] = {
                ...this.state[updateKey2],
                coords: null,
                locationName: event.target.value
            }
        }

        this.setState(stateObj);

    }

    // Filter that works when user starts typing school name on /claimSchool page
    fliterSchoolName = (event, updateKey1, updateKey2) => {
        let stateObj = {};

        if (updateKey1) {
            stateObj[updateKey1] = {
                ...this.state[updateKey1],
                schoolName: event.target.value,
            }
        }

        if (updateKey2) {
            stateObj[updateKey2] = {
                ...this.state[updateKey2],
                schoolName: event.target.value
            }
        }

        this.setState(stateObj);

    }

    // This is used to collect selected skill categories.
    collectSelectedSkillCategories = (text, updateKey1, updateKey2) => {
        let stateObj = {};

        if (updateKey1) {
            stateObj[updateKey1] = {
                ...this.state[updateKey1],
                skillCategoryIds: text.map((ele) => ele._id),
                defaultSkillCategories: text,
            }
        }

        if (updateKey2) {
            stateObj[updateKey2] = {
                ...this.state[updateKey2],
                skillCategoryIds: text.map((ele) => ele._id),
                defaultSkillCategories: text
            }
        }

        this.setState(stateObj);

    }

    collectSelectedSkillSubject = (text) => {
        let oldFilter = {...this.state.tempFilters}
        oldFilter.skillSubjectIds = text.map((ele) => ele._id);
        oldFilter.defaultSkillSubject = text
        this.setState({ tempFilters: oldFilter})
    }

    skillLevelFilter = (text) => {
        let oldFilter = {...this.state.tempFilters}
        oldFilter.experienceLevel = text;
        this.setState({tempFilters:oldFilter})
    }


    filterGender = (event) => {
        let oldFilter = {...this.state.tempFilters};
        oldFilter.gender = event.target.value;
        this.setState({tempFilters:oldFilter})
    }

    filterAge =(event) => {
        let oldFilter = {...this.state.tempFilters};
        oldFilter.age = parseInt(event.target.value);
        this.setState({ tempFilters: oldFilter });
    }

    perClassPriceFilter = (text) => {
        let oldFilter = {...this.state.tempFilters}
        oldFilter._classPrice = text;
        this.setState({ tempFilters: oldFilter })
    }

    pricePerMonthFilter = (text) => {
        let oldFilter = {...this.state.tempFilters}
        oldFilter._monthPrice = text;
        this.setState({ tempFilters: oldFilter })
    }

    applyFilters = () => {
        this.setState({filters: { ...this.state.filters, ...this.state.tempFilters}})
    }

    removeAllFilters = ()=> {
        this.setState({
            filters: {},
            tempFilters: {},
        })
    }
}