import React, {Component,Fragment} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import SearchBarStyled from './SearchBarStyled.jsx';

import IconInput from './form/IconInput.jsx';
import MySearchBar from './MySearchBar.jsx';

import NearByClassesButton from './buttons/NearByClassesButton';
import PrimaryButton from './buttons/PrimaryButton';
import SecondaryButton from './buttons/SecondaryButton';

import Grade from 'material-ui-icons/Grade';
import Location from 'material-ui-icons/LocationOn';
import { grey } from 'material-ui/colors';

import * as helpers from './jss/helpers.js';

const SearchAreaPanel = styled.div`
  padding: ${helpers.rhythmInc};
  max-width: 430px;
  margin: auto;
  text-align: center;

   @media screen and (min-width: 0) and (max-width : ${helpers.mobile}px) {
     max-width:300px;
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
  font-family : ${helpers.commonFont};
  font-weight: 100;
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
  width: 100px;
`;

const SearchInputsSectionWrapper = styled.div`
  ${helpers.flexCenter}
`;

const InputWrapper = styled.div`
  height: 48px;
`;


const SearchInputsSection = (props) => (
<SearchInputsSectionWrapper>
  <InputWrapper>
    <MySearchBar
      placeholder="Skill Type"
      defaultBorderRadius
      onChange={props.onSkillTypeChange}
      withIcon={false}
    />
  </InputWrapper>
  <In>in</In>
  <InputWrapper>
    <MySearchBar
      placeholder="Location"
      defaultBorderRadius
      onChange={props.onLocationInputChange}
    />
  </InputWrapper>
 <FilterButtonWrapper>
   <PrimaryButton
   label="Filters"
   icon
   iconName="tune"
   boxShadow
   noMarginBottom
   increaseHeight
   onClick={props.onFiltersButtonClick} />
 </FilterButtonWrapper>
</SearchInputsSectionWrapper>
)

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
    iconName="room"
    label="Browse classes near you"
    itemScope
    itemType="http://schema.org/DiscoverAction"
    />
   <SecondaryButton
    icon
    iconName="domain"
    label="Add your school"
    itemScope
    itemType="http://schema.org/AddAction"
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
            />
          )}
        {this.props.bottomSection ? this.props.bottomSection : <BottomSectionContent getMyCurrentLocation={this.props.getMyCurrentLocation} /> }
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
    onFiltersButtonClick: PropTypes.func
}

SearchAreaPanel.defaultProps = {
    textAlign: 'center',
}

SearchArea.defaultProps = {
    middleSectionText: 'Or'
}

export default SearchArea;
