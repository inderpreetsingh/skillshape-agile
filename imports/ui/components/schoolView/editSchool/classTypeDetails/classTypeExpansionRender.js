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

import {Text, GridMaxWidthWrapper, GridContainer, GridItem} from '/imports/ui/components/landing/components/jss/sharedStyledComponents.js';
import ClassTypeCard from "/imports/ui/components/landing/components/cards/ClassTypeCard.jsx";
import ClassTimeCard from "/imports/ui/components/landing/components/classTimes/ClassTime.jsx";

import Notification from "/imports/ui/components/landing/components/helpers/Notification.jsx";
import PrimaryButton from "/imports/ui/components/landing/components/buttons/PrimaryButton.jsx";
import FormGhostButton from "/imports/ui/components/landing/components/buttons/FormGhostButton.jsx";

import { getContainerMaxWidth } from "/imports/util";
import {rhythmDiv, flexCenter, primaryColor, mobile} from "/imports/ui/components/landing/components/jss/helpers.js";

const SPACING = rhythmDiv * 2;
const CARD_WIDTH = 280;

const CardsWrapper = styled.div``;

const Notifications = styled.div`
  display: flex;
  flex-direction: column;
`;

const PaperInner = styled.div`
  display: flex;
  justify-content: space-between;

  @media screen and (max-width: ${mobile + 100}px) {
    width: 100%;
    justify-content: space-evenly;
    margin-bottom: ${rhythmDiv}px;
  }
  `;

const NotificationWrapper = styled.div`
  margin-bottom: ${rhythmDiv}px;
`;

const IconWrapper = styled.div`
  ${flexCenter}
`;

const TextWrapper = styled.div`
  padding: 0 ${rhythmDiv * 4}px;
`;

const ExpansionsWrapper = styled.div`
  padding: ${rhythmDiv * 2}px;
`;

const ToggleVisibility = styled.div`
  display: ${props => props.hideOnSmall ? 'flex' : 'none'};
  
  @media screen and (max-width: ${mobile + 100}px) {
    display: ${props => props.hideOnSmall ? 'none' : 'flex'};
  }
`;

const TopBarButton = styled.div`
  flex-shrink: 0;
  align-self: center;
`;



const styles = {
  paperRoot: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',  
    background: primaryColor,
    padding: rhythmDiv,
    [`@media screen and (max-width: ${mobile + 100}px)`]: {
      flexDirection: 'column',
      justifyContent: 'center'
    } 
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
    onNotifyClassTypeUpdate,
    classTypeData,
    classes: { expansionPanelDetails, expansionPanelRoot, paperRoot, barIcon }
  } = props;

  return (
    <Fragment>
      <Paper className={paperRoot} elevation={1}>
        <PaperInner>
          <IconWrapper>
            <Icon className={barIcon}>{"class"}</Icon>
            <Text marginBottom="0" color="white">ClassType</Text>
          </IconWrapper>
          <ToggleVisibility hideOnSmall>
            <TextWrapper>
              <Text color="white">
                Class Types are a group of one or more Class Times where similar or related material is taught to students, possibly grouped by age, skill level, or gender. 
                If you separate classes by age, gender, skill level or material, separate Class Types should be created.
              </Text>
            </TextWrapper>
          </ToggleVisibility>
          <TopBarButton>
            <FormGhostButton
              whiteColor
              label={"Add Class Type"}
              onClick={onAddClassTypeClick}
            />  
          </TopBarButton>   
        </PaperInner>
        <ToggleVisibility>
          <TextWrapper>
            <Text color="white">
              Class Types are a group of one or more Class Times where similar or related material is taught to students, possibly grouped by age, skill level, or gender. 
              If you separate classes by age, gender, skill level or material, separate Class Types should be created.
            </Text>
          </TextWrapper>
        </ToggleVisibility>
      </Paper>    
      <ExpansionsWrapper>
      {classTypeData.map(cardData => (
        <ExpansionPanel className={expansionPanelRoot}>
          <ExpansionPanelSummary expandIcon={<Icon>{"expand_more"}</Icon>}>
            <Typography>{cardData.name}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={expansionPanelDetails}>
            <Notifications>
              <NotificationWrapper>
                <Notification
                  notificationContent="Pressing this button will inform students who are enrolled or
            interested in this class of any schedule changes. Please do not
            abuse this button."
                  buttonLabel="click to notify"
                  onButtonClick={onNotifyClassTypeUpdate(
                      cardData,
                      "classType.notifyToStudentForClassTimes",
                      "Class Times"
                    )
                  }
                  smallText
                  withCloseIcon={false}
                  bgColor={primaryColor}
                />
              </NotificationWrapper>
              <NotificationWrapper>
                <Notification
                  notificationContent="Pressing this button will inform students who are enrolled or
            interested in this class of any location changes. Please do not
            abuse this button."
                  buttonLabel="click to notify"
                  onButtonClick={onNotifyClassTypeUpdate(
                      cardData,
                      "classType.notifyToStudentForLocation",
                      "Class Location"
                    )
                  }
                  smallText
                  withCloseIcon={false}
                  bgColor={primaryColor}
                />
              </NotificationWrapper>
            </Notifications>

            <CardsWrapper>
                <GridMaxWidthWrapper>  
                  <GridContainer>
                    <GridItem spacing={SPACING} cardWidth={CARD_WIDTH} >
                      <ClassTypeCard 
                        editMode 
                        {...cardData}
                        onEditClassTypeClick={onEditClassTypeClick(cardData)} 
                      />  
                    </GridItem>
                    {getClassTimesData(cardData._id).map(classTimeObj => (
                      <GridItem key={classTimeObj._id} spacing={SPACING} cardWidth={CARD_WIDTH} inPopUp={false}>
                        <ClassTimeCard
                          {...classTimeObj}
                          onEditClassTimesClick={onEditClassTimesClick(cardData)}
                          editMode
                          inPopUp={false}
                          classTimeData={classTimeObj}
                        /> 
                      </GridItem>
                    ))}
                  </GridContainer>  
                </GridMaxWidthWrapper>
            </CardsWrapper>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
      </ExpansionsWrapper>        
    </Fragment>
  );
};

export default withStyles(styles)(ClassTypeExpansionRender);
