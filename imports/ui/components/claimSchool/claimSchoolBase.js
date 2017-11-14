import React from 'react';
var ReactDOM = require('react-dom');
export default class ClaimSchoolBase extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      filters: {}
    }
  }

  componentDidMount() {
    $(window).off('scroll');
    $('.main-panel').off('scroll');
    $('#UserMainPanel').off('scroll');
    $(window).scroll(this.fixedHeader);
    $('#UserMainPanel').scroll(this.fixedHeader)
    $('.main-panel').scroll(this.fixedHeader);
  }

  fixedHeader = () => {
    if (window.innerWidth>767){
      if ($("#UserMainPanel").scrollTop() >= 200) {
        $('#scr_affix').addClass('fixed-header');
        if($('.sidebar').length > 0)
          $('#scr_affix').css({'position': 'relative', 'top': ($("#UserMainPanel").scrollTop() - 100)+'px'});
      } else {
        $('#scr_affix').removeClass('fixed-header');
        $('#scr_affix').attr('style','')
      }
    }
  }

  resetFilter = (filterRef) => {
    filterRef.schoolName.value = "";
    filterRef.website.value = "";
    filterRef.phoneNumber.value = "";
    filterRef.claimcoords = "";
    filterRef.address.value = "";
    filterRef.typeOfSkill.value = "Any";
    this.setState({
      filters: {}
    });
  }

  onSearch = (filterRef) => {
    let cskill = filterRef.typeOfSkill.value;
    if(filterRef.typeOfSkill.value == "Type Of Skills")
      cskill = ""
    this.setState({
      filters: {
        phone : filterRef.phoneNumber.value,
        website: filterRef.website.value,
        name: filterRef.schoolName.value,
        coords: filterRef.claimcoords,
        cskill: cskill,
      }
    });
  }

}