import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { MuiThemeProvider } from 'material-ui/styles';
import Typography from 'material-ui/Typography';

import ClassPackageDetails from './ClassPackageDetails';
import ContactSchoolButtons from './ContactSchoolButtons';
import SchoolAddress from './SchoolAddress';
import BasicDescription from '../BasicDescription';

import * as helpers from '../../jss/helpers.js';
import muiTheme from '../../jss/muitheme.jsx';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Text = styled.p`
  font-family: ${helpers.commonFont};
  margin-top: 0;
  color: ${helpers.textColor};
`;

const SchoolDetails = (props) => (
  <MuiThemeProvider theme={muiTheme}>
    <Wrapper>
      <ContactSchoolButtons />

      <ClassPackageDetails />

      <SchoolAddress />

      <BasicDescription title={props.schoolName}>
        {props.schoolDescription ||
        ( <Fragment>
            <Typography>Our school will build your skills, ability to learn and confidence</Typography>
            <Typography>Started in 1999, by Prince Nelson, we have trained so many stars.</Typography>
          </Fragment>
      )}
      </BasicDescription>

      <BasicDescription title={props.notesTitle}>
        {props.notes ||
        ( <Fragment>
          <Typography>Check your ego at the door, treat everyone with respect.</Typography>
          <Typography>No shoes on the mat</Typography>
          <Typography>Lockers are available</Typography>
          <Typography>Have fun!!</Typography>
        </Fragment>)
      }
      </BasicDescription>
    </Wrapper>
  </MuiThemeProvider>
);

SchoolDetails.propTypes = {
  schoolName: PropTypes.string,
  notesTitle: PropTypes.string,
  schoolDescription: PropTypes.oneOfType([PropTypes.string,PropTypes.element]),
  notes: PropTypes.oneOfType([PropTypes.string,PropTypes.element]),
}

SchoolDetails.defaultProps = {
  schoolName: 'Gracia University',
  notesTitle: 'Notes for Students'
}

export default SchoolDetails;
