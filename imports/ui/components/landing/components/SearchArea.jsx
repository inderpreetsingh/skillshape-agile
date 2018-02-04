import React, {Fragment} from 'react';
import Sticky from 'react-stickynode';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import SearchBarStyled from './SearchBarStyled.jsx';
import NearByClassesButton from './buttons/NearByClassesButton';
import PrimaryButton from './buttons/PrimaryButton';
import SecondaryButton from './buttons/SecondaryButton';

import * as helpers from './jss/helpers.js';

/*Search Bar requires inline styles because of limitations of it using material-ui
rather than material ui next */


const SearchAreaPanel = styled.div`
  padding: ${helpers.rhythmInc};
  max-width: 431px;
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


const MiddleSection = styled.div`
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize*2}px;
  color: ${helpers.focalColor};
  margin: 0px;
`;

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

const SearchArea = (props) => (
  <SearchAreaPanel width={props.width} textAlign={props.textAlign} itemScope itemType="http://schema.org/SearchAction">
    {props.topSection ? props.topSection : <TaglineWrapper />}
    {props.middleSection ? props.middleSection :
        (
            <SearchBarStyled onSearch={props.onSearch} onFiltersButtonClick={props.onFiltersButtonClick}/>
        )}
    {props.bottomSection ? props.bottomSection : <BottomSectionContent getMyCurrentLocation={props.getMyCurrentLocation} /> }
  </SearchAreaPanel>
);


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
