import React from 'react';
import { browserHistory } from 'react-router';
import Events from '/imports/util/events';


export default class ClaimSchoolBase extends React.Component {
  constructor(props) {
    super(props);
    const state = {
      filters: { },
      sticky: false,
      filterPanelDialogBox: false,
      showConfirmationModal: false,
      suggestionForm: false,
      tempFilters: {},
      error: null,
    };
    if (this.props.params.schoolName) {
      state.filters.schoolName = this.props.params.schoolName;
    }
    this.state = state;
  }

  handleLoading = (state) => {
    this.setState({
      isLoading: state,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { schoolName } = nextProps.params;
    if (schoolName) {
      this.setState((state) => {
        const { filters } = state;
        filters.schoolName = schoolName;
        this.setState({ filters });
      });
    }
  }

  handleFixedToggle = (state) => {
    // const stickyPosition = !defaultPosition;
    // if (this.state.sticky != stickyPosition) {
    //   this.setState({
    //     sticky: stickyPosition
    //   });
    // }
    if (state.status === 2) {
      if (!this.state.sticky) {
        this.setState({
          sticky: true,
        });
      }
    } else if (state.status === 0) {
      this.setState({
        sticky: false,
      });
    }
  };

  handleSuggestionFormState = state => () => {
    this.setState({
      suggestionForm: state,
    });
  };

  handleGoBackButtonClick = () => {
    this.setState({
      filters: {},
      suggestionForm: false,
    });
  };

  handleFiltersDialogBoxState = (state) => {
    this.setState({
      filterPanelDialogBox: state,
    });
  };

  // This is used to handle listing of a new school for a login user.
  handleListingOfNewSchool = () => {
    const currentUser = Meteor.user();
    const { schoolName } = this.props.params;
    if (currentUser) {
      // Start Lodaing
      this.setState({ isLoading: true });
      Meteor.call('school.addNewSchool', currentUser, schoolName, (err, res) => {
        const state = {
          isLoading: false,
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
      Events.trigger('loginAsUser');
    }
  };

  showConfirmationModal = () => {
    this.setState({ showConfirmationModal: true });
  };

  onLocationChange = (location, updateKey1, updateKey2) => {
    const stateObj = {};

    if (updateKey1) {
      stateObj[updateKey1] = {
        ...this.state[updateKey1],
        coords: location.coords,
        locationName: location.fullAddress,
      };
    }

    if (updateKey2) {
      stateObj[updateKey2] = {
        ...this.state[updateKey2],
        coords: location.coords,
        locationName: location.fullAddress,
      };
    }

    this.setState(stateObj);
  };

  /* When user empties the location filter then need to update state
    so that no data is available on the basis of location filter */
  locationInputChanged = (event, updateKey1, updateKey2) => {
    const stateObj = {};

    if (updateKey1) {
      stateObj[updateKey1] = {
        ...this.state[updateKey1],
        coords: null,
        locationName: event.target.value,
      };
    }

    if (updateKey2) {
      stateObj[updateKey2] = {
        ...this.state[updateKey2],
        coords: null,
        locationName: event.target.value,
      };
    }

    this.setState(stateObj);
  };

  // Filter that works when user starts typing school name on /claimSchool page
  fliterSchoolName = (event, updateKey1, updateKey2) => {
    const stateObj = {};

    if (updateKey1) {
      stateObj[updateKey1] = {
        ...this.state[updateKey1],
        schoolName: event.target.value,
      };
    }

    if (updateKey2) {
      stateObj[updateKey2] = {
        ...this.state[updateKey2],
        schoolName: event.target.value,
      };
    }

    this.setState(stateObj);
  };

  // This is used to collect selected skill categories.
  collectSelectedSkillCategories = (text, updateKey1, updateKey2) => {
    const stateObj = {};

    if (updateKey1) {
      stateObj[updateKey1] = {
        ...this.state[updateKey1],
        skillCategoryIds: text.map(ele => ele._id),
        defaultSkillCategories: text,
      };
    }

    if (updateKey2) {
      stateObj[updateKey2] = {
        ...this.state[updateKey2],
        skillCategoryIds: text.map(ele => ele._id),
        defaultSkillCategories: text,
      };
    }

    this.setState(stateObj);
  };

  collectSelectedSkillSubject = (text) => {
    const oldFilter = { ...this.state.filters };
    oldFilter.skillSubjectIds = text.map(ele => ele._id);
    oldFilter.defaultSkillSubject = text;
    this.setState({ filters: oldFilter });
  };

  skillLevelFilter = (text) => {
    const oldFilter = { ...this.state.filters };
    oldFilter.experienceLevel = text;
    this.setState({ filters: oldFilter });
  };

  filterGender = (event) => {
    const oldFilter = { ...this.state.filters };
    oldFilter.gender = event.target.value;
    this.setState({ filters: oldFilter });
  };

  filterAge = (event) => {
    const oldFilter = { ...this.state.filters };
    oldFilter.age = parseInt(event.target.value);
    this.setState({ filters: oldFilter });
  };

  perClassPriceFilter = (text) => {
    const oldFilter = { ...this.state.filters };
    oldFilter._classPrice = text;
    this.setState({ filters: oldFilter });
  };

  pricePerMonthFilter = (text) => {
    const oldFilter = { ...this.state.filters };
    oldFilter._monthPrice = text;
    this.setState({ filters: oldFilter });
  };

  removeAllFilters = () => {
    this.setState({
      filters: {},
    });
  };
}
