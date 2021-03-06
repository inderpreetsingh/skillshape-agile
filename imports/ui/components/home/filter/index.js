import React from "react";
import { createContainer } from "meteor/react-meteor-data";
import { browserHistory } from "react-router";
import SkillClassFilterRender from "./skillClassFilterRender";

class SkillClassFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classPrice: ["0.0", "1000"],
      monthPrice: ["0.0", "1000"],
      SLocation: null,
      skillCategory: null,
      skillSubject: null
    };
  }

  componentDidMount() {
    this.initializeSlider();
    setTimeout(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.location);
      autocomplete.addListener("place_changed", () => {
        let place = autocomplete.getPlace();
        let coords = [];
        coords[0] = place.geometry["location"] && place.geometry["location"].lat();
        coords[1] = place.geometry["location"] && place.geometry["location"].lng();
        
        this.coords = coords;
        this.setState({ SLocation: place.formatted_address });
        this.props.onSearch(this);
      });
    }, 4000);
  }

  componentWillReceiveProps(props) {
    if (props.currentAddress && props.filters.coords && !this.state.SLocation) {
      this.coords = props.filters.coords;
      this.setState({ SLocation: props.currentAddress });
    }
  }

  initializeSlider = () => {
    let self = this;
    const rangeClass = document.getElementById("sliderPriceClass");
    const rangeMonth = document.getElementById("sliderPriceMonth");
    // noUiSlider.create(rangeClass,{
    //   start: [0, 1000],
    //   connect: true,
    //   range: {
    //       'min': 0,
    //       'max': 1000
    //   }
    // }).on('slide', function(){
    //   let value = this.get();
    //   self._classPrice = value;
    //   self.setState({ classPrice : value})
    //   self.props.onSearch(self)
    // });
    // noUiSlider.create(rangeMonth,{
    //   start: [0, 1000],
    //   connect: true,
    //   range: {
    //     'min': 0,
    //     'max': 1000
    //   }
    // }).on('slide', function(){
    //   let value = this.get();
    //   self._monthPrice = value
    //   self.setState({ monthPrice : value})
    //   self.props.onSearch(self)
    // });
  };

  autocompleteOnChange = () => {
    this.skillCategory = this.refs[
      "skillCategoryId"
    ].getSelectedAutoCompleteValue();
    this.skillSubject = this.refs["skillCategoryId"].getAutoSelectValue();
    if (this.skillCategory) {
      this.props.onSearch(this);
    }
  };

  render() {
    return SkillClassFilterRender.call(this, this.props, this.state);
  }
}

export default createContainer(props => {
  Meteor.subscribe("SkillType");
  const skillType = SkillType.find({}).fetch();
  return { ...props, skillType };
}, SkillClassFilter);
