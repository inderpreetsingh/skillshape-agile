import React , {Fragment} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {isEmpty} from 'lodash';

import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';

import { createMarkersOnMap, toastrModal } from '/imports/util';

import ClassMap from '../../map/ClassMap';
import ClassTypeDescription from '../ClassTypeDescription.jsx';
import ClassTypeInfo from '../ClassTypeInfo.jsx';
import ActionButtons from '../ActionButtons.jsx';
import BestPrices from '../BestPrices.jsx';
import ClassTypeLogo from '../ClassTypeLogo.jsx';

import * as helpers from '../../jss/helpers.js';
import * as settings from '../../../site-settings.js';

import NonUserDefaultDialogBox from '/imports/ui/components/landing/components/dialogs/NonUserDefaultDialogBox.jsx';
import ClassTimeButton from '/imports/ui/components/landing/components/buttons/ClassTimeButton';
import PrimaryButton from '/imports/ui/components/landing/components/buttons/PrimaryButton';
import { ContainerLoader } from '/imports/ui/loading/container.js';
import {schoolLogo} from '/imports/ui/components/landing/site-settings.js';

import Events from '/imports/util/events';

const styles = {
  myLocationIcon : {
    marginRight: helpers.rhythmDiv,
    color: helpers.textColor,
    fontSize: helpers.baseFontSize
  }
}

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
  min-height: 320px;
  width: 496px;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
  border-radius: 5px;
  background-color: #e0e0e0;
  @media screen and (max-width: ${helpers.tablet}px) {
    max-width: 100%;
    width: 100%;
  }
`;

const MyLocation = styled.div`
  ${helpers.flexCenter}
  justify-content: flex-start;
  width: 100%;
  background: white;
  font-family: ${helpers.commonFont};
  font-size: ${helpers.baseFontSize}px;
  font-style: italic;
  color: ${helpers.textColor};
  padding: ${helpers.rhythmDiv * 2}px;
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
        nonUserDefaultDialog: false,
        isBusy : false
    }
    componentDidMount() {
      this._addLocationOnMap();
    }

    componentDidUpdate() {
      this._addLocationOnMap();
    }

    _createAddressStr(locationData) {
      for (obj of locationData) {
        const addressArray = [obj.address,obj.city,obj.state,obj.country];
        return addressArray.filter(str => str).join(', ');
      }
    }

    _addLocationOnMap() {
      let locationData;
      if(this.props.noClassTypeData) {
        if(!isEmpty(this.props.schoolLocation)) {
          locationData = this.props.schoolLocation;
          createMarkersOnMap("myMap", locationData);
        }
      }else {
        if(!isEmpty(this.props.classTypeData.selectedLocation)) {
          locationData = [this.props.classTypeData.selectedLocation];
          createMarkersOnMap("myMap", locationData);
        }
      }
    }

    getAddress() {
      let locationData;
      if(this.props.noClassTypeData) {
        if(!isEmpty(this.props.schoolLocation)) {
          locationData = this.props.schoolLocation;
          return this._createAddressStr(locationData);
        }
      }else {
        if(!isEmpty(this.props.classTypeData.selectedLocation)) {
          locationData = [this.props.classTypeData.selectedLocation];
          return this._createAddressStr(locationData);
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

    handleDefaultDialogBox = (title, state) => {
      const newState = {...state, defaultDialogBoxTitle: title, nonUserDefaultDialog: state};
      this.setState(newState);
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
            this.handleDefaultDialogBox('Login to request location',true);
        }
    }

  render() {
    let props = this.props;
    console.info('this . props ...............',this.props,"...........")
    const classTypeName = props.noClassTypeData ? '' : props.classTypeData.name;
    const selectedLocation = props.noClassTypeData ? props.schoolLocation : props.classTypeData.selectedLocation;
    // const selectedLocation = '';
    const description = props.noClassTypeData ? props.schoolDetails.aboutHtml : props.classTypeData.desc;
    const noOfRatings = !props.isEdit && !isEmpty(props.reviews) && props.reviews.noOfRatings;
    const noOfReviews = !props.isEdit && !isEmpty(props.reviews) && props.reviews.noOfReviews;
    const EditButton = props.editButton;

    return(
        <CoverContentWrapper>
          <CoverContent>
            {this.state.isBusy && <ContainerLoader/>}
            {this.state.nonUserDefaultDialog && <NonUserDefaultDialogBox title={this.state.defaultDialogBoxTitle} open={this.state.nonUserDefaultDialog} onModalClose={() => this.handleDefaultDialogBox('',false)} />}

            <ContentSection leftSection>
              {/* Displays map when it's not edit mode*/}
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
                    ) :
                    <Fragment>
                      <div id="myMap" style={{height: '100%', minHeight: 320}}/>
                      <MyLocation> <Icon className={props.classes.myLocationIcon}>location_on</Icon> {this.getAddress()}</MyLocation>
                    </Fragment>
                  }
            </MapContainer>}

              {/* When it's edit mode, displays logo */}
              {props.isEdit ?
                <LogoContainer>
                  <ClassTypeLogo position='relative' logoSrc={props.logoSrc} >
                    <EditButtonWrapper>
                      <ClassTimeButton icon iconName='photo_camera' label="Logo" onClick={props.onEditLogoButtonClick} />
                    </EditButtonWrapper>
                  </ClassTypeLogo>
                </LogoContainer>
                :
                <ClassTypeDescription
                  isEdit={props.isEdit}
                  publishStatusButton={props.publishStatusButton}
                  schoolName={props.schoolDetails.name}
                  friendlySlug={props.schoolDetails.friendlySlugs.slug.base}
                  description={description}
                  isClassTypeNameAvailable={!props.noClassTypeData}
                  classTypeName={classTypeName}
                  noOfStars={noOfRatings}
                  noOfReviews={noOfReviews}
              />}

              {!props.isEdit && props.noClassTypeData && (props.bestPriceDetails.class || props.bestPriceDetails.monthly) && <BestPrices
                  onPricingButtonClick={props.actionButtonProps.onPricingButtonClick}
                  bestPriceDetails={props.bestPriceDetails}
                />}
            </ContentSection>

            <ContentSection>
              {props.isEdit && <ShowOnMobile> <EditButtonWrapper>
                <ClassTimeButton icon iconName="photo_camera" label="Background" onClick={props.onEditBgButtonClick} />
                </EditButtonWrapper></ShowOnMobile>}

              <ClassTypeForegroundImage coverSrc={props.coverSrc} >
                <Fragment>
                  {props.actionButtons || <ActionButtons
                    isEdit={props.isEdit}
                    emailUsButton={props.actionButtonProps.emailUsButton}
                    pricingButton={props.actionButtonProps.pricingButton}
                    callUsButton={props.actionButtonProps.callUsButton}
                    scheduleButton={props.actionButtonProps.scheduleButton}
                    visitSiteButton={props.actionButtonProps.visitSiteButton}
                    onCallUsButtonClick={props.actionButtonProps.onCallUsButtonClick}
                    onEmailButtonClick={props.actionButtonProps.onEmailButtonClick}
                    onPricingButtonClick={props.actionButtonProps.onPricingButtonClick}
                    onScheduleButtonClick={props.actionButtonProps.onScheduleButtonClick}
                    siteLink={props.actionButtonProps.siteLink}
                    rightSide={props.noClassTypeData && props.logoSrc}
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

              {/* On large screens this section will be below foregroud image,
                on smaller screens it's below the left side*/}
              <ClassTypeInfoWrapper>
                {(props.classTypeMetaInfo || props.classTypeData) && <ClassTypeInfo
                  ageRange={props.classTypeData.ageMin && props.classTypeData.ageMax && `${props.classTypeData.ageMin} - ${props.classTypeData.ageMax}`}
                  gender={props.classTypeData.gender}
                  experience={props.classTypeData.experienceLevel}
                  subjects={this.getSkillValues(props.classTypeData.selectedSkillSubject)}
                  categories={this.getSkillValues(props.classTypeData.selectedSkillCategory)}
                />}

                <ShowOnMobile>
                  {props.actionButtons || <ActionButtons
                    isEdit={props.isEdit}
                    emailUsButton={props.actionButtonProps.emailUsButton}
                    pricingButton={props.actionButtonProps.pricingButton}
                    callUsButton={props.actionButtonProps.callUsButton}
                    scheduleButton={props.actionButtonProps.scheduleButton}
                    visitSiteButton={props.actionButtonProps.visitSiteButton}
                    onCallUsButtonClick={props.actionButtonProps.onCallUsButtonClick}
                    onEmailButtonClick={props.actionButtonProps.onEmailButtonClick}
                    onPricingButtonClick={props.actionButtonProps.onPricingButtonClick}
                    onScheduleButtonClick={props.actionButtonProps.onScheduleButtonClick}
                    siteLink={props.actionButtonProps.siteLink}
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
  schoolDetails: PropTypes.object,
  actionButtonProps: PropTypes.object
}

ClassTypeCoverContent.defaultProps = {
  actionButtonProps: {

  }
}

export default toastrModal(withStyles(styles)(ClassTypeCoverContent));
