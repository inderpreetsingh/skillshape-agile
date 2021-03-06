import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { isEmpty } from "lodash";

import { withStyles } from "material-ui/styles";
import Typography from "material-ui/Typography";
import Button from "material-ui/Button";
import Icon from "material-ui/Icon";

import { createMarkersOnMap, toastrModal } from "/imports/util";
import get from "lodash/get";
import uniq from "lodash/uniq";
import ClassMap from "/imports/ui/components/landing/components/map/ClassMap";
import ClassTypeDescription from "/imports/ui/components/landing/components/class/ClassTypeDescription.jsx";
import ClassTypeInfo from "/imports/ui/components/landing/components/class/ClassTypeInfo.jsx";
import ActionButtons from "/imports/ui/components/landing/components/class/ActionButtons.jsx";
import BestPrices from "/imports/ui/components/landing/components/class/BestPrices.jsx";
import ClassTypeLogo from "/imports/ui/components/landing/components/class/ClassTypeLogo.jsx";

import ClassTimeButton from "/imports/ui/components/landing/components/buttons/ClassTimeButton";
import PrimaryButton from "/imports/ui/components/landing/components/buttons/PrimaryButton";
import ProgressiveImage from "react-progressive-image";
import NonUserDefaultDialogBox from "/imports/ui/components/landing/components/dialogs/NonUserDefaultDialogBox.jsx";
import ManageRequestsDialogBox from "/imports/ui/components/landing/components/dialogs/ManageRequestsDialogBox.jsx";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import { ContainerLoader } from "/imports/ui/loading/container.js";
import { schoolLogo } from "/imports/ui/components/landing/site-settings.js";
import Events from "/imports/util/events";
import { getUserFullName } from "/imports/util/getUserData";
import { openMailToInNewTab } from "/imports/util/openInNewTabHelpers";

const styles = {
  myLocationIcon: {
    transform: "translateY(2px)",
    marginRight: helpers.rhythmDiv / 2,
    color: helpers.textColor,
    fontSize: helpers.baseFontSize
  }
};

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

const ClassTypeInfoWrapper = styled.div``;

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

const MyLocationList = styled.ul`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: white;
  padding: ${helpers.rhythmDiv * 2}px;
`;

const MyLocation = styled.li`
  display: flex;
  align-items: flex-start;
  list-style: none;
  font-family: ${helpers.commonFont};
  font-size: ${helpers.baseFontSize}px;
  font-style: italic;
  color: ${helpers.textColor};
`;

const LocationText = styled.span``;

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
    // min-width: 300px;
    width: 100%;
  }
`;

const LocationNotFound = styled.div`
  min-height: inherit;
  ${helpers.flexCenter};
`;

const ClassTypeForegroundImage = styled.div`
  ${helpers.coverBg}
  transition: background-image 1s linear !important;
  background-position: center center;
  background-image: url('${props =>
    props.coverSrc ? props.coverSrc : settings.classTypeImgSrc}');
  height: 480px;
  border-radius: 5px;
  flex-grow: 1;
  position: relative;
  @media screen and (max-width: ${helpers.tablet}px) {
    display: none;
  }
`;

const ContentSection = styled.div`
  margin-right: ${props =>
    props.leftSection ? `${helpers.rhythmDiv * 2}px` : 0};
  flex-grow: ${props => (props.leftSection ? 0 : 1)};
  display: flex;
  flex-direction: column;
  align-items: ${props => (props.leftSection ? "initial" : "stretch")};
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

const HideOnSmallScreen = styled.div`
  @media screen and (max-width: ${helpers.tablet}px) {
    display: none;
  }
`;

const LogoAndActionButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  position: absolute;
  width: 100%;
  padding: 0 ${helpers.rhythmDiv * 2}px;
  left: 0;
  bottom: 0;

  @media screen and (max-width: ${helpers.tablet}px) {
    position: static;
    padding: 0;
  }
`;
const Li = styled.li`
  list-style-position: outside;
