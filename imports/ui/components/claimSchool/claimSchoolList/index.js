import React from "react";
import {createContainer} from 'meteor/react-meteor-data';
import ClaimSchoolListRender from "./claimSchoolListRender";
import { Session } from 'meteor/session';
import {toastrModal, withSubscriptionAndPagination } from '/imports/util';
import { withStyles } from 'material-ui/styles';

import School from "/imports/api/school/fields";
import {danger,rhythmDiv} from '/imports/ui/components/landing/components/jss/helpers.js';

const styles = {
  buttonStyles: {
    fontWeight: 600,
    borderRadius: 10,
    backgroundColor: danger,
    color: 'white',
    marginRight: rhythmDiv * 2
  }
}

class ClaimSchoolList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      filters: {},
      tempFilters: {}
    }
  }

  componentWillUnmount() {
    Session.set("pagesToload",1)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      filters: nextProps.filters,
      tempFilters: nextProps.tempFilters
    })
  }

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

  render() {
    return ClaimSchoolListRender.call(this, this.props, this.state)
  }
}

export default withSubscriptionAndPagination(withStyles(styles)(toastrModal(ClaimSchoolList)), {collection: School, subscriptionName: "ClaimSchoolFilter", recordLimit: 10});


// export default createContainer(props => {
//   let pagesToload = Session.get("pagesToload") || 1;
//   let subscription = Meteor.subscribe("ClaimSchoolFilter", { limit: pagesToload * 10, ...props.filters });
//   let hasMore = true;
//   let schoolListCursor = School.find();
//   let schoolList = schoolListCursor.fetch();
//   const loadMore = () => {
//     if (subscription.ready() && schoolListCursor.count() + 10 > pagesToload * 10) {
//       Session.set("pagesToload", pagesToload + 1);
//     }
//   }
//   if (subscription.ready()) {
//     if (schoolListCursor.count() + 10 < pagesToload * 10) {
//       hasMore = false;
//     }
//   }

//   return {...props, schoolList, hasMore, loadMore, loadMoreEnabled: subscription.ready()};
// }, ClaimSchoolList );
