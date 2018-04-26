import React, { Component , Fragment } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import ClassInterest from "/imports/api/classInterest/fields";

import ClassTimesSlider from './ClassTimesSlider.jsx';
import ClassTimesBar from './ClassTimesBar.jsx';

import classTime from '../../constants/structure/classTime.js';
import * as helpers from '../jss/helpers.js';

const SliderWrapper = styled.div`
  display: none;
  @media screen and (max-width: ${helpers.mobile + 100}px ) {
    display: block;
  }
`;

const BarWrapper = styled.div`
  display: block;
  @media screen and (max-width: ${helpers.mobile + 100}px) {
    display: none;
  }
`;

class ClassTimesBoxes extends Component {

  checkForAddToCalender = (data) => {
    const userId = Meteor.userId();
    console.info('All the ClassInterest Data...',this.props.classInterestData,ClassInterest.find().fetch());
    // debugger;
    if(isEmpty(data) || isEmpty(userId)) {
        return true;
    } else {
        return isEmpty(ClassInterest.find({classTimeId: data._id}).fetch());
    }
  }

  render() {
    console.log("props in ClassTimesBoxes",this.props)
    const { classTimesData,
            classInterestData
          } = this.props;
    // console.log("ClassTimesBoxes props-->>",this.props, slider);

    const modifiedClassTimesData = classTimesData.map(data => {
      let addToCalendar = this.checkForAddToCalender(data);
      data.addToCalendar = addToCalendar;
      return data;
    });
    console.log('modifiedClassTimesData',modifiedClassTimesData);
    return (<Fragment>
        <SliderWrapper>
          <ClassTimesSlider
            data={modifiedClassTimesData}
            componentProps={{classInterestData: classInterestData}}
            padding={helpers.rhythmDiv} />
        </SliderWrapper>
        <BarWrapper>
          <ClassTimesBar
            classTimesData={modifiedClassTimesData}
            classInterestData={classInterestData}
          />
        </BarWrapper>
    </Fragment>)
  }
}

ClassTimesBoxes.propTypes = {
  classTimesData: PropTypes.arrayOf(classTime),
}

export default ClassTimesBoxes;
