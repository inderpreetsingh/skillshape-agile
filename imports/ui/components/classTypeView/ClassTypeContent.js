import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isEmpty, get } from 'lodash';
import Typography from 'material-ui/Typography';

import Preloader from '/imports/ui/components/landing/components/Preloader.jsx';
import ClassTypeCover from '/imports/ui/components/landing/components/class/cover/ClassTypeCover.jsx';
import ClassTypeCoverContent from '/imports/ui/components/landing/components/class/cover/ClassTypeCoverContent.jsx';
import reviewsData from '/imports/ui/components/landing/constants/reviewsData.js';
import ReviewsSlider from '/imports/ui/components/landing/components/class/ReviewsSlider.jsx';
import ClassTimesBoxes from '/imports/ui/components/landing/components/classTimes/ClassTimesBoxes';

import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

const SchoolImgWrapper = styled.div`
  height: 400px;
`;

const SchoolImg = styled.img`
  width: 100%;
  height: 100%;
`;


const Main = styled.main`
  width: 100%;

  @media screen and (max-width: ${helpers.mobile}px) {
    overflow: hidden;
  }
`;

const MainInnerFixedContainer = styled.div`
  max-width: ${props => props.fixedWidth ? props.fixedWidth : helpers.maxContainerWidth}px;
  width: 100%;
  margin: 0 auto;
  margin-bottom: ${props => props.marginBottom ? props.marginBottom : helpers.rhythmDiv * 2}px;
`;

const MainInner = styled.div`
  padding: ${props => props.largePadding ? props.largePadding : helpers.rhythmDiv * 2}px;
  overflow: ${props => (props.reviews || props.classTimes) ? 'hidden' : 'initial' };

  @media screen and (max-width : ${helpers.mobile}px) {
    padding: ${props => props.smallPadding ? props.smallPadding : helpers.rhythmDiv * 2}px;
  }
`;

const ClassTypeDetailsWrapper = styled.div`
  ${helpers.flexDirectionColumn}
`;

const DescriptionText = styled.p`
  font-family: ${helpers.commonFont};
  font-size: ${helpers.baseFontSize}px;
  line-height: 1;
`;

const ClassWrapper = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;

  @media screen and (max-width: ${helpers.mobile + 100}px) {
    padding-bottom: ${props => props.paddingBottom ? props.paddingBottom: 0}px;
  }
`;

const ClassTimesWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv * 4}px;

  @media screen and (max-width: ${helpers.mobile + 100}px) {
    padding-bottom: ${props => props.paddingBottom ? props.paddingBottom: 0}px;
    margin-bottom: 0;
  }

  @media screen and (max-width: ${helpers.mobile}px) {
    padding-bottom: ${helpers.rhythmDiv * 4}px;
  }
`;

const ClassTimesInnerWrapper = styled.div`
  padding: 0px;
  overflow: hidden;

  @media screen and (max-width : ${helpers.mobile}px) {
    padding: ${props => props.smallPadding ? props.smallPadding : helpers.rhythmDiv * 2}px;
    padding-top: 0;
  }
`;

const ClassTimesTitle = styled.h2`
  text-align: center;
  font-size: ${helpers.baseFontSize * 2}px;
  font-family: ${helpers.specialFont};
  font-weight: 300;
  font-style: italic;
  line-height: 1;
  margin: 0;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
  padding: 0;

  @media screen and (max-width: ${helpers.mobile + 100}px) {
    margin-bottom: ${helpers.rhythmDiv * 4}px;
  }
`;

const PackagesWrapper = styled.div`
  ${helpers.flexDirectionColumn}
  width: 100%;
  margin-bottom: ${helpers.rhythmDiv * 8}px;
`;

const PackagesTitle = styled.h2`
  text-align: center;
  font-size: ${helpers.baseFontSize * 2}px;
  font-family: ${helpers.specialFont};
  font-weight: 300;
  font-style: italic;
  margin: 0;
  line-height: 1;
  margin-bottom: ${helpers.rhythmDiv * 4}px;
  padding: 0 ${helpers.rhythmDiv * 2}px;
`;

const CalendarWrapper = styled.div`
   _box-shadow: 0px 0px 5px 1px rgba(221,221,221,1);
   border: 1px solid rgba(221,221,221,1);
`;

class ClassTypeContent extends Component {

	render() {
		console.log("ClassTypeContent props --->>",this.props);

		const {
			isLoading,
			schoolData,
			classTypeData,
			classTimesData,
		} = this.props;

		if(isLoading) {
			return <Preloader/>
		}

		if(isEmpty(classTypeData)) {
			return <Typography type="display2" gutterBottom align="center">
            	Class Type not found!!!
        	</Typography>
		}

		return (
			<Fragment>
				{/* Class Type Cover includes description, map, foreground image, then class type information*/}
		        <ClassTypeCover coverSrc={classTypeData.classTypeImg}>
			        <ClassTypeCoverContent
			        	coverSrc={classTypeData.classTypeImg}
			            schoolDetails={{...schoolData}}
			            classTypeData={{...classTypeData}}
			            onCallUsButtonClick={this.props.onCallUsButtonClick}
			            onEmailButtonClick={this.props.onEmailButtonClick}
			            onPricingButtonClick={this.props.onPricingButtonClick}
			        />
		        </ClassTypeCover>
		        <Main>
			        <MainInnerFixedContainer marginBottom="32">
			            <MainInner reviews largePadding="32" smallPadding="32">
			              	<ClassWrapper reviews>
			                	<ReviewsSlider data={reviewsData} padding={helpers.rhythmDiv * 2}/>
			              	</ClassWrapper>
			            </MainInner>
          			</MainInnerFixedContainer>

          			<MainInnerFixedContainer marginBottom="16">
			            <ClassTimesInnerWrapper>
			                <ClassTimesWrapper paddingBottom="48">
			                	<ClassTimesTitle>Class timings for {classTypeData.name}</ClassTimesTitle>
			                	<ClassTimesBoxes classTimesData={classTimesData} />
			                </ClassTimesWrapper>
			            </ClassTimesInnerWrapper>
			        </MainInnerFixedContainer>

		        </Main>
			</Fragment>
		)
	}
}

export default ClassTypeContent;