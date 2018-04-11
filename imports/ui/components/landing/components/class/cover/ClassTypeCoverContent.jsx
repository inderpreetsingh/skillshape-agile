import React , {Fragment} from 'react';
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

import ClassTimeButton from '/imports/ui/components/landing/components/buttons/ClassTimeButton';
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

const LogoContainer = styled.div`
  height: 100%;
  width: 496px;
  display: flex;
  align-items: flex-end;
  border-radius: 5px;
  @media screen and (max-width: ${helpers.tablet + 100}px) {
    min-width: 496px;
    width: 100%;
  }
  @media screen and (max-width: ${helpers.tablet}px) {
    min-height: 480px;
    min-width: 100%;
    width: 100%;
  }
  @media screen and (max-width: ${helpers.mobile}px) {
    width: 100%;
    min-width: 300px;
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

const ClassTypeLogo = styled.div`
  width: ${helpers.rhythmDiv * 20}px;
  height: ${helpers.rhythmDiv * 20}px;
  border-radius: 5px;
  position: ${props => props.position ? props.position : 'absolute'};
  left: ${props => props.left ? props.left : 0}px;
  bottom: ${props => props.bottom ? props.bottom: 0}px;
  ${helpers.coverBg}
  background-color: ${helpers.cancel};
  background-position: center center;
  background-image: url('${props => props.logoSrc}');
  @media screen and (max-width: 1100px) {
    bottom: ${props => props.publicView ? props.bottom + 64 : 0}px;
    left: ${props => props.publicView ? '50%' : (props.left || 0)+'px'};
    transform: translateX(${props => props.publicView ? '-50%' : 0});
  }
  @media screen and (max-width: 875px) {
    bottom: ${props => props.publicView ? props.bottom + 112 : 0}px;
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

const EditButtonWrapper = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  margin: ${helpers.rhythmDiv * 2}px;
`;

class ClassTypeCoverContent extends React.Component {

    state = {
        isBusy : false
    }
    componentDidMount() {
      this._addLocationOnMap();
    }

    componentDidUpdate() {
      this._addLocationOnMap();
    }


    _addLocationOnMap() {
      if(this.props.noClassTypeData) {
        if(!isEmpty(this.props.schoolLocation)) {
          const location = this.props.schoolLocation;
          createMarkersOnMap("myMap", location);
        }
      }else {
        if(!isEmpty(this.props.classTypeData.selectedLocation)) {
          const location = [this.props.classTypeData.selectedLocation];
          createMarkersOnMap("myMap", location);
        }
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
            // console.log("payload=========>",payload);
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
    console.info('this . props ...............',this.props,"...........")
    const classTypeName = props.noClassTypeData ? '' : props.classTypeData.name;
    const selectedLocation = props.noClassTypeData ? props.schoolLocation : props.classTypeData.selectedLocation;
    const EditButton = props.editButton;
    return(
        <CoverContentWrapper>
          <CoverContent>
            { this.state.isBusy && <ContainerLoader/>}
            <ContentSection leftSection>
              {!props.isEdit && <MapContainer>
                  {
                    isEmpty(selectedLocation) ? (
                      <LocationNotFound>
                        {!props.noClassTypeData && <PrimaryButton
                            icon
                            onClick={this.requestClassTypeLocation}
                            iconName="add_location"
                            label="Request location"
                        />}
                      </LocationNotFound>
                    ) :<div id="myMap" style={{height: '100%', minHeight: 320}}/>
                  }
              </MapContainer>}
              {props.isEdit ?
                <LogoContainer>
                  <ClassTypeLogo position='relative' logoSrc={props.logoSrc} noMarginBottom>
                    <EditButtonWrapper>
                      <ClassTimeButton icon iconName='photo_camera' label="Logo" onClick={props.onEditLogoButtonClick} />
                    </EditButtonWrapper>
                  </ClassTypeLogo>
                </LogoContainer>
                : <ClassTypeDescription
                isEdit={props.isEdit}
                publishStatusButton={props.publishStatusButton}
                schoolName={props.schoolDetails.name}
                description={props.schoolDetails.aboutHtml}
                isClassTypeNameAvailable={!isEmpty(props.classTypeData)}
                classTypeName={classTypeName}
                noOfStars={props.schoolDetails.noOfStars}
                noOfReviews={props.schoolDetails.noOfReviews}
              />}
            </ContentSection>

            <ContentSection>
              <ShowOnMobile>
              {props.isEdit && <EditButtonWrapper>
                <ClassTimeButton icon iconName="photo_camera" label="Background" onClick={props.onEditBgButtonClick} />
                </EditButtonWrapper>}
              </ShowOnMobile>

              <ClassTypeForegroundImage coverSrc={props.coverSrc} >
                <Fragment>
                  {props.actionButtons || <ActionButtons
                    isEdit={props.isEdit}
                    emailUsButton={props.emailUsButton}
                    pricingButton={props.pricingButton}
                    callUsButton={props.callUsButton}
                    rightSide={props.noClassTypeData && props.logoSrc}
                    onCallUsButtonClick={props.onCallUsButtonClick}
                    onEmailButtonClick={props.onEmailButtonClick}
                    onPricingButtonClick={props.onPricingButtonClick}
                    />}

                  {props.logoSrc && !props.isEdit && <ClassTypeLogo
                      left={helpers.rhythmDiv * 2}
                      bottom={helpers.rhythmDiv * 2}
                      logoSrc={props.logoSrc}
                      publicView
                      />}

                  {props.editButton && (props.isEdit ? <EditButtonWrapper>
                    <ClassTimeButton icon iconName="photo_camera" label="Background" onClick={props.onEditBgButtonClick} />
                    </EditButtonWrapper> : <EditButtonWrapper> <EditButton /> </EditButtonWrapper>)}

                </Fragment>
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
                    emailUsButton={props.emailUsButton}
                    pricingButton={props.pricingButton}
                    callUsButton={props.callUsButton}
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
