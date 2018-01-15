import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';

import * as helpers from '../../jss/helpers.js';

const PackageContainer = styled.div`
  width: 100%;
`;

const Container = styled.div`
  overflow: hidden;
`;

const Title = styled.h2`
  color: ${helpers.headingColor};
  font-family: ${helpers.specialFont};
  text-align: center;
  font-weight: 500;
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const Package = (props) => {
  //console.log(props,'This props');
  const { priceComponent, perClassPackage, packagesData, title } = props;
  const PriceComponent = priceComponent;
  console.log(packagesData,perClassPackage);
  return(
    <PackageContainer>
      <ExpansionPanel defaultExpanded={true}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Title>{title}</Title>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Container>
            <Grid container>
              {packagesData ? packagesData.map(data => (
                <Grid item sm={12} md={6} xs={12}>
                  <PriceComponent perClassPackage={perClassPackage} {...data}/>
                </Grid>
              ))
              :
              (<Grid item xs={12}>
                <Typography> No package details currently </Typography>
              </Grid>)
            }
            </Grid>
          </Container>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </PackageContainer>
  )
}

export default Package;
