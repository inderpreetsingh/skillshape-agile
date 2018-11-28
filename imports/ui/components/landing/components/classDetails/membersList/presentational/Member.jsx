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
    backgroundColor: 'white',
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

  @media screen and (min-width: ${helpers.mobile - 50}px) {
    width: 160px;
    height: 180px;
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
  background-size: contain;
  width: 100px;
  height: 100px;
  display: flex;
  flex-shrink: 0;
  // padding: ${helpers.rhythmDiv}px ${helpers.rhythmDiv * 2}px;

  ${props => props.addMember &&
    `cursor: pointer; 
    background-size: 75px; 
    background-position: 50% 70%;`
  };
  @media screen and (min-width: ${helpers.mobile - 50}px) {
    width: 100%;
    margin-bottom: ${helpers.rhythmDiv * 2}px;
    flex-shrink: 1;
  }
`;

const DetailsWrapper = styled.div`
  ${helpers.flexCenter}
  width: 100%;
  flex-shrink: 1;
  justify-content: flex-start;
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

const Member = props => {
  const profile = props.profile;
  const profileSrc = props.addMember ? addInstructorImgSrc : get(profile, 'medium', get(profile, 'pic', config.defaultProfilePicOptimized))
  let name = `${get(profile, 'firstName', get(profile, 'name', 'Old Data'))} ${get(profile, 'lastName', "")}`;
  if (props.addMember) {
    name = props.type === 'instructor' ? 'Add Instructor' : 'Add Student';
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
      RenderActions: (
        <FormGhostButton label={'Ok'} onClick={() => { }} applyClose />
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
      _id: get(props.classData[0], "_id", 0),
      instructorIds: get(props, "instructorsIds", []),
      action: 'remove',
      classTimeId: get(props.classData[0], "classTimeId", 0)
    }
    popUp.appear("inform", {
      title: "Remove Instructor",
      content: `Remove this instructor to this class only, or to this and all future classes?`,
      RenderActions: (
        <div>
          <FormGhostButton label={'Cancel'} onClick={() => { }} applyClose />
          <FormGhostButton label={'Just to this instance'} onClick={() => { this.handleRemove(popUp, payLoad) }} applyClose />
          <FormGhostButton label={'Whole series'} onClick={() => { this.handleRemove(popUp, payLoad, "whole") }} applyClose />
        </div>
      )
    }, true);

  }
  handleRemove = (popUp, payLoad, from) => {
    if (!from) {
      Meteor.call("classes.handleInstructors", payLoad, (err, res) => {
        if (res) {
          this.removePopUp(popUp);
        }
      })
    }
    else {
      console.log("​payLoad.instructorIds -> payLoad.instructorIds", payLoad.instructorIds)
      payLoad.instructors = remove(payLoad.instructorIds, (n) => {
        return n != payLoad.instructorId;
      })
      console.log("​payLoad.instructorIds -> payLoad.instructorIds", payLoad.instructorIds)
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
        content: `Do you really want to remove from instructor list.`,
        RenderActions: (
          <div>
            <FormGhostButton label={'Cancel'} onClick={() => { }} applyClose />
            <FormGhostButton label={'Remove'}
              onClick={() => { this.handleRemoveInstructor(props) }}
              applyClose />
          </div>
        )
      }, true);
      ;
    }
  }

  return (
    <Wrapper>
      <Profile>
        <ProfilePic
          addMember={props.addMember}
          src={profileSrc}
          onClick={props.onAddIconClick}
        />
        <DetailsWrapper type={props.type}>
          <Details>
            <SubHeading fontSize="20">{cutString(name, 20)}</SubHeading>
            {props.type !== "student" &&
              !props.addMember && (
                <Text>
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
  );
};

Member.propTypes = {
  expanded: PropTypes.bool,
  showMoreOptions: PropTypes.bool,
  type: PropTypes.string //type can be student, teacher
};

export default withRouter(withStyles(styles)(Member));
