import { findIndex, isEmpty } from 'lodash';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
//import `Sticky` from 'react-sticky-el';
import Sticky from 'react-stickynode';
import styled from 'styled-components';
import ClassInterest from '/imports/api/classInterest/fields';
import ClassTimes from '/imports/api/classTimes/fields';
// import collection definition over here
import ClassType from '/imports/api/classType/fields';
import Reviews from '/imports/api/review/fields';
import School from '/imports/api/school/fields';
import SkillCategory from '/imports/api/skillCategory/fields';
import SkillSubject from '/imports/api/skillSubject/fields';
import SLocation from '/imports/api/sLocation/fields';
import CardsList from '/imports/ui/components/landing/components/cards/CardsList.jsx';
import Footer from '/imports/ui/components/landing/components/footer/index.jsx';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';
import MapView from '/imports/ui/components/landing/components/map/mapView.jsx';
import Preloader from '/imports/ui/components/landing/components/Preloader.jsx';
import SuggestionFormWrapper from '/imports/ui/components/landing/components/schoolSuggestions/SuggestionFormWrapper.jsx';
import MDSpinner from "react-md-spinner";

const MainContentWrapper = styled.div`
  // margin-top: ${(props) => (props.isAnyFilterApplied ? -56 : 0)}px;
`;

const PreloaderWrapper = styled.div`${helpers.flexCenter} height: 100vh;`;

const ContentContainer = styled.div`
	display: flex;
	flex-direction: column;
`;

const MapContentContainer = styled.div`display: flex;`;

const SearchBarWrapper = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const CardsContainer = styled.div`
	width: 100%;
	padding-top: ${(props) => (props.containerPaddingTop ? props.containerPaddingTop : helpers.rhythmDiv * 3 + 'px')};
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

const FooterWrapper = styled.div`width: 100%;`;

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
			browserHistory.push('/claimSchool');
		} else {
			Events.trigger('registerAsSchool', { userType: 'School' });
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
				if (this.props.locationName == 'your location') {
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
							schoolData={this.props.schoolData}
						/>
					);
				}
			});
		}
	};

	getNoResultMsg = (isLoading, filters, classTypeData) => {
		// debugger;

		if (isLoading) {
			return (
				<PreloaderWrapper>
					<Preloader />
				</PreloaderWrapper>
			);
		} else if (isEmpty(classTypeData)) {
			return (
				<NoResultContainer>
					{/*<SuggestionForm
            onSearchAgainButtonClick={this.props.onSearchAgainButtonClick}
            filters={this.props.filters}
            tempFilters={this.props.tempFilters}
            removeAllFilters={this.props.removeAllFilters}
          /> */}
					<SuggestionFormWrapper
						onSearchAgainButtonClick={this.props.onSearchAgainButtonClick}
						filters={this.props.filters}
						tempFilters={this.props.tempFilters}
						removeAllFilters={this.props.removeAllFilters}
					/>
				</NoResultContainer>
			);
		}
	};

	componentDidMount = () => {
		const { handleIsCardsSearching, isLoading } = this.props;
		handleIsCardsSearching && handleIsCardsSearching(isLoading);
	};

	componentDidUpdate = (prevProps, prevState) => {
		const { handleIsCardsSearching, isLoading } = this.props;
		if (prevProps.isLoading !== isLoading) handleIsCardsSearching && handleIsCardsSearching(isLoading);
	};
	shouldComponentUpdate(nextProps){
		return !nextProps.isLoading	
	}
	render() {
		// debugger;
		const {
			mapView,
			classTypeData,
			classInterestData,
			reviewsData,
			skillCategoryData,
			splitByCategory,
			filters,
			isLoading,
			classTimesData,
			params
		} = this.props;
		if(isLoading){
			return <center><MDSpinner size={50} /></center>
		}
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
									{this.props.appliedTopFilter && React.cloneElement(this.props.appliedTopFilter)}
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
										params = {params}
									/>

									{/*Hack to get rid of this on school type page*/
									!this.props.schoolView && this.getNoResultMsg(isLoading, filters, classTypeData)}
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
								params = {params}
								schoolData={this.props.schoolData}
							/>
						)}

						{!this.props.schoolView && this.getNoResultMsg(isLoading, filters, classTypeData)}
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

export default createContainer((props) => {
	let classTypeData = [];
	let reviewsData = [];
	let classTypeIds = [];
	let schoolData = [];
	let skillCategoryData = [];
	let classTimesData = [];
	let classInterestData = [];
	let sLocationData = [];
	let isLoading = true;
	let subscription, reviewsSubscription, classTimesSubscription;
	let filters = props.filters ? props.filters : {};
	if (props.mapView) {
		const query = props.location && props.location.query;
		if (query && query.NEPoint && query.SWPoint) {
			filters.NEPoint = query.NEPoint.split(',').map(Number);
			filters.SWPoint = query.SWPoint.split(',').map(Number);
		}
	}

	if (props.splitByCategory) {
		subscription = Meteor.subscribe('school.getClassTypesByCategory', filters);
	} else {
		// This is used to grab `ClassTypes` on the basis of `schoolId`
		subscription = Meteor.subscribe(props.classTypeBySchool, props.filters);
	}

	let classInterestSub = Meteor.subscribe('classInterest.getClassInterest');
	// debugger;
	if (props.filters.schoolId) {
		classTypeData = ClassType.find({
			schoolId: props.filters.schoolId
		}).fetch();
	} else {
		classTypeData = ClassType.find().fetch();
	}

	// NOTE: By adding classTimesSubscription, we get certain results in classTypeData
	// temporarily filtering out those results fixes the issues..
	classTypeIds = classTypeData.map((data) => data.schoolId && data._id);
	// We will subscribe only those reviews && classTimes with classtype ids
	reviewsSubscription = Meteor.subscribe('review.getReviewsWithReviewForIds', classTypeIds);

	classTimesSubscription = Meteor.subscribe('classType.getClassTimesWithIds', {classTypeIds});

	schoolData = School.find().fetch();
	skillCategoryData = SkillCategory.find().fetch();
	classTimesData = ClassTimes.find().fetch();
	classInterestData = ClassInterest.find().fetch();
	sLocationData = SLocation.find().fetch();
	SkillSubject.find().fetch();
	let isAllSubReady = classInterestSub && classInterestSub.ready() && reviewsSubscription && reviewsSubscription.ready() &&  subscription &&subscription.ready()
	if ( isAllSubReady ) {
		reviewsData = Reviews.find().fetch();
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
