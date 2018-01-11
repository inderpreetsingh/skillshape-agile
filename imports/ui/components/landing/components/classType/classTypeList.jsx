import React, {Component} from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import styled from 'styled-components';
import { findIndex, isEmpty } from 'lodash';
import Typography from 'material-ui/Typography';

import ClassMap from '../map/ClassMap.jsx';
import CardsList from '../cards/CardsList.jsx';
import { cardsData, cardsData1} from '../../constants/cardsData.js';
import PrimaryButton from '../buttons/PrimaryButton.jsx';
import { Loading } from '/imports/ui/loading';

// import collection definition over here
import ClassType from "/imports/api/classType/fields";
import School from "/imports/api/school/fields";
import SLocation from "/imports/api/sLocation/fields";
import SkillCategory from "/imports/api/skillCategory/fields";
import SkillSubject from "/imports/api/skillSubject/fields";
import ClassTimes from "/imports/api/classTimes/fields";
import ClassInterest from "/imports/api/classInterest/fields";

const MainContentWrapper = styled.div`
  display: flex;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const CardsContainer = styled.div`
  width: 100%;
`;

const NoResultContainer = styled.div`
  text-align: center;
`;

class ClassTypeList extends Component {

	constructor(props) {
	    super(props);
	    this.state = {
	      filters: {}
	    }
	}

	makeCategorization = ({classTypeData = [], skillCategoryData}) => {
	    let data = {};
	    for(skillCategoryObj of skillCategoryData) {
	    	data[skillCategoryObj.name] = [];
	    	for(classTypeObj of classTypeData) {
	    		if(!isEmpty(classTypeObj.selectedSkillCategory)) {
	    			let index = findIndex(classTypeObj.selectedSkillCategory,{_id: skillCategoryObj._id})
	    			if(index > -1) {
	    				data[skillCategoryObj.name].push(classTypeObj)
	    			}
	    		}
	    	}
	    }
	    return data;
  	}

  	showClassTypes = ({classType}) => {
  		console.log("showClassTypes classType -->>>",classType, this.props)
  		if(!isEmpty(classType)) {
            return Object.keys(classType).map((key, index)=> {

                let title = key;
                if(this.props.locationName == "your_location") {
                    title = `${key} in your location`
                } else if(this.props.locationName) {
                    title = `${key} in ${this.props.locationName}`
                }
  				if(!isEmpty(classType[key])) {
  					return <CardsList
  						key={index}
                		mapView={this.props.mapView}
                		title={title}
                		name={key}
                		cardsData={classType[key]}
                		classInterestData={this.props.classInterestData}
                        locationName={this.props.locationName}
                        handleSeeMore={this.props.handleSeeMore}
                	/>
  				}
  			})
  		}
  	}

    getNoResultMsg = (isLoading, filters, classTypeData) => {
        if(isLoading) {

            return <Loading/>

        } else if(!isEmpty(filters.coords) && this.props.defaultLocation && isEmpty(classTypeData)) {

            return <NoResultContainer>
                <span style={{padding: 8}}>
                    <b>No Results Found</b>
                </span>
                <PrimaryButton
                    label="Want to explore in other location"
                    icon={true}
                    iconName="search"
                    onClick={this.props.clearDefaultLocation}
                />
            </NoResultContainer>

        }
    }

	render() {
		console.log("ClassTypeList props -->>",this.props);
		const { mapView, classTypeData, skillCategoryData, filters, isLoading } = this.props;
        console.log("classTypeData -->>",classTypeData,skillCategoryData);
		return (
			<MainContentWrapper>
				{
					mapView ? (
						<MapContainer>
                            <ClassMap isMarkerShown />
                        </MapContainer>
					) : (
						<CardsContainer>
							{
								this.showClassTypes({
									classType: this.makeCategorization({classTypeData: classTypeData, skillCategoryData: skillCategoryData})
								})
							}
                            {
                                this.getNoResultMsg(isLoading, filters, classTypeData)
                            }
						</CardsContainer>
					)
				}
			</MainContentWrapper>
		)
	}
}

export default createContainer(props => {
	console.log("ClassTypeList createContainer -->>",props)
	let classTypeData = [];
	let schoolData = [];
	let skillCategoryData = [];
	let classTimesData = [];
	let classInterestData = [];
    let isLoading = true;
	const subscription = Meteor.subscribe("school.getClassTypesByCategory", props.filters);
	Meteor.subscribe("classInterest.getClassInterest");

	classTypeData = ClassType.find().fetch();
	schoolData = School.find().fetch();
  	skillCategoryData = SkillCategory.find().fetch();
  	classTimesData = ClassTimes.find().fetch();
  	classInterestData = ClassInterest.find().fetch();

	/*Find SkillCategory,SkillSubject and SLocation to make this container reactive on these collection
  	other wise skills are joined with collections using package
  	perak:joins */
  	SkillSubject.find().fetch();
  	SLocation.find().fetch();

    if(subscription.ready()) {
        isLoading = false
    }
  	console.log("classInterestData --->>",classInterestData)
  	return {
  		...props,
  		classTypeData,
  		schoolData,
  		skillCategoryData,
  		classTimesData,
  		classInterestData,
        isLoading,
  	};

}, ClassTypeList);