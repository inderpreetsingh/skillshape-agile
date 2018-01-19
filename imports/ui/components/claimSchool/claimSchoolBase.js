import React from "react";
var ReactDOM = require("react-dom");
export default class ClaimSchoolBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: {},
      sticky: false
    };
  }
  handleFixedToggle = defaultPosition => {
    console.log("handleFixedToggle", defaultPosition);
    const stickyPosition = !defaultPosition;
    console.log(this.state.sticky, defaultPosition);
    if (this.state.sticky != stickyPosition) {
      this.setState({
        sticky: stickyPosition
      });
    }
  };

  onLocationChange = location => {
    console.log("location", location);
    let oldFilter = this.state.filters;
    // Append location in filters.
    oldFilter.coords = location.coords;
    console.log("oldFilter==>", oldFilter);
    this.setState({
      filters: oldFilter
    });
  };
  /*When user empties the location filter then need to update state
  so that no data is available on the basis of location filter*/
  locationInputChanged = event => {
    console.log("event.target.value",event.target.value)
    if (!event.target.value) {
      let oldFilter = this.state.filters;
      oldFilter.coords = null;
      this.setState({
        filters:oldFilter
      })
    }
  };

  // Filter that works when user starts typing school name
  handleSchoolNameChange = event => {
    console.log("schoolName change", event.target.value);
    let oldFilter = this.state.filters;
    // Append School name in filters.
    oldFilter.schoolName = event.target.value;
    console.log("oldFilter==>", oldFilter);
    this.setState({
      filters: oldFilter
    });
  };

  componentDidMount() {
    $(window).off("scroll");
    $(".main-panel").off("scroll");
    $("#UserMainPanel").off("scroll");
    $(window).scroll(this.fixedHeader);
    $("#UserMainPanel").scroll(this.fixedHeader);
    $(".main-panel").scroll(this.fixedHeader);
  }

  fixedHeader = () => {
    if (window.innerWidth > 767) {
      if ($("#UserMainPanel").scrollTop() >= 200) {
        $("#scr_affix").addClass("fixed-header");
        if ($(".sidebar").length > 0)
          $("#scr_affix").css({
            position: "relative",
            top: $("#UserMainPanel").scrollTop() - 100 + "px"
          });
      } else {
        $("#scr_affix").removeClass("fixed-header");
        $("#scr_affix").attr("style", "");
      }
    }
  };

  resetFilter = filterRef => {
    filterRef.schoolName.value = "";
    filterRef.website.value = "";
    filterRef.phoneNumber.value = "";
    filterRef.claimcoords = "";
    filterRef.address.value = "";
    filterRef.typeOfSkill.value = "Any";
    this.setState({
      filters: {}
    });
  };

  handleSkillCategoryChange = filterRef => {
    console.log("onSearch", filterRef);
    let skillCategoryName = filterRef.map(skillCat => {
      return skillCat._id;
    });
    console.log("skillCtaegoryName", skillCategoryName);
    let oldFilter = this.state.filters;
    // This is skill category filter.
    oldFilter.skillCat = skillCategoryName;
    console.log("oldFilter==>", oldFilter);
    this.setState({
      filters: oldFilter
    });
  };
}