`;

class ClassTypeCoverContent extends React.Component {
  state = {
    nonUserDefaultDialog: false,
    isBusy: false,
    locationData: []
  };
  componentDidMount() {
    this._addLocationOnMap();
  }

  componentDidUpdate() {
    this._addLocationOnMap();
  }
  componentWillMount() {
    if (!isEmpty(get(this.props, "classTypeData.filters.location", []))) {
      let locIds = [];
      this.props.classTypeData.filters.location.map(obj => {
        locIds.push(get(obj, "loc.locationId", null));
      });
      Meteor.call("location.getLocsFromIds", locIds, (err, res) => {
        if (res) {
          this.setState({ locationData: res });
        }
      });
    }
  }
  _createAddressStr(locationData) {
    let address = [];
    for (obj of locationData) {
      // const addressArray = [obj.address && obj.address, obj.city && obj.city, obj.state && obj.state, obj.country && obj.country];
      // return addressArray.filter(str => str).join(", ");
      address.push(
        `${obj.address ? obj.address : "Address"}, ${
        obj.city ? obj.city : "City"
        }, ${obj.state ? obj.state : "State"}, ${
        obj.country ? obj.country : "Country"
        }`
      );
    }
    return uniq(address);
  }

  _addLocationOnMap() {
    let locationData = get(this.state, "locationData", []);
    if (this.props.noClassTypeData) {
      if (!isEmpty(this.props.schoolLocation)) {
        locationData = this.props.schoolLocation;
        createMarkersOnMap("myMap", locationData);
      }
    } else {
      if (!isEmpty(locationData)) {
        createMarkersOnMap("myMap", locationData);
      }
    }
  }

  getAddress() {
    let locationData = get(this.state, "locationData", []);
    if (this.props.noClassTypeData) {
      if (!isEmpty(this.props.schoolLocation)) {
        locationData = this.props.schoolLocation;
        return this._createAddressStr(locationData);
      }
    } else {
      if (!isEmpty(locationData)) {
        return this._createAddressStr(locationData);
      }
      return [];
    }
  }

  getSkillValues = data => {
    let str = "";
    if (!isEmpty(data)) {
      str = data.map(skill => skill.name);
      str = str.join(", ");
    }
    return str;
  };

  handleDefaultDialogBox = (title, state) => {
    const newState = {
      ...state,
      defaultDialogBoxTitle: title,
      nonUserDefaultDialog: state
    };
    this.setState(newState);
  };

  handleManageRequestsDialogBox = state => {
    this.setState({
      manageRequestsDialog: state
    });
  };

  // Request Class type location
  // requestClassTypeLocation = () => {
  //     const { toastr, classTypeData } = this.props;
  //     if(Meteor.userId() && !isEmpty(classTypeData)) {
  //         const payload = {
  //             schoolId:classTypeData.schoolId,
  //             classTypeId:classTypeData._id,
  //             classTypeName:classTypeData.name
  //         };
  //         this.setState({ isBusy:true });
  //         Meteor.call('classType.requestClassTypeLocation', payload, (err,res)=> {
  //
  //             this.setState({ isBusy: false }, () => {
  //                 if(res) {
  //                     // Need to show message to user when email is send successfully.
  //                     toastr.success("Your email has been sent. We will assist you soon.", "Success");
  //                 }
  //                 if(err) {
  //                     toastr.error( err.reason || err.message,"Error");
  //                 }
  //             })
  //         });
  //     } else {
  //         this.handleDefaultDialogBox('Login to request location',true);
  //     }
  // }

  getOurEmail = () => {
    return this.props.schoolDetails.email;
  };

  handleRequest = text => {
    const { toastr, schoolDetails } = this.props;

    if (!isEmpty(schoolDetails)) {
      let emailBody = "";
      let url = `${Meteor.absoluteUrl()}schools/${schoolDetails.slug}`;
      let subject = "",
        message = "";
      let currentUserName = getUserFullName(Meteor.user());
      emailBody = `Hi %0D%0A%0D%0A I saw your listing on SkillShape.com ${url} and would like to attend. Can you update your ${
        text ? text : pricing
        }%3F %0D%0A%0D%0A Thanks`;
      const mailTo = `mailto:${this.getOurEmail()}?subject=${subject}&body=${emailBody}`;

      // const mailToNormalized = encodeURI(mailTo);
      // window.location.href = mailToNormalized;
      openMailToInNewTab(mailTo);
    }
  };

  requestClassTypeLocation = () => {
    const {
      toastr,
      classTypeData,
      noClassTypeData,
      schoolDetails
    } = this.props;
    if (Meteor.userId()) {
      let payload;
      if (noClassTypeData) {
        payload = {
          schoolId: schoolDetails._id
        };
      } else {
        payload = {
          schoolId: classTypeData.schoolId,
          classTypeId: classTypeData._id
        };
      }
      this.setState({ isBusy: true });
      Meteor.call(
        "classTypeLocationRequest.addRequest",
        payload,
        "save",
        (err, res) => {
          this.setState({ isBusy: false }, () => {
            if (err) {
              toastr.error(err.reason || err.message, "Error", {}, false);
            } else {
              toastr.success("Your request has been processed", "success");
              this.handleRequest("class location");
            }
          });
        }
      );
    } else {
      this.handleManageRequestsDialogBox(true);
    }
  };

  render() {
    const props = this.props;
    const { noClassTypeData } = this.props;
    const classTypeName = props.noClassTypeData ? "" : props.classTypeData.name;
    const selectedLocation = props.noClassTypeData
      ? props.schoolLocation
      : props.classTypeData.selectedLocation;
    // const selectedLocation = '';
    const description = props.noClassTypeData
      ? props.schoolDetails.aboutHtml
      : props.classTypeData.desc;
    const noOfRatings =
      !props.isEdit && !isEmpty(props.reviews) && props.reviews.noOfRatings;
    const noOfReviews =
      !props.isEdit && !isEmpty(props.reviews) && props.reviews.noOfReviews;
    const EditButton = props.editButton;
    let noLocation = false;
    if (noClassTypeData) {
      noLocation = isEmpty(get(this.props, "schoolLocation", []));
    } else {
      noLocation = isEmpty(
        get(this.props, "classTypeData.filters.location", [])
      );
    }
    return (
      <CoverContentWrapper>
        <CoverContent>
          {this.state.isBusy && <ContainerLoader />}
          {this.state.nonUserDefaultDialog && (
            <NonUserDefaultDialogBox
              title={this.state.defaultDialogBoxTitle}
              open={this.state.nonUserDefaultDialog}
              onModalClose={() => this.handleDefaultDialogBox("", false)}
            />
          )}
          {this.state.manageRequestsDialog && (
            <ManageRequestsDialogBox
              title={"Location Info"}
              open={this.state.manageRequestsDialog}
              onModalClose={() => this.handleManageRequestsDialogBox(false)}
              requestFor={"location"}
              submitBtnLabel={"Request location"}
              schoolData={props.schoolDetails}
              classTypeId={!props.noClassTypeData && props.classTypeData._id}
              onToastrClose={() => this.handleManageRequestsDialogBox(false)}
            />
          )}

          <ContentSection leftSection>
            {/* Displays map when it's not edit mode*/}
            {!props.isEdit && (
              <MapContainer>
                {noLocation ? (
                  <LocationNotFound>
                    <PrimaryButton
                      icon
                      onClick={this.requestClassTypeLocation}
                      iconName="add_location"
                      label="Request location"
                    />
                  </LocationNotFound>
                ) : (
                    <Fragment>
                      <div
                        id="myMap"
                        style={{ minHeight: 320 }}
                      />
                      <MyLocationList>
                        {this.getAddress().map((location, index) => {
                          return (
                            <MyLocation>
                              <Icon className={props.classes.myLocationIcon}>
                                location_on
                            </Icon>
                              <LocationText>{location}</LocationText>
                            </MyLocation>
                          );
                        })}
                      </MyLocationList>
                    </Fragment>
                  )}
              </MapContainer>
            )}

            {/* When it's edit mode, displays logo */}
            {props.isEdit ? (
              <LogoContainer>
                <ClassTypeLogo position="relative" logoSrc={props.logoSrc}>
                  <EditButtonWrapper>
                    <ClassTimeButton
                      icon
                      iconName="photo_camera"
                      label="Logo"
                      onClick={props.onEditLogoButtonClick}
                    />
                  </EditButtonWrapper>
                </ClassTypeLogo>
              </LogoContainer>
            ) : (
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
                />
              )}

            {!props.isEdit &&
              props.noClassTypeData &&
              (props.bestPriceDetails.class ||
                props.bestPriceDetails.monthly) && (
                <BestPrices
                  onPricingButtonClick={
                    props.actionButtonProps.onPricingButtonClick
                  }
                  bestPriceDetails={props.bestPriceDetails}
                />
              )}
          </ContentSection>

          <ContentSection>
            {props.isEdit && (
              <ShowOnMobile>
                {" "}
                <EditButtonWrapper>
                  <ClassTimeButton
                    icon
                    iconName="photo_camera"
                    label="Background"
                    onClick={props.onEditBgButtonClick}
                  />
                </EditButtonWrapper>
              </ShowOnMobile>
            )}
            <ProgressiveImage
              src={props.coverSrc}
              placeholder={config.blurImage}
            >
              {src => (
                <ClassTypeForegroundImage coverSrc={src}>
                  <Fragment>
                    <LogoAndActionButtons>
                      {props.noClassTypeData &&
                        !props.isEdit &&
                        props.logoSrc && (
                          <HideOnSmallScreen>
                            <ClassTypeLogo
                              publicView
                              position={"static"}
                              logoSrc={props.logoSrc}
                            />
                          </HideOnSmallScreen>
                        )}

                      {props.actionButtons || (
                        <ActionButtons
                          isEdit={props.isEdit}
                          emailUsButton={props.actionButtonProps.emailUsButton}
                          pricingButton={props.actionButtonProps.pricingButton}
                          callUsButton={props.actionButtonProps.callUsButton}
                          scheduleButton={
                            props.actionButtonProps.scheduleButton
                          }
                          visitSiteButton={
                            props.actionButtonProps.visitSiteButton
                          }
                          onCallUsButtonClick={
                            props.actionButtonProps.onCallUsButtonClick
                          }
                          onEmailButtonClick={
                            props.actionButtonProps.onEmailButtonClick
                          }
                          onPricingButtonClick={
                            props.actionButtonProps.onPricingButtonClick
                          }
                          onScheduleButtonClick={
                            props.actionButtonProps.onScheduleButtonClick
                          }
                          siteLink={props.actionButtonProps.siteLink}
                          rightSide={props.noClassTypeData && props.logoSrc}
                        />
                      )}
                    </LogoAndActionButtons>

                    {props.editButton &&
                      (props.isEdit ? (
                        <EditButtonWrapper>
                          <ClassTimeButton
                            icon
                            iconName="photo_camera"
                            label="Background"
                            onClick={props.onEditBgButtonClick}
                          />
                        </EditButtonWrapper>
                      ) : (
                          <EditButtonWrapper>
                            {" "}
                            <EditButton />{" "}
                          </EditButtonWrapper>
                        ))}
                  </Fragment>
                </ClassTypeForegroundImage>
              )}
            </ProgressiveImage>

            {/* On large screens this section will be below foregroud image,
                on smaller screens it's below the left side*/}
            <ClassTypeInfoWrapper>
              {(props.classTypeMetaInfo || props.classTypeData) && (
                <ClassTypeInfo
                  ageRange={
                    props.classTypeData.ageMin &&
                    props.classTypeData.ageMax &&
                    `${props.classTypeData.ageMin} - ${
                    props.classTypeData.ageMax
                    }`
                  }
                  gender={props.classTypeData.gender}
                  experience={props.classTypeData.experienceLevel}
                  subjects={this.getSkillValues(
                    props.classTypeData.selectedSkillSubject
                  )}
                  categories={this.getSkillValues(
                    props.classTypeData.selectedSkillCategory
                  )}
                />
              )}

              <ShowOnMobile>
                {props.actionButtons || (
                  <ActionButtons
                    isEdit={props.isEdit}
                    editButton={props.editButton}
                    emailUsButton={props.actionButtonProps.emailUsButton}
                    pricingButton={props.actionButtonProps.pricingButton}
                    callUsButton={props.actionButtonProps.callUsButton}
                    scheduleButton={props.actionButtonProps.scheduleButton}
                    visitSiteButton={props.actionButtonProps.visitSiteButton}
                    onCallUsButtonClick={
                      props.actionButtonProps.onCallUsButtonClick
                    }
                    onEmailButtonClick={
                      props.actionButtonProps.onEmailButtonClick
                    }
                    onPricingButtonClick={
                      props.actionButtonProps.onPricingButtonClick
                    }
                    onScheduleButtonClick={
                      props.actionButtonProps.onScheduleButtonClick
                    }
                    siteLink={props.actionButtonProps.siteLink}
                  />
                )}
              </ShowOnMobile>
            </ClassTypeInfoWrapper>
          </ContentSection>
        </CoverContent>
      </CoverContentWrapper>
    );
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
};

ClassTypeCoverContent.defaultProps = {
  actionButtonProps: {}
};

export default toastrModal(withStyles(styles)(ClassTypeCoverContent));
