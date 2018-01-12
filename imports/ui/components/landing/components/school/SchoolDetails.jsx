import React from 'react';
import styled from 'styled-components';
import Typography from 'material-ui/Typography';
import { MuiThemeProvider} from 'material-ui/styles';

import PackageDetails from './PackageDetails';
import ContactSchoolButtons from './ContactSchoolButtons';
import SchoolAddress from './SchoolAddress';
import BasicDescription from './BasicDescription';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const SchoolDetails = () => (
  <MuiThemeProvider>
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
