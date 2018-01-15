import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Chip from 'material-ui/Chip';
import Typography from 'material-ui/Typography';
import {withStyles} from 'material-ui/styles';

import PrimaryButton from '../buttons/PrimaryButton';
import SecondaryButton from '../buttons/SecondaryButton';

import * as helpers from '../jss/helpers.js';

const styles = {
  chip: {
    background: helpers.lightTextColor,
    marginRight: helpers.rhythmDiv
  },
  chipLabel: {
    color: helpers.textColor,
    fontSize: helpers.baseFontSize * 0.75
  }
};

const ClassContainer = styled.div`
  padding: ${helpers.rhythmDiv}px;
  margin: ${helpers.rhythmDiv}px;
  border-radius: ${helpers.rhythmDiv}px;
  ${helpers.flexDirectionColumn}
  justify-content: space-between;
  border: 1px solid ${helpers.panelColor};
`;

const ClassContainerHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${helpers.rhythmDiv}px;

  @media screen and (max-width: ${helpers.mobile}px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ClassTimings = styled.p`
  margin: 0 ${helpers.rhythmDiv}px 0 0;
  font-weight: 600;
  color: ${helpers.headingColor};
`;

const CalenderButtonWrapper = styled.div`
  margin: ${helpers.rhythmDiv} 0 0 0;
  ${helpers.flexCenter}
  justify-content: flex-end;
`;

const ClassTime = (props) => (
  <ClassContainer>

      <ClassContainerHeader>

          <ClassTimings>
              {props.timing}
          </ClassTimings>

          <Chip label={props.scheduleType} classes={{root: props.classes.chip, label: props.classes.chipLabel}}/>
      </ClassContainerHeader>

      <Typography>
        {props.description}
      </Typography>

      <CalenderButtonWrapper>
          {props.addToCalender ?
            <PrimaryButton
              icon
              onClick={props.onAddToMyCalenderButtonClick}
              iconName="perm_contact_calendar"
              label="Add to my Calender"
            />
          : <SecondaryButton
              icon
              onClick={props.onRemoveFromCalenderButtonClick}
              iconName="delete"
              label="Remove from my Calender"
            />
          }
      </CalenderButtonWrapper>
  </ClassContainer>
);

export default withStyles(styles)(ClassTime);
