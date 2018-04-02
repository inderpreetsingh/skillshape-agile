import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

import { createMarkersOnMap, toastrModal } from '/imports/util';

import ClassMap from '../../map/ClassMap';
import ClassTypeDescription from '../ClassTypeDescription.jsx';
import ClassTypeInfo from '../ClassTypeInfo.jsx';
import ActionButtons from '../ActionButtons.jsx';

import * as helpers from '../../jss/helpers.js';
import * as settings from '../../../site-settings.js';

import PrimaryButton from '/imports/ui/components/landing/components/buttons/PrimaryButton';
import { ContainerLoader } from '/imports/ui/loading/container.js';

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
  justify-content: center;
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

    state = {
        isBusy : false
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps && !isEmpty(nextProps.classTypeData.selectedLocation)) {
          createMarkersOnMap("classTypeLocationMap", [nextProps.classTypeData.selectedLocation])
        }
    }

    componentDidMount() {
        const { classTypeData } = this.props;
        console.log(classTypeData,"class type data..")
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
        const { toastr, classTypeData } = this.props;
        if(Meteor.userId() && !isEmpty(classTypeData)) {
            const payload = {
                schoolId:classTypeData.schoolId,
                classTypeId:classTypeData._id,
                classTypeName:classTypeData.name
            };
            console.log("payload=========>",payload);
            this.setState({ isBusy:true });
            Meteor.call('classType.requestClassTypeLocation', payload, (err,res)=> {

                this.setState({ isBusy: false }, () => {
                    if(res) {
                        // Need to show message to user when email is send successfully.
                        toastr.success("Your email has been sent. We will assist you soon.", "Success");
                    }
                    if(err) {
                        toastr.error( err.reason || err.message,"Error");
                    }
                })
            });
        } else {
            toastr.error("You need to login for location request!!!!","Error");
        }
    }

  render() {
    let props = this.props;
    const classTypeName = props.classTypeData.name || '';

    return(
        <CoverContentWrapper>
          <CoverContent>
            { this.state.isBusy && <ContainerLoader/>}
            <ContentSection leftSection>
              <MapContainer>
                  {
                    isEmpty(props.classTypeData.selectedLocation) ? (
                      <LocationNotFound>
                        <PrimaryButton
                            icon
                            onClick={this.requestClassTypeLocation}
                            iconName="add_location"
                            label="REQUEST LOCATION"
                        />
                      </LocationNotFound>
                    ) :<div id="classTypeLocationMap" style={{height: '100%', minHeight: 320}}/>
                  }
              </MapContainer>
              {props.classDescription || <ClassTypeDescription
                schoolName={props.schoolDetails.name}
                description={props.classTypeData.desc}
                isClassTypeNameAvailable={!isEmpty(props.classTypeData)}
                classTypeName={classTypeName}
                noOfStars={props.schoolDetails.noOfStars}
                noOfReviews={props.schoolDetails.noOfReviews}
              />}
            </ContentSection>

            <ContentSection>
              <ClassTypeForegroundImage coverSrc={props.coverSrc} >
                {props.actionButtons || <ActionButtons
                  isEdit={props.isEdit}
                  editLogoButton={props.editLogoButton}
                  editBgButton={props.editBgButton}
                  editButton={props.editButton}
                  onCallUsButtonClick={props.onCallUsButtonClick}
                  onEmailButtonClick={props.onEmailButtonClick}
                  onPricingButtonClick={props.onPricingButtonClick}
                  />}
              </ClassTypeForegroundImage>

              <ClassTypeInfoWrapper>
                {props.classTypeMetaInfo || (props.classTypeData ? <ClassTypeInfo
                  ageRange={props.classTypeData.ageMin && props.classTypeData.ageMax && `${props.classTypeData.ageMin} - ${props.classTypeData.ageMax}`}
                  gender={props.classTypeData.gender}
                  experience={props.classTypeData.experienceLevel}
                  subjects={this.getSkillValues(props.classTypeData.selectedSkillSubject)}
                  categories={this.getSkillValues(props.classTypeData.selectedSkillCategory)}
                /> : <span></span>)}

                <ShowOnMobile>
                  {props.actionButtons || <ActionButtons
                    isEdit={props.isEdit}
                    onEditLogoButton={props.onEditLogoButtonClick}
                    onEditBgButton={props.onEditBgButtonClick}
                    editButton={props.onEditButtonClick}
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
  editButton: PropTypes.element,
  classTypeMetaInfo: PropTypes.element,
  classDescription: PropTypes.element,
  map: PropTypes.element,
  mapLocation: PropTypes.string,
  classTypeData: PropTypes.object,
  schoolDetails: PropTypes.object
}

ClassTypeCoverContent.defaultProps = {

}

export default toastrModal(ClassTypeCoverContent);
