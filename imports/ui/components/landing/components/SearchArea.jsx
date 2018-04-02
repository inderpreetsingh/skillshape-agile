import React, {Component,Fragment} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { browserHistory } from 'react-router';

import SearchBarStyled from './SearchBarStyled.jsx';

import IconInput from './form/IconInput.jsx';
import MySearchBar from './MySearchBar.jsx';

import NearByClassesButton from './buttons/NearByClassesButton';
import PrimaryButton from './buttons/PrimaryButton';
import SecondaryButton from './buttons/SecondaryButton';

import Grade from 'material-ui-icons/Grade';
import Location from 'material-ui-icons/LocationOn';
import SearchIcon from 'material-ui-icons/Search';

import { grey } from 'material-ui/colors';

import * as helpers from './jss/helpers.js';

const SearchAreaPanel = styled.div`
  padding: ${helpers.rhythmInc};
  max-width: 430px;
  margin: auto;
  text-align: center;

   @media screen and (min-width: 0) and (max-width : ${helpers.mobile}px) {
     max-width: 500px;
     overflow-x: hidden;
  }
`;

const TaglineArea = styled.div`

`;

const Tagline = styled.h2`
  font-family : ${helpers.specialFont};
  font-weight: 100;
  color: ${helpers.headingColor};
  font-size:${helpers.baseFontSize*3}px;
  margin: 0;
  text-align:center;
   @media screen and (min-width: 0) and (max-width : ${helpers.mobile}px) {
     font-size:${helpers.baseFontSize*2}px;;
  }
`;

const TaglineText = styled.p`
  font-family : ${helpers.commonFont};
  font-size: ${helpers.baseFontSize}px;
  color: ${helpers.textColor};
  margin: ${helpers.rhythmDiv}px 0;
`;

const In = styled.p`
  ${helpers.flexCenter}
  font-family : ${helpers.specialFont};
  font-weight: 500;
  font-style: italic;
  font-size: ${helpers.baseFontSize}px;
  margin: 0;
  line-height: 1;
  height: ${helpers.rhythmDiv * 6}px;
  background-color: white;
  color: rgba(0,0,0,0.4);
  padding: 0 8px;
  position: relative;
  box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.1), 0px 2px 0px 0px rgba(0, 0, 0, 0.1), 0px 3px 1px -2px rgba(0, 0, 0, 0.05);
`;

const FilterButtonWrapper = styled.div`
  width: 50%;

  @media screen and (max-width : ${helpers.mobile}px) {
    width: 100%;
  }
`;

const SearchInputsSectionWrapper = styled.div`
  ${helpers.flexCenter}
  flex-direction: column;


  @media screen and (max-width : ${helpers.mobile}px) {
    align-items: flex-start;
  }
`;

const InputWrapper = styled.div`
  height: 48px;
`;

const InputsWrapper = styled.div`
  ${helpers.flexCenter}
`;

const MapViewButtonWrapper = styled.div`
  width: 50%;
  margin-left: ${helpers.rhythmDiv}px;

  @media screen and (max-width : ${helpers.mobile}px) {
    margin: 0;
    margin-top: ${helpers.rhythmDiv}px;
    width: 100%;
  }
`;

const ButtonsWrapper = styled.div`
  ${helpers.flexCenter}
  width: 100%;
  margin-top: ${helpers.rhythmDiv}px;

  @media screen and (max-width: ${helpers.mobile}px) {
    flex-direction: column;
  }
`;

