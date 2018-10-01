import React, { Fragment } from "react";
import { withStyles } from "material-ui/styles";
import styled from "styled-components";
import Typography from "material-ui/Typography";
import Icon from "material-ui/Icon";

import ExpansionPanel, {
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  ExpansionPanelActions
} from "material-ui/ExpansionPanel";

import ClassTypeCard from "/imports/ui/components/landing/components/cards/ClassTypeCard.jsx";
import CardsList from "/imports/ui/components/landing/components/cards/CardsList.jsx";
import ClassTimesBoxes from "/imports/ui/components/landing/components/classTimes/ClassTimesBoxes.jsx";

import Notification from "/imports/ui/components/landing/components/helpers/Notification.jsx";
import PrimaryButton from "/imports/ui/components/landing/components/buttons/PrimaryButton.jsx";

import {rhythmDiv, primaryColor} from "/imports/ui/components/landing/components/jss/helpers.js";

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

const styles = {
  expansionPanelDetails: {
    display: "flex",
    flexDirection: "column"
  }
};

const ClassTypeExpansionRender = props => {
  const {

    getClassTimesData,
    onEditClassTimesClick,
    classTypeData,
    classes: { expansionPanelDetails }
  } = props;

  return (
    <Fragment>
      {classTypeData.map(cardData => (
        <ExpansionPanel>
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
                <ClassTypeCard editMode {...cardData} />
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
    </Fragment>
  );
};

export default withStyles(styles)(ClassTypeExpansionRender);
