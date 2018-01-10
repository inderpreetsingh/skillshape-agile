import React, {Component} from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import styled from 'styled-components';
import { findIndex, isEmpty } from 'lodash';

import ClassMap from '../map/ClassMap.jsx';
import CardsList from '../cards/CardsList.jsx';
import { cardsData, cardsData1} from '../../constants/cardsData.js';

// import collection definition over here
import ClassType from "/imports/api/classType/fields";
import School from "/imports/api/school/fields";
import SLocation from "/imports/api/sLocation/fields";
import SkillCategory from "/imports/api/skillCategory/fields";
import SkillSubject from "/imports/api/skillSubject/fields";
import ClassTimes from "/imports/api/classTimes/fields";

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
  		// console.log("showClassTypes classType -->>>",classType, this.props.locationName)
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
                        locationName={this.props.locationName}
                	/>
  				}
  			})
  		}
  	}

	render() {
		console.log("ClassTypeList props -->>",this.props);
		const { mapView, classTypeData, skillCategoryData } = this.props;

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
                        	{/*<CardsList
                        		mapView={mapView}
                        		title={'Yoga in Delhi'}
                        		name={'yoga-in-delhi'}
                        		cardsData={cardsData}
                        	/>*/}
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
	Meteor.subscribe("school.getClassTypesByCategory", props.filters);

	classTypeData = ClassType.find().fetch();
	schoolData = School.find().fetch();
  	skillCategoryData = SkillCategory.find().fetch();
  	classTimesData = ClassTimes.find().fetch();

	/*Find SkillCategory,SkillSubject and SLocation to make this container reactive on these collection
  	other wise skills are joined with collections using package
  	perak:joins */
  	SkillSubject.find().fetch();
  	SLocation.find().fetch();

  	return {
  		...props,
  		classTypeData,
  		schoolData,
  		skillCategoryData,
  		classTimesData,
  	};

}, ClassTypeList);