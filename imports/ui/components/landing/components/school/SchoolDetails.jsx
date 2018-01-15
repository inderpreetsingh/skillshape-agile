import React from 'react';
import styled from 'styled-components';

import { MuiThemeProvider } from 'material-ui/styles';
import Typography from 'material-ui/Typography';

import PackageDetails from './PackageDetails';
import ContactSchoolButtons from './ContactSchoolButtons';
import SchoolAddress from './SchoolAddress';
import BasicDescription from './BasicDescription';

import * as helpers from '../jss/helpers.js';
import muiTheme from '../jss/muitheme.jsx';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Text = styled.p`
  font-family: ${helpers.commonFont};
  margin-top: 0;
  color: ${helpers.textColor};
`;

const SchoolDetails = () => (
  <MuiThemeProvider theme={muiTheme}>
    <Wrapper>
      <ContactSchoolButtons />

      <PackageDetails />

      <SchoolAddress />

      <BasicDescription title="Gracie University">
        <Typography>Our school will build your skills, ability to learn and confidence</Typography>
        <Typography>Started in 1999, by Prince Nelson, we have trained so many stars.</Typography>
      </BasicDescription>

      <BasicDescription title="Notes for Students">
        <Typography>Check your ego at the door, treat everyone with respect.</Typography>
        <Typography>No shoes on the mat</Typography>
        <Typography>Lockers are available</Typography>
        <Typography>Have fun!!</Typography>
      </BasicDescription>
    </Wrapper>
  </MuiThemeProvider>
);

export default SchoolDetails;
