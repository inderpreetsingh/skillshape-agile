import React, { Component, Fragment } from "react";
import isEmpty from "lodash/isEmpty";
import styled from "styled-components";

import { emailRegex, withPopUp } from "/imports/util";
import { ContainerLoader } from "/imports/ui/loading/container.js";

import FilterPanel from "/imports/ui/components/landing/components/FilterPanel.jsx";
import NoResultsFound from "/imports/ui/components/landing/components/helpers/NoResultsFound.jsx";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";

const Wrapper = styled.div`
  text-align: center;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const FormSubmitButtonWrapper = styled.div`
  padding: ${helpers.rhythmDiv * 2}px;
`;

const TextWrapper = styled.div`
  font-size: ${helpers.baseFontSize * 1.25}px;
  text-align: left;
  max-width: 900px;
  margin-left: ${helpers.rhythmDiv * 2}px;
`;

const NoResultsFoundContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const FormWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  margin-top: ${helpers.rhythmDiv * 4}px;
  margin-bottom: ${helpers.rhythmDiv * 4}px;
`;

class SuggestionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: this.props.filters || {},
      tempFilters: this.props.tempFilters || {},
      errors: {}
    };

    this.fieldNames = [
      "skillSubjectIds",
      "skillCategoryIds",
      "schoolName",
      "schoolEmail",
      "schoolWebsite",
      "locationName",
      "experienceLevel",
      "gender",
      "age"
    ];
  }

  // shouldComponentUpdate() {
  //   return true;
  // }

  componentDidMount() {
    // console.log("Component is re mounted");
  }

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps, "---------------- udpating filters....");
    this.setState({
      filters: Object.assign({}, nextProps.filters),
      tempFilters: Object.assign({}, nextProps.tempFilters)
    });
  }

  _ifAllFieldsEmpty = data => {
    let allFieldsEmpty = true;
    for (let i = 0; i < this.fieldNames.length; ++i) {
      if (!isEmpty(data[this.fieldNames[i]])) {
        allFieldsEmpty = false;
        return false;
      }
    }

    return allFieldsEmpty;
  };

  handleGiveSuggestion = () => {
    const { popUp } = this.props;
    const {
      experienceLevel,
      locationName,
      schoolName,
      skillCategoryIds,
      skillSubjectIds,
      defaultSkillSubject,
      gender,
      age,
      schoolWebsite,
      schoolEmail,
      _classPrice,
      _monthPrice
    } = this.state.filters;

    // const { schoolWebsite, schoolEmail } = this.state;

    const data = {
      experienceLevel,
      locationName,
      schoolName,
      schoolEmail,
      schoolWebsite,
      skillCategoryIds,
      skillSubjectIds,
      gender,
      age
    };

    if (_monthPrice) {
      data.monthPrice = {
        min: _monthPrice[0],
        max: _monthPrice[1]
      };
    }

    if (_classPrice) {
      data.classPrice = {
        min: _classPrice[0],
        max: _classPrice[1]
      };
    }

    // console.info('data 0----',data);

    if (this._ifAllFieldsEmpty(data)) {
      popUp.appear("alert", {
        title: "Empty Fields",
        content: "Please fill one atleast 1 field for suggestion of school"
      });
    } else if (data.schoolEmail && !emailRegex.email.test(data.schoolEmail)) {
      this.setState({
        ...this.state,
        errors: {
          schoolEmail: "email format not valid"
        }
      });
    } else {
      this.setState({ isLoading: true });
      Meteor.call("schoolSuggestion.addSuggestion", data, (err, res) => {
        this.setState({
          isLoading: false,
          filters: {},
          tempFilters: {},
          errors: {}
        });
        if (err) {
          popUp.appear("alert", { content: err.reason });
        } else {
          popUp.appear("success", {
            content: "Thanks alot for your suggestion",
            onAffirmationButtonClick: this.props.removeAllFilters
          });
        }
      });
    }
  };

  onLocationChange = (location, updateKey1, updateKey2) => {
    let stateObj = {};

    if (updateKey1) {
      stateObj[updateKey1] = {
        ...this.state[updateKey1],
        coords: location.coords,
        locationName: location.fullAddress
      };
    }

    if (updateKey2) {
      stateObj[updateKey2] = {
        ...this.state[updateKey2],
        coords: location.coords,
        locationName: location.fullAddress
      };
    }

    this.setState(stateObj);
  };

  /*When user empties the location filter then need to update state
  so that no data is available on the basis of location filter*/
  locationInputChanged = (event, updateKey1, updateKey2) => {
    let stateObj = {};

    if (updateKey1) {
      stateObj[updateKey1] = {
        ...this.state[updateKey1],
        coords: null,
        locationName: event.target.value
      };
    }

    if (updateKey2) {
      stateObj[updateKey2] = {
        ...this.state[updateKey2],
        coords: null,
        locationName: event.target.value
      };
    }

    this.setState(stateObj);
  };

  // Filter that works when user starts typing school name on /claimSchool page
  fliterSchoolName = (event, updateKey1, updateKey2) => {
    let stateObj = {};

    if (updateKey1) {
      stateObj[updateKey1] = {
        ...this.state[updateKey1],
        schoolName: event.target.value
      };
    }

    if (updateKey2) {
      stateObj[updateKey2] = {
        ...this.state[updateKey2],
        schoolName: event.target.value
      };
    }

    this.setState(stateObj);
  };

  // This is used to collect selected skill categories.
  collectSelectedSkillCategories = (text, updateKey1, updateKey2) => {
    let stateObj = {};

    if (updateKey1) {
      stateObj[updateKey1] = {
        ...this.state[updateKey1],
        skillCategoryIds: text.map(ele => ele._id),
        defaultSkillCategories: text
      };
    }

    if (updateKey2) {
      stateObj[updateKey2] = {
        ...this.state[updateKey2],
        skillCategoryIds: text.map(ele => ele._id),
        defaultSkillCategories: text
      };
    }

    this.setState(stateObj);
  };

  collectSelectedSkillSubject = text => {
    let oldFilter = { ...this.state.filters };
    oldFilter.skillSubjectIds = text.map(ele => ele._id);
    oldFilter.defaultSkillSubject = text;
    this.setState({ filters: oldFilter });
  };

  skillLevelFilter = text => {
    let oldFilter = { ...this.state.filters };
    oldFilter.experienceLevel = text;
    this.setState({ filters: oldFilter });
  };

  filterGender = event => {
    let oldFilter = { ...this.state.filters };
    oldFilter.gender = event.target.value;
    this.setState({ filters: oldFilter });
  };

  filterAge = event => {
    let oldFilter = { ...this.state.filters };
    oldFilter.age = parseInt(event.target.value);
    this.setState({ filters: oldFilter });
  };

  handleSchoolDetails = name => event => {
    let oldFilter = { ...this.state.filters };
    oldFilter[name] = event.target.value;
    this.setState({ filters: oldFilter });
  };

  perClassPriceFilter = text => {
    let oldFilter = { ...this.state.filters };
    oldFilter._classPrice = text;
    this.setState({ filters: oldFilter });
  };

  pricePerMonthFilter = text => {
    let oldFilter = { ...this.state.filters };
    oldFilter._monthPrice = text;
    this.setState({ filters: oldFilter });
  };

  removeAllFilters = () => {
    this.setState({
      filters: {},
      tempFilters: {},
      errors: {}
    });
  };

  render() {
    console.log(
      "this.state.filters",
      this.state.filters,
      this.props.filters,
      "suggestion form rendering..."
    );
    return (
      <Fragment>
        {this.state.isLoading && <ContainerLoader />}
        <Wrapper>
          <NoResultsFoundContainer>
            <NoResultsFound
              title="No Matching Schools Found."
              tagline1="If you know of a school that should be here, please fill in the fields you know."
              tagline2="We will look for them and ask them to join."
            />
          </NoResultsFoundContainer>

          <FormWrapper>
            <FilterPanel
              filtersInDialogBox
              filtersForSuggestion
              filters={this.state.filters}
              tempFilters={this.state.tempFilters}
              errors={this.state.errors}
              onLocationChange={this.onLocationChange}
              onSchoolWebsiteChange={this.handleSchoolDetails("schoolWebsite")}
              onSchoolEmailChange={this.handleSchoolDetails("schoolEmail")}
              locationInputChanged={this.locationInputChanged}
              fliterSchoolName={this.fliterSchoolName}
              filterAge={this.filterAge}
              filterGender={this.filterGender}
              skillLevelFilter={this.skillLevelFilter}
              perClassPriceFilter={this.perClassPriceFilter}
              pricePerMonthFilter={this.pricePerMonthFilter}
              collectSelectedSkillCategories={
                this.collectSelectedSkillCategories
              }
              collectSelectedSkillSubject={this.collectSelectedSkillSubject}
              onGiveSuggestion={this.handleGiveSuggestion}
            />
          </FormWrapper>
        </Wrapper>
      </Fragment>
    );
  }
}

export default withPopUp(SuggestionForm);