const SearchInputsSection = (props) => (
  <SearchInputsSectionWrapper>

    <InputsWrapper>
      <InputWrapper>
        <MySearchBar
          placeholder="Skill Type"
          defaultBorderRadius
          onChange={props.onSkillTypeChange}
          withIcon={false}
          rightAlign
        />
      </InputWrapper>
      <In>in</In>
      <InputWrapper>
        <MySearchBar
          placeholder="Location"
          defaultBorderRadius
          noCloseIcon
          onChange={props.onLocationInputChange}
        />
      </InputWrapper>
   </InputsWrapper>


    <ButtonsWrapper>
      <FilterButtonWrapper>
        <PrimaryButton fullWidth icon iconName="tune" label="Filters" boxShadow noMarginBottom onClick={props.onFiltersButtonClick} />
      </FilterButtonWrapper>

      <MapViewButtonWrapper>
      {props.mapView ?
        <PrimaryButton fullWidth noMarginBottom icon iconName="grid_on" label="List View" boxShadow noMarginBottom onClick={props.onMapViewButtonClick} />
        :
        <PrimaryButton fullWidth noMarginBottom icon iconName="map" label="Map View" boxShadow noMarginBottom onClick={props.onMapViewButtonClick} />}
      </MapViewButtonWrapper>
    </ButtonsWrapper>

  </SearchInputsSectionWrapper>
);

const TaglineWrapper = () => (
  <TaglineArea>
    <Tagline>Find Your Ideal Class</Tagline>
  </TaglineArea>
);

const BottomSectionContent = (props) => (
  <div>
   <TaglineText>SkillShape helps you find and attend <span itemProp="object">classes</span> on your subject of interest, in your location, and at your price</TaglineText>
   <PrimaryButton
    onClick={props.getMyCurrentLocation}
    icon
    boxShadow
    iconName="room"
    label="Browse classes near you"
    itemScope
    itemType="http://schema.org/DiscoverAction"
    />
   <SecondaryButton
    icon
    iconName="domain"
    label="Add your school"
    boxShadow
    itemScope
    itemType="http://schema.org/AddAction"
    onClick={props.handleAddSchool}
    />
  </div>
);

class SearchArea extends Component {
  state = {
    location: '',
    skillType: ''
  }

  handleLocationInputChange = (event) => {
    let value = '';
    if(event) {
      event.preventDefault();
      value = event.target.value
    }
    this.setState({
      location: value
    });

    if(this.props.onLocationInputChange) {
      this.props.onLocationInputChange(value);
    }
  }

  handleSkillTypeChange = (event) => {
    let value = '';
    if(event) {
      event.preventDefault();
      value = event.target.value
    }
    this.setState({
      skillType: value
    });

    if(this.props.onSkillTypeChange) {
      this.props.onSkillTypeChange(value);
    }
  }

  handleAddSchool = () => {
    if(Meteor.userId()) {
      browserHistory.push('/claimSchool');
    } else {
      Events.trigger("registerAsSchool",{userType: "School"})
    }
  }

  render() {
    return (
      <SearchAreaPanel width={this.props.width} textAlign={this.props.textAlign} itemScope itemType="http://schema.org/SearchAction">
        {this.props.topSection ? this.props.topSection : <TaglineWrapper />}
        {this.props.middleSection ? this.props.middleSection :
          (
            <SearchInputsSection
              location={this.state.location}
              skillType={this.state.skillType}
              onLocationInputChange={this.handleLocationInputChange}
              onSkillTypeChange={this.handleSkillTypeChange}
              onFiltersButtonClick={this.props.onFiltersButtonClick}
              onMapViewButtonClick={this.props.onMapViewButtonClick}
              mapView={this.props.mapView}
            />
          )}
        {this.props.bottomSection ? this.props.bottomSection : <BottomSectionContent getMyCurrentLocation={this.props.getMyCurrentLocation} handleAddSchool={this.handleAddSchool}/> }
      </SearchAreaPanel>
    )
  }
}


SearchArea.propTypes = {
    topSection: PropTypes.element,
    middleSection: PropTypes.element,
    middleSectionText: PropTypes.string,
    bottomSection: PropTypes.element,
    onSearch: PropTypes.func,
    onFiltersButtonClick: PropTypes.func,
    onMapViewButtonClick: PropTypes.func,
    mapView: PropTypes.bool,
}

SearchAreaPanel.defaultProps = {
    textAlign: 'center',
}

SearchArea.defaultProps = {
    middleSectionText: 'Or'
}

export default SearchArea;
