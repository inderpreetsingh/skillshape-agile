import React, { Component , Fragment } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import ClassInterest from "/imports/api/classInterest/fields";

import ClassTimesSlider from '/imports/ui/components/landing/components/classTimes/ClassTimesSlider.jsx';
import ClassTimesBar from '/imports/ui/components/landing/components/classTimes/ClassTimesBar.jsx';
import classTime from '/imports/ui/components/landing/constants/structure/classTime.js';

import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

const SliderWrapper = styled.div`
  display: none;
  @media screen and (max-width: ${helpers.mobile + 100}px ) {
    display: block;
  }
`;

const BarWrapper = styled.div`
  display: block;
  @media screen and (max-width: ${helpers.mobile + 100}px) {
    display: ${props => props.show ? 'none' : 'block'};
  }
`;

class ClassTimesBoxes extends Component {

  _checkForAddToCalender = (data) => {
    const userId = Meteor.userId();
    if(isEmpty(data) || isEmpty(userId)) {
        return true;
    } else {
        return isEmpty(ClassInterest.find({classTimeId: data._id}).fetch());
    }
  }

  render() {
    // console.log("props in ClassTimesBoxes",this.props)
    const { classTimesData,
            classInterestData,
            withSlider
          } = this.props;
    // console.log("ClassTimesBoxes props-->>",this.props, slider);

    const modifiedClassTimesData = classTimesData.map(data => {
      data.addToCalendar = this._checkForAddToCalender(data);
      return data;
    });
    // console.log('modifiedClassTimesData',modifiedClassTimesData);
    return (<Fragment>
        {withSlider && <SliderWrapper>
          <ClassTimesSlider
            data={modifiedClassTimesData}
            componentProps={{classInterestData: classInterestData}}
             />
        </SliderWrapper>}
        <BarWrapper show={withSlider}>
          <ClassTimesBar
            classTimesData={modifiedClassTimesData}
            classInterestData={classInterestData}
          />
        </BarWrapper>
    </Fragment>)
  }
}

ClassTimesBoxes.propTypes = {
  withSlider: PropTypes.bool,
  classTimesData: PropTypes.arrayOf(classTime),
}

ClassTimesBoxes.defaultProps = {
  withSlider: true
}

export default ClassTimesBoxes;
