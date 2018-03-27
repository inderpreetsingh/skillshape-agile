import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

import { createMarkersOnMap } from '/imports/util';

import ClassMap from '../../map/ClassMap';
import ClassTypeDescription from '../ClassTypeDescription.jsx';
import ClassTypeInfo from '../ClassTypeInfo.jsx';
import ActionButtons from '../ActionButtons.jsx';

import * as helpers from '../../jss/helpers.js';
import * as settings from '../../../site-settings.js';
import Events from '/imports/util/events';


const CoverContent = styled.div`
  display: flex;
  padding: ${helpers.rhythmDiv * 2}px;
  position: relative;
  z-index: 16;

  @media screen and (max-width: ${helpers.tablet}px) {
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
  background-color: #e0e0e0;

  @media screen and (max-width: ${helpers.tablet}px) {
    max-width: 100%;
    width: 100%;
  }
`;

const LocationNotFound = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;

const ClassTypeForegroundImage = styled.div`
  ${helpers.coverBg}
  background-position: center center;
  background-image: url('${props => props.coverSrc ? props.coverSrc : settings.classTypeImgSrc}');
  height: 480px;
  border-radius: 5px;
  flex-grow: 1;
  position: relative;

  @media screen and (max-width: ${helpers.tablet}px) {
    display: none;
  }
`;

const ContentSection = styled.div`
  margin-right:${props => props.leftSection ? `${helpers.rhythmDiv * 2}px` : 0 };
  flex-grow: ${props => props.leftSection ? 0 : 1 };
  display: flex;
  flex-direction: column;
  align-items: ${props => props.leftSection ? 'initial' : 'stretch' };

  @media screen and (max-width: ${helpers.tablet}px) {
    margin-right: 0;
  }
`;

const ShowOnMobile = styled.div`
  display: none;

  @media screen and (max-width: ${helpers.tablet}px) {
    display: block;
    margin-top: ${helpers.rhythmDiv * 2}px;
  }
`;

class ClassTypeCoverContent extends React.Component {

  componentWillReceiveProps(nextProps) {
    if(nextProps && !isEmpty(nextProps.classTypeData.selectedLocation)) {
      createMarkersOnMap("classTypeLocationMap", [nextProps.classTypeData.selectedLocation])
    }
  }

  componentDidMount() {
    const { classTypeData } = this.props;
    if(!isEmpty(classTypeData.selectedLocation)) {
      createMarkersOnMap("classTypeLocationMap", [classTypeData.selectedLocation])
    }
  }

  getSkillValues = (data)=> {
    let str = "";
    if(!isEmpty(data)) {
      str = data.map(skill=> skill.name);
      str = str.join(", ");
    }
    console.log("str -->>",str)
    return str;
  }

  // Request Class type location
  requestClassTypeLocation = () => {
    console.log("requestClassTypeLocation");
    // Not login user then show login modal
    if(!Meteor.user()) {
      Events.trigger("loginAsUser");
    } else {
      const { classTypeData } = this.props;
      console.log("classTypeData===>",classTypeData)
      const payload = {
        schoolId:classTypeData.schoolId,
        classTypeId:classTypeData._id,
        classTypeName:classTypeData.name
      };
      console.log("payload=========>",payload);
      Meteor.call('classType.requestClassTypeLocation', payload);
    }
  }

  render() {
    let props = this.props;
    return(
        <CoverContentWrapper>
          <CoverContent>
            <ContentSection leftSection>
              <MapContainer>
                  {
                    isEmpty(props.classTypeData.selectedLocation) ? (
                      <LocationNotFound>
                        <Button onClick={this.requestClassTypeLocation}>
                          Request Location
                        </Button>
                      </LocationNotFound>
                    ) :<div id="classTypeLocationMap" style={{height: '100%', minHeight: 320}}/>
                  }
              </MapContainer>
              {props.classDescription || <ClassTypeDescription
                schoolName={props.schoolDetails.name}
                description={props.schoolDetails.aboutHtml}
                classTypeName={props.classTypeData.name}
                noOfStars={props.schoolDetails.noOfStars}
                noOfReviews={props.schoolDetails.noOfReviews}
              />}
            </ContentSection>

            <ContentSection>
              <ClassTypeForegroundImage coverSrc={props.coverSrc} >
                {props.actionButtons || <ActionButtons
                  contactNumbers={props.contactNumbers}
                  onCallUsButtonClick={props.onCallUsButtonClick}
                  onEmailButtonClick={props.onEmailButtonClick}
                  onPricingButtonClick={props.onPricingButtonClick}
                  />}
              </ClassTypeForegroundImage>

              <ClassTypeInfoWrapper>
                {props.classTypeMetaInfo || <ClassTypeInfo
                  ageRange={props.classTypeData.ageMin && props.classTypeData.ageMax && `${props.classTypeData.ageMin} - ${props.classTypeData.ageMax}`}
                  gender={props.classTypeData.gender}
                  experience={props.classTypeData.experienceLevel}
                  subjects={this.getSkillValues(props.classTypeData.selectedSkillSubject)}
                  categories={this.getSkillValues(props.classTypeData.selectedSkillCategory)}
                />}

                <ShowOnMobile>
                  {props.actionButtons || <ActionButtons
                    contactNumbers={props.contactNumbers}
                    onCallUsButtonClick={props.onCallUsButtonClick}
                    onEmailButtonClick={props.onEmailButtonClick}
                    onPricingButtonClick={props.onPricingButtonClick}
                    />}
                </ShowOnMobile>

              </ClassTypeInfoWrapper>
            </ContentSection>
          </CoverContent>
        </CoverContentWrapper>
    )
  }
}

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
