import React from "react";
var ReactDOM = require("react-dom");
import isEmpty from 'lodash/isEmpty';
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
            error: null,
            showConfirmationModal:false
        };
        this.fieldNames = ['skillSubjectIds','skillCategoryIds','schoolName','locationName','experienceLevel','gender','age'];
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

    _ifAllFieldsEmpty = (data) => {
      let allFieldsEmpty = true;
      for(let i = 0; i < this.fieldNames.length; ++i) {
        if(!isEmpty(data[this.fieldNames[i]])) {
          allFieldsEmpty = false;
          return false;
        }
      }

      return allFieldsEmpty;
    }

    handleGiveSuggestion = () => {
      console.log(this.state,"this.state");
      const { toastr } = this.props;
      const {experienceLevel,
        locationName,
        schoolName,
        skillCategoryIds,
        skillSubjectIds,
        defaultSkillSubject,
        gender,
        age,
        _classPrice,
        _monthPrice} = this.state.filters;

        const data = {
          experienceLevel,
          locationName,
          schoolName,
          skillCategoryIds,
          skillSubjectIds,
          gender,
          age
        }

        if(_monthPrice) {
          data.monthPrice = {
            min: _monthPrice[0],
            max: _monthPrice[1]
          }
        }

        if(_classPrice) {
          data.classPrice = {
            min: _classPrice[0],
            max: _classPrice[1]
          }
        }

        console.log(data,this.state.filters,"data................")

        console.log(this._ifAllFieldsEmpty(data));
        if(this._ifAllFieldsEmpty(data)) {
          toastr.error(`Please fill one atleast 1 field for suggestion of school`,"Error");
        }else {
          this.setState({isLoading: true});
          Meteor.call('schoolSuggestion.addSuggestion',data,(err,res) => {
            this.setState({isLoading: false});
            if(err) {
              toastr.error(err.reason,"Error");
            }else {
              toastr.success("Thanks alot for your suggestion","success");
              this.handleSchoolSuggestionDialogState(false)(); // closing the modal.
            }
          });
        }

    }

    handleFiltersDialogBoxState = (state) => {
        this.setState({
            filterPanelDialogBox: state
        })
    }

    handleSchoolSuggestionDialogState = (state) => () => {
      this.setState({
        schoolSuggestionDialogBox: state
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

    showConfirmationModal = () => {
        this.setState({showConfirmationModal:true});
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
        let oldFilter = {...this.state.filters}
        oldFilter.skillSubjectIds = text.map((ele) => ele._id);
        oldFilter.defaultSkillSubject = text
        this.setState({ filters: oldFilter})
    }

    skillLevelFilter = (text) => {
        let oldFilter = {...this.state.filters}
        oldFilter.experienceLevel = text;
        this.setState({filters:oldFilter})
    }


    filterGender = (event) => {
        let oldFilter = {...this.state.filters};
        oldFilter.gender = event.target.value;
        this.setState({filters:oldFilter})
    }

    filterAge =(event) => {
        let oldFilter = {...this.state.filters};
        oldFilter.age = parseInt(event.target.value);
        this.setState({ filters: oldFilter });
    }

    perClassPriceFilter = (text) => {
        let oldFilter = {...this.state.filters}
        oldFilter._classPrice = text;
        this.setState({ filters: oldFilter })
    }

    pricePerMonthFilter = (text) => {
        let oldFilter = {...this.state.filters}
        oldFilter._monthPrice = text;
        this.setState({ filters: oldFilter })
    }

    removeAllFilters = ()=> {
        this.setState({
            filters: {},
        })
    }
}
