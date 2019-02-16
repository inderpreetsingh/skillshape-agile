import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { get, isEmpty, remove } from 'lodash';
import styled from "styled-components";
import { withStyles } from 'material-ui/styles';

import { cutString } from '/imports/util';
import DropDownMenu from "/imports/ui/components/landing/components/form/DropDownMenu.jsx";
import FormGhostButton from '/imports/ui/components/landing/components/buttons/FormGhostButton.jsx';
import { Capitalize, SubHeading, Text } from "/imports/ui/components/landing/components/jss/sharedStyledComponents.js";
import MemberExpanded from "./MemberExpanded.jsx";
import { AnimateOnChange } from '@nearform/react-animation'
import ProgressiveImage from "react-progressive-image";

import { addInstructorImgSrc } from "/imports/ui/components/landing/site-settings.js";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";

const menuOptions = [
  {
    name: "Remove Teacher",
    value: "remove_teacher"
  }
];

const styles = {
  menuButtonClass: {
    cursor: "pointer",
    width: 24,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '50%',
    fontSize: helpers.baseFontSize,
    position: 'absolute',
    top: 8,
    right: 8,
    [`@media screen and (max-width : ${helpers.mobile}px)`]: {
      top: '50%',
      right: 16,
      transform: 'translateY(-50%)',
    },
  },
  menuIconClass: {
    height: 24,
    width: 24,
  }
};

const Wrapper = styled.div`
  background: ${helpers.panelColor};
  display: flex;
  position: relative;
  width: 100%;
  height: auto;
  ${props => props.addMember && `align-items: center;`}
  ${props => props.addMember && 'pointer: cursor;'}

  @media screen and (min-width: ${helpers.mobile - 50}px) {
    width: 160px;
    height: 250px;
  }
`;

const Profile = styled.div`
  ${helpers.flexCenter}
  padding: ${helpers.rhythmDiv}px  ${helpers.rhythmDiv * 2}px;
  width: 100%;
  flex-grow: 1; 
  flex-shrink: 1;
  padding-top: 0;
  padding: ${helpers.rhythmDiv * 2}px;

  @media screen and (min-width: ${helpers.mobile - 50}px) {
    flex-direction: column;
    justify-content: flex-start;  
    flex-shrink: 0;
    padding: 0;
  }
`;

const ProfilePic = styled.div`
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: cover;
  width: 100px;
  height: 140px;
  display: flex;
  flex-shrink: 0;
  // padding: ${helpers.rhythmDiv}px ${helpers.rhythmDiv * 2}px;

  ${props => props.addMember &&
    `cursor: pointer;
    width: 75px;
    height: 75px; 
    background-size: 75px; 
    background-position: 50% 70%;`
  };
  @media screen and (min-width: ${helpers.mobile - 50}px) {
    width: 100%;
    margin-bottom: ${helpers.rhythmDiv * 2}px;
    flex-shrink: 1;
    ${props => props.addMember && `height: 100px;`
  };
  }
`;

const DetailsWrapper = styled.div`
  ${helpers.flexCenter}
  width: 100%;
  flex-shrink: 1;
  justify-content: center;
  padding: ${helpers.rhythmDiv * 2}px;
  // padding-left: ${helpers.rhythmDiv * 2}px;

  @media screen and (min-width: ${helpers.mobile - 50}px) {
    flex-shrink: 0;
    padding-top: 0;
    justify-content: center;
  }
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const StudentNotes = styled.div`
  padding: ${helpers.rhythmDiv * 2}px;
  display: flex;
  min-width: 0;
`;

const StudentNotesContent = styled.textarea`
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize}px;
  font-style: italic;
  height: 100%;
  border-radius: 5px;
`;

const Status = styled.div`
  padding: ${helpers.rhythmDiv * 2}px;
  min-width: 0;
`;

/* prettier-ignore */

const ExpiresOn = Designation = Text.extend`
  font-style: italic;
  font-weight: 300;
`;

const onMenuItemClick = value => {
  if (value === "remove_teacher") {
    props.history.push("/remove_teacher");
  } else {
    props.history.push("/some-random-link");
  }
};

const ButtonsWrapper = styled.div`
  width: 100%;
  flex-wrap: wrap;
  ${helpers.flexCenter}
