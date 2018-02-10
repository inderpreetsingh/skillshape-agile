import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ClassMap from '../map/ClassMap';
import ClassTypeDescription from './ClassTypeDescription.jsx';
import ClassTypeInfo from './ClassTypeInfo.jsx';
import ActionButtons from './ActionButtons.jsx';

import * as helpers from '../jss/helpers.js';
import * as settings from '../../site-settings.js';

const CoverContent = styled.div`
  display: flex;
  padding: ${helpers.rhythmDiv * 2}px;
  position: relative;
  z-index: 16;

  @media screen and (max-width: ${helpers.mobile}px) {
    flex-direction: column;
    padding-bottom: 0;
  }
`;

const CoverContentWrapper = styled.div`
  max-width: ${helpers.maxContainerWidth}px;
  width: 100%;
  margin: 0 auto;
`;


const ClassTypeInfoWrapper = styled.div`

`;


const MapContainer = styled.div`
  height: 320px;
  max-width: 496px;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
  border-radius: 5px;
`;

const ClassTypeForegroundImage = styled.div`
  ${helpers.coverBg}
  background-position: center center;
  background-image: url('${props => props.coverSrc ? props.coverSrc : settings.classTypeImgSrc}');
  height: 480px;
  border-radius: 5px;
  flex-grow: 1;
  position: relative;

  @media screen and (max-width: ${helpers.mobile}px) {
    display: none;
  }
`;

const ContentSection = styled.div`
  margin-right:${props => props.leftSection ? `${helpers.rhythmDiv * 2}px` : 0 };
  flex-grow: ${props => props.leftSection ? 0 : 1 };
  display: flex;
  flex-direction: column;
  align-items: ${props => props.leftSection ? 'initial' : 'stretch' };

  @media screen and (max-width: ${helpers.mobile}px) {
    margin-right: 0;
  }
`;

const ShowOnMobile = styled.div`
  display: none;

  @media screen and (max-width: ${helpers.mobile}px) {
    display: block;
    margin-top: ${helpers.rhythmDiv * 2}px;
  }
`;

const ClassTypeCoverContent = (props) => (
  <CoverContent>
    <ContentSection leftSection>
      <MapContainer>
        {props.map || <ClassMap mapLocation={props.mapLocation}/>}
      </MapContainer>

      {props.classDescription || <ClassTypeDescription
        schoolName={props.schoolDetails.schoolName}
        description={props.schoolDetails.fullDescription}
        classTypeName={props.schoolDetails.classTypeName}
        noOfStars={props.schoolDetails.noOfStars}
        noOfReviews={props.schoolDetails.noOfReviews}
      />}
    </ContentSection>

    <ContentSection>
      <ClassTypeForegroundImage coverSrc={props.coverSrc} >
        {props.actionButtons || <ActionButtons
          onCallUsButtonClick={props.onCallUsButtonClick}
          onEmailButtonClick={props.onEmailButtonClick}
          onPricingButtonClick={props.onPricingButtonClick}
          />}
      </ClassTypeForegroundImage>

      <ClassTypeInfoWrapper>
        {props.classTypeMetaInfo || <ClassTypeInfo
          ageRange={props.classTypeData.ageRange}
          gender={props.classTypeData.gender}
          experience={props.classTypeData.experience}
          subjects={props.classTypeData.subjects}
        />}

        <ShowOnMobile>
          {props.actionButtons || <ActionButtons
            onCallUsButtonClick={props.onCallUsButtonClick}
            onEmailButtonClick={props.onEmailButtonClick}
            onPricingButtonClick={props.onPricingButtonClick}
            />}
        </ShowOnMobile>

      </ClassTypeInfoWrapper>
    </ContentSection>
  </CoverContent>
);

ClassTypeCoverContent.propTypes = {
  actionButtons: PropTypes.element,
  classTypeMetaInfo: PropTypes.element,
  classDescription: PropTypes.element,
  map: PropTypes.element,
  mapLocation: PropTypes.string,
  classTypeData: PropTypes.object,
  schoolDetails: PropTypes.object
}

ClassTypeCoverContent.defaultProps = {

}

export default ClassTypeCoverContent;
