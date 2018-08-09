import React, { Component, Fragment } from "react";
import { createContainer } from "meteor/react-meteor-data";
import styled from "styled-components";
import { findIndex, isEmpty, find } from "lodash";
import Typography from "material-ui/Typography";
//import `Sticky` from 'react-sticky-el';
import Sticky from "react-stickynode";
import { browserHistory } from "react-router";

import { getAverageNoOfRatings } from "/imports/util";

import NoResults from "/imports/ui/components/landing/components/NoResults.jsx";
import ClassMap from "/imports/ui/components/landing/components/map/ClassMap.jsx";
import MapView from "/imports/ui/components/landing/components/map/mapView.jsx";
import CardsList from "/imports/ui/components/landing/components/cards/CardsList.jsx";
import SearchBarStyled from "/imports/ui/components/landing/components/SearchBarStyled.jsx";
import Footer from "/imports/ui/components/landing/components/footer/index.jsx";
import PrimaryButton from "/imports/ui/components/landing/components/buttons/PrimaryButton.jsx";
import Preloader from "/imports/ui/components/landing/components/Preloader.jsx";
import SuggestionForm from "/imports/ui/components/landing/components/schoolSuggestions/SuggestionForm.jsx";
import { cardsData, cardsData1 } from "../../constants/cardsData.js";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";

// import collection definition over here
import ClassType from "/imports/api/classType/fields";
import Reviews from "/imports/api/review/fields";
import School from "/imports/api/school/fields";
import SLocation from "/imports/api/sLocation/fields";
import SkillCategory from "/imports/api/skillCategory/fields";
import SkillSubject from "/imports/api/skillSubject/fields";
import ClassTimes from "/imports/api/classTimes/fields";
import ClassInterest from "/imports/api/classInterest/fields";

const MainContentWrapper = styled.div`
  // margin-top: ${props => (props.isAnyFilterApplied ? -56 : 0)}px;
`;

const PreloaderWrapper = styled.div`
  ${helpers.flexCenter} height: 100vh;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const MapContentContainer = styled.div`
  display: flex;
`;

const SearchBarWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CardsContainer = styled.div`
  width: 100%;
  padding-top: ${props =>
    props.containerPaddingTop
      ? props.containerPaddingTop
      : helpers.rhythmDiv * 3 + "px"};
`;

const NoResultContainer = styled.div`
  text-align: center;
  width: 100%;
  min-height: 100vh;
  ${helpers.flexCenter} flex-direction: column;
`;

const MapOuterContainer = styled.div`
  width: 40%;
  display: block;
  position: relative;
  @media screen and (max-width: ${helpers.tablet + 100}px) {
    width: 100%;
  }
`;

const MapContainer = styled.div`
  transform: translateY(70px);
  height: calc(100vh - 80px);
`;

const WithMapCardsContainer = styled.div`
  width: 60%;

  ${helpers.flexDirectionColumn} justify-content: space-between;
  transform: translateY(80px);

  @media screen and (max-width: ${helpers.tablet + 100}px) {
    display: none;
    width: 0;
    height: 0;
  }
`;

const FooterOuterWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;

  @media screen and (max-width: ${helpers.tablet + 100}px) {
    display: none;
    width: 0;
    height: 0;
  }
`;

const FooterWrapper = styled.div`
  width: 100%;
`;

const RevertSearch = styled.span`
  padding: ${helpers.rhythmDiv}px;
  font-size: ${helpers.baseFontSize * 2}px;
  font-weight: 300;
  font-family: ${helpers.specialFont};
  color: ${helpers.black};
`;

class ClassTypeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: {}
    };
  }

  handleAddSchool = () => {
    if (Meteor.userId()) {
      browserHistory.push("/claimSchool");
    } else {
      Events.trigger("registerAsSchool", { userType: "School" });
    }
  };

  makeCategorization = ({ classTypeData = [], skillCategoryData }) => {
    let data = {};
    for (skillCategoryObj of skillCategoryData) {
      data[skillCategoryObj.name] = [];
      for (classTypeObj of classTypeData) {
        if (!isEmpty(classTypeObj.selectedSkillCategory)) {
          let index = findIndex(classTypeObj.selectedSkillCategory, {
            _id: skillCategoryObj._id
          });
          if (index > -1) {
            data[skillCategoryObj.name].push(classTypeObj);
          }
        }
      }
    }
    return data;
  };

  showClassTypes = ({ classType }) => {
    if (!isEmpty(classType)) {
      return Object.keys(classType).map((key, index) => {
        let title = key;
        if (this.props.locationName == "your location") {
          title = `${key} in your location`;
        } else if (this.props.locationName) {
          title = `${key} in ${this.props.locationName}`;
        }

        if (!isEmpty(classType[key])) {
          return (
            <CardsList
              key={index}
              mapView={this.props.mapView}
              title={title}
              name={key}
              cardsData={classType[key]}
              classInterestData={this.props.classInterestData}
              locationName={this.props.locationName}
              handleSeeMore={this.props.handleSeeMore}
              filters={this.props.filters}
              reviewsData={this.props.reviewsData || []}
              hideClassTypeOptions={this.props.hideClassTypeOptions}
              landingPage={this.props.landingPage}
            />
          );
        }
      });
    }
  };

  getNoResultMsg = (isLoading, filters, classTypeData) => {
    if (isLoading) {
      return (
        <PreloaderWrapper>
          <Preloader />
        </PreloaderWrapper>
      );
    } else if (isEmpty(classTypeData)) {
      return (
        <NoResultContainer>
          {/*<NoResults
            removeAllFiltersButtonClick={this.props.removeAllFilters}
            addYourSchoolButtonClick={this.handleAddSchool}
          />
          <RevertSearch>
            {this.props.mapView
              ? "No results in this area. Try a different area?"
              : "Try changing your search"}
          </RevertSearch> */}
          <SuggestionForm
            filters={this.props.filters}
            tempFilters={this.props.tempFilters}
            removeAllFilters={this.props.removeAllFilters}
          />
        </NoResultContainer>
      );
    }
  };

  render() {
    const {
      mapView,
      classTypeData,
      classInterestData,
      reviewsData,
      skillCategoryData,
      splitByCategory,
      filters,
      isLoading,
      classTimesData
    } = this.props;
    return (
      <MainContentWrapper>
        {mapView ? (
          <ContentContainer>
            <MapContentContainer>
              <MapOuterContainer>
                <Sticky top={10}>
                  <MapContainer>
                    <MapView {...this.props} />
                  </MapContainer>
                </Sticky>
              </MapOuterContainer>

              <WithMapCardsContainer>
                <div>
                  {this.props.appliedTopFilter &&
                    React.cloneElement(this.props.appliedTopFilter)}
                  <CardsList
                    schoolData={this.props.schoolData}
                    mapView={this.props.mapView}
                    cardsData={classTypeData}
                    reviewsData={reviewsData || []}
                    classInterestData={classInterestData}
                    handleSeeMore={this.props.handleSeeMore}
                    filters={this.props.filters}
                    hideClassTypeOptions={this.props.hideClassTypeOptions}
                    landingPage={this.props.landingPage}
                    classTypeData={classTypeData}
                  />

                  {/*Hack to get rid of this on school type page*/
                  !this.props.schoolView &&
                    this.getNoResultMsg(isLoading, filters, classTypeData)}
                </div>

                <FooterOuterWrapper>
                  <FooterWrapper>
                    <Footer mapView={this.props.mapView} />
                  </FooterWrapper>
                </FooterOuterWrapper>
              </WithMapCardsContainer>
            </MapContentContainer>
          </ContentContainer>
        ) : (
          <CardsContainer containerPaddingTop={this.props.containerPaddingTop}>
            {splitByCategory ? (
              this.showClassTypes({
                classType: this.makeCategorization({
                  classTypeData: classTypeData,
                  skillCategoryData: skillCategoryData
                })
              })
            ) : (
              <CardsList
                mapView={this.props.mapView}
                cardsData={classTypeData}
                reviewsData={reviewsData || []}
                classInterestData={classInterestData}
                handleSeeMore={this.props.handleSeeMore}
                filters={this.props.filters}
                classTimesData={classTimesData || []}
                hideClassTypeOptions={this.props.hideClassTypeOptions}
                landingPage={this.props.landingPage}
                classTypeData={classTypeData}
              />
            )}

            {!this.props.schoolView &&
              this.getNoResultMsg(isLoading, filters, classTypeData)}
            {/*<CardsList
                        		mapView={mapView}
                        		title={'Yoga in Delhi'}
                        		name={'yoga-in-delhi'}
                        		cardsData={cardsData}
                        	/>*/}
          </CardsContainer>
        )}
      </MainContentWrapper>
    );
  }
}

export default createContainer(props => {
  let classTypeData = [];
  let reviewsData = [];
  let classTypeIds = [];
  let schoolData = [];
  let skillCategoryData = [];
  let classTimesData = [];
  let classInterestData = [];
  let sLocationData = [];
  let isLoading = true;
  let subscription, reviewsSubscription;
  let filters = props.filters ? props.filters : {};

  if (props.mapView) {
    const query = props.location && props.location.query;
    if (query && query.NEPoint && query.SWPoint) {
      filters.NEPoint = query.NEPoint.split(",").map(Number);
      filters.SWPoint = query.SWPoint.split(",").map(Number);
    }
  }

  if (props.splitByCategory) {
    subscription = Meteor.subscribe("school.getClassTypesByCategory", filters);
  } else {
    // This is used to grab `ClassTypes` on the basis of `schoolId`
    subscription = Meteor.subscribe(props.classTypeBySchool, props.filters);
  }

  Meteor.subscribe("classInterest.getClassInterest");
  if (props.filters.schoolId) {
    classTypeData = ClassType.find({
      schoolId: props.filters.schoolId
    }).fetch();
  } else {
    classTypeData = ClassType.find().fetch();
  }

  classTypeIds = classTypeData.map(data => data._id);
  // We will subscribe only those reviews with classtype ids
  reviewsSubscription = Meteor.subscribe(
    "review.getReviewsWithReviewForIds",
    classTypeIds
  );

  schoolData = School.find().fetch();
  skillCategoryData = SkillCategory.find().fetch();
  classTimesData = ClassTimes.find().fetch();
  classInterestData = ClassInterest.find().fetch();
  sLocationData = SLocation.find().fetch();

  /*Find SkillCategory,SkillSubject and SLocation to make this container reactive on these collection
    other wise skills are joined with collections using package
    perak:joins */
  SkillSubject.find().fetch();

  if (
    (subscription.ready() && reviewsSubscription.ready()) ||
    ClassType.find().count() > 0
  ) {
    reviewsData = Reviews.find().fetch();
    // console.info("class type data...................................................",classTypeData);
    isLoading = false;
  }
  return {
    ...props,
    classTypeData,
    schoolData,
    reviewsData,
    skillCategoryData,
    classTimesData,
    classInterestData,
    sLocationData,
    isLoading
  };
}, ClassTypeList);