`;

const ButtonWrapper = styled.div`
  display: flex;
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const Member = props => {
  const profile = props.profile;
  const profileSrc = props.addMember ? addInstructorImgSrc : get(profile, 'medium', get(profile, 'pic', config.defaultProfilePicOptimized))
  let name = `${get(profile, 'firstName', get(profile, 'name', 'Old Data'))} ${get(profile, 'lastName', "")}`;
  if (props.addMember) {
    name = props.type === 'instructor' ? 'Add Instructor' : 'Add Student';
    if (props.type == 'joinClass') {
      name = 'Join Class'
    }
  }
  // This is the basic card returned for students in case the view
  // is not instructorsView && for teachers in both the cases.

  if (props.type === "student" && props.viewType === "instructorsView") {
    return <MemberExpanded {...props} />;
  }
  removePopUp = (popUp, classTime) => {
    popUp.appear("success", {
      title: "Removed Successfully",
      content: <div>Successfully removed from instructor listing.<br /> {classTime ? 'Changes will show in the Class Times Editor after saving.' : ''}</div>,
      RenderActions: (<ButtonsWrapper>
        <ButtonWrapper>
          <FormGhostButton label={'Ok'} onClick={() => { }} applyClose />
        </ButtonWrapper>
      </ButtonsWrapper>
      )
    }, true);
  }
  handleRemoveInstructor = (props) => {
    let { popUp } = props;
    if (props.classTimeForm) {
      props.instructorsIdsSetter(get(props, '_id', 0), 'remove');
      this.removePopUp(popUp, true);
      return;
    }
    let payLoad = {
      instructorId: get(props, '_id', 0),
      _id: get(props.classData, "_id", 0),
      instructorIds: get(props, "instructorsIds", []),
      action: 'remove',
      schoolId: get(props.classData, 'schoolId', 0),
      classTimeId: get(props.classData, "classTimeId", 0)
    }
    popUp.appear("inform", {
      title: "Remove Instructor",
      content: `Remove this instructor to this class only, or to this and all future classes?`,
      RenderActions: (
        <ButtonsWrapper>
          <ButtonWrapper>
            <FormGhostButton label={'Cancel'} onClick={() => { }} applyClose />
          </ButtonWrapper>
          <ButtonWrapper>
            <FormGhostButton label={'Just to this instance'} onClick={() => { this.handleRemove(popUp, payLoad) }} applyClose />
          </ButtonWrapper>
          <ButtonWrapper>
            <FormGhostButton label={'Whole series'} onClick={() => { this.handleRemove(popUp, payLoad, "whole") }} applyClose />
          </ButtonWrapper>
        </ButtonsWrapper>
      )
    }, true);

  }
  handleRemove = (popUp, payLoad, from) => {
    console.log('TCL: handleRemove -> payLoad, from)', payLoad, from)
    if (!from) {
      Meteor.call("classes.handleInstructors", payLoad, (err, res) => {
        if (res) {
          this.removePopUp(popUp);
        }
      })
    }
    else {
      payLoad.instructors = remove(payLoad.instructorIds, (n) => {
        return n != payLoad.instructorId;
      })
      Meteor.call("classTimes.editClassTimes", { doc_id: payLoad.classTimeId, doc: payLoad }, (err, res) => {
        if (res) {
          this.removePopUp(popUp);
        }
      })
    }

  }
  handleMenuItemClick = (option) => {
    let { popUp } = props;
    let operation = get(option, 'value', null);
    if (operation == 'remove_teacher') {
      popUp.appear("inform", {
        title: "Confirmation",
        content: `Do you really want to remove from instructor list ?`,
        RenderActions: (
          <ButtonsWrapper>
            <ButtonWrapper>
              <FormGhostButton alertColor label={'Remove'}
                onClick={() => { this.handleRemoveInstructor(props) }}
                applyClose />
            </ButtonWrapper>
            <ButtonWrapper>
              <FormGhostButton label={'Cancel'} onClick={() => { }} applyClose />
            </ButtonWrapper>
          </ButtonsWrapper>
        )
      }, true);
      ;
    }
  }

  return (
    <AnimateOnChange
      animationIn="bounceIn"
      animationOut="bounceOut"
      durationOut={500}
    >
      <Wrapper
        addMember={props.addMember}
        onClick={props.addMember ? props.onAddIconClick : () => { }}>
        <Profile>
          <ProgressiveImage
            src={profileSrc}
            placeholder={config.blurImage}>
            {(profileSrc) => <ProfilePic
              addMember={props.addMember}
              src={profileSrc}
              onClick={props.onAddIconClick}
            />}
          </ProgressiveImage>

          <DetailsWrapper type={props.type}>
            <Details>
              <SubHeading align="center" fontSize="20">{cutString(name, 20)}</SubHeading>
              {props.type !== "student" &&
                !props.addMember && (
                  <Text align="center">
                    <Capitalize>{props.designation}</Capitalize>
                  </Text>
                )}
            </Details>
          </DetailsWrapper>
          {props.viewType === "instructorsView" &&
            !props.addMember && <DropDownMenu
              menuIconClass={props.classes.menuIconClass}
              menuButtonClass={props.classes.menuButtonClass}
              menuOptions={menuOptions}
              onMenuItemClick={this.handleMenuItemClick}
            />}
        </Profile>
      </Wrapper>
    </AnimateOnChange>
  );
};

Member.propTypes = {
  expanded: PropTypes.bool,
  showMoreOptions: PropTypes.bool,
  type: PropTypes.string //type can be student, teacher
};

export default withRouter(withStyles(styles)(Member));
