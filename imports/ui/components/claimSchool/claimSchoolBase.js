import React from 'react';
var ReactDOM = require('react-dom');
export default class ClaimSchoolBase extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      filters: {
        schoolName: '',
        typeOfSchool: '',
        address: '',
        website: '',
        phoneNumber: ''
      }
    };
    this.onSearch = this.onSearch.bind(this);
    this.updateState = this.updateState.bind(this)
  }

  updateState = (e) => {
    console.log("updateState called")
    let filters = this.state.filters;
    let name = e.target.name;
    let value = e.target.value;
    filters[name] = value;
    this.setState({filters});
  };

  onSearch = (filterRef) => {
    const schoolName = filterRef.schoolName.value;
    const website = filterRef.website.value;
    const phoneNumber = filterRef.phoneNumber.value;

    this.setState({filters: {
      schoolName,
      website,
      phoneNumber
    }});
    console.log("after clicking onSearch, state is = ", this.state);
  };

}