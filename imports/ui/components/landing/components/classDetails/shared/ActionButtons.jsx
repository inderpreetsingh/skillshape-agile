import React from "react";
// import Meteor from "meteor/meteor";
import PropTypes from "prop-types";
import styled from "styled-components";
import ClassTimeButton from "/imports/ui/components/landing/components/buttons/ClassTimeButton.jsx";
import {goToClassTypePage} from '/imports/util';
import {
  rhythmDiv,
  mobile,
  tablet
} from "/imports/ui/components/landing/components/jss/helpers.js";
import { browserHistory } from 'react-router';
// console.log(Meteor, Meteor.absoluteUrl);
//const APP_URL = Meteor.absoluteUrl();

const OuterWrapper = styled.div`
  width: 100%;
  display: flex;
`;

const Wrapper = styled.div`
  padding: 0 ${rhythmDiv * 2}px;
  display: inline-flex;
  flex-wrap: wrap;
  align-items: flex-start;
  margin: 0 auto ${rhythmDiv * 8}px; auto;

  @media screen and (min-width: ${mobile - 100}px) {
    width: 100%;
    justify-content: space-evenly;
  }

  @media screen and (min-width: ${tablet}px) {
    justify-content: flex-end;
    padding: 0 ${rhythmDiv}px;
    margin-bottom: ${rhythmDiv * 2}px;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;

  @media screen and (min-width: ${tablet}px) {
    ${props => props.marginBottom && `margin-bottom: ${rhythmDiv}px;`};
  }

  @media screen and (min-width: 300px) and (max-width: 400px) {
    margin-right: ${rhythmDiv}px;
    ${props => props.marginBottom && `margin-bottom: ${rhythmDiv}px;`};
  }
`;

const ActionButtons = props => (
  <OuterWrapper>
    <Wrapper>
      <ButtonWrapper marginBottom>
        <ClassTimeButton label="Visit Classtype" 
        onClick={()=>{goToClassTypePage(props.classTypeName,props.classTypeId)}}/>
      </ButtonWrapper>
      <ButtonWrapper>
        <ClassTimeButton label="Visit School" onClick={()=>{  
         browserHistory.push(`/schools/${props.slug}`)
         }}/>
      </ButtonWrapper>
      {/*<Link
        to={
          "#" ||
          `/classType/my_class/${props.classTypeId}`
        }
        target="_blank"
      >
      </Link>
      <Link
        to={"#" || `/schools/${props.schoolName}`}
        target="_blank"
      >

      </Link> */}

      {/*<ButtonWrapper>
        <PrimaryButton
          label="Schedule"
          icon
          iconName="schedule"
          onClick={props.onScheduleButtonClick}
        />
      </ButtonWrapper> */}
    </Wrapper>
  </OuterWrapper>
);

ActionButtons.propTypes = {
  classTypeId: PropTypes.string,
  schoolName: PropTypes.string,
  onScheduleButtonClick: PropTypes.func
};

ActionButtons.defaultProps = {};

export default ActionButtons;
