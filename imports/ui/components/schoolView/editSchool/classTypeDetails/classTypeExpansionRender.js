import React, { Fragment } from "react";
import { withStyles } from "material-ui/styles";
import styled from "styled-components";
import Typography from "material-ui/Typography";
import Icon from "material-ui/Icon";
import Paper from 'material-ui/Paper';

import ExpansionPanel, {
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  ExpansionPanelActions
} from "material-ui/ExpansionPanel";

import {Text} from '/imports/ui/components/landing/components/jss/sharedStyledComponents.js';
import ClassTypeCard from "/imports/ui/components/landing/components/cards/ClassTypeCard.jsx";
import CardsList from "/imports/ui/components/landing/components/cards/CardsList.jsx";
import ClassTimesBoxes from "/imports/ui/components/landing/components/classTimes/ClassTimesBoxes.jsx";

import Notification from "/imports/ui/components/landing/components/helpers/Notification.jsx";
import PrimaryButton from "/imports/ui/components/landing/components/buttons/PrimaryButton.jsx";
import FormGhostButton from "/imports/ui/components/landing/components/buttons/FormGhostButton.jsx";

import {rhythmDiv, flexCenter, primaryColor} from "/imports/ui/components/landing/components/jss/helpers.js";

const CARD_WIDTH = 280;

const CardsWrapper = styled.div``;

const ClassTypeCardWrapper = styled.div`
  max-width: ${CARD_WIDTH}px;
`;

const Notifications = styled.div`
  display: flex;
  flex-direction: column;
`;

const NotificationWrapper = styled.div`
  margin-bottom: ${rhythmDiv}px;
`;

const IconWrapper = styled.div`
  ${flexCenter}
`;

const TextWrapper = styled.div`
  max-width: 50%;
`;

const ExpansionsWrapper = styled.div`
  padding: ${rhythmDiv * 2}px;
`;

const styles = {
  paperRoot: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',  
    background: primaryColor,
    padding: rhythmDiv
  }, 
  barIcon: {
    color: 'white',
  },
  expansionPanelRoot: {
    marginBottom: rhythmDiv,
  },
  expansionPanelDetails: {
    display: "flex",
    flexDirection: "column"
  }
};


const ClassTypeExpansionRender = props => {
  const {
    getClassTimesData,
    onAddClassTypeClick,
    onEditClassTypeClick,
    onEditClassTimesClick,
    classTypeData,
    classes: { expansionPanelDetails, expansionPanelRoot, paperRoot, barIcon }
  } = props;

  return (
    <Fragment>
      <Paper className={paperRoot} elevation={1}>
        <IconWrapper>
          <Icon className={barIcon}>{"class"}</Icon>
          <Text marginBottom="0" color="white">ClassType</Text>
        </IconWrapper>
        <TextWrapper>
          <Text color="white">
            Class Types are a group of one or more Class Times where similar or related material is taught to students, possibly grouped by age, skill level, or gender. 
            If you separate classes by age, gender, skill level or material, separate Class Types should be created.
          </Text>
        </TextWrapper>
        <FormGhostButton
          whiteColor
          label={"Add Class Type"}
          onClick={onAddClassTypeClick}
        />      
      </Paper>    
      <ExpansionsWrapper>
      {classTypeData.map(cardData => (
        <ExpansionPanel className={expansionPanelRoot}>
          <ExpansionPanelSummary expandIcon={<Icon>{"expand_more"}</Icon>}>
            <Typography>Class Type Data</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={expansionPanelDetails}>
            <Notifications>
              <NotificationWrapper>
                <Notification
                  notificationContent="Pressing this button will inform students who are enrolled or
            interested in this class of any schedule changes. Please do not
            abuse this button."
                  buttonLabel="click to notify"
                  onButtonClick={() => {
                    props.handleNotifyClassTypeUpdate(
                      tableData,
                      "classType.notifyToStudentForClassTimes"
                    );
                  }}
                  bgColor={primaryColor}
                />
              </NotificationWrapper>
              <NotificationWrapper>
                <Notification
                  notificationContent="Pressing this button will inform students who are enrolled or
            interested in this class of any location changes. Please do not
            abuse this button."
                  buttonLabel="click to notify"
                  onButtonClick={() => {
                    props.handleNotifyClassTypeUpdate(
                      tableData,
                      "classType.notifyToStudentForClassTimes"
                    );
                  }}
                  bgColor={primaryColor}
                />
              </NotificationWrapper>
            </Notifications>

            <CardsWrapper>
              <ClassTypeCardWrapper>
                <ClassTypeCard 
                   editMode 
                   {...cardData}
                   onEditClassTypeClick={onEditClassTypeClick(cardData)} 
                   />
              </ClassTypeCardWrapper>
              {
                <ClassTimesBoxes
                  editMode
                  onEditClassTimesClick={onEditClassTimesClick(cardData)}
                  classTimesData={getClassTimesData(cardData._id)}
                  inPopUp={false}
                  withSlider={false}
                />
              }
            </CardsWrapper>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
      </ExpansionsWrapper>        
    </Fragment>
  );
};

export default withStyles(styles)(ClassTypeExpansionRender);
