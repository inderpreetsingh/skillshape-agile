import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';

import PriceCommon from './PriceCommon';
import PriceMonthly from './PriceMonthly';

import * as helpers from '../../jss/helpers.js';

const Container = styled.div`
  overflow: hidden;
`;

const Wrapper = styled.div`
  display: flex;

  @media screen and (max-width: ${helpers.tablet + 100}px) {
    flex-direction: column;
  }
`;

const Package = styled.div`
  width: calc(33% - ${helpers.rhythmDiv * 2}px);
  margin: ${helpers.rhythmDiv}px;

  @media screen and (max-width: ${helpers.tablet + 100}px) {
    width: 100%;
  }
`;

const PackageContainer = styled.div`
  width: 100%;
`;

const Title = styled.h2`
  color: ${helpers.headingColor};
  font-family: ${helpers.specialFont};
  text-align: center;
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const PackagesList = (props) => {
  const { priceComponent } = props
  return (
    <Wrapper>
      <Package>
        <PackageContainer>
          <Title>Enrollment Packages</Title>
          <Container>
            <Grid container>
              {props.enrollMentPackagesData && props.enrollMentPackagesData.map(data => (
                <Grid item sm={6} md={6} xs={12}>
                  <PriceCommon {...data} />
                </Grid>
              ))}
            </Grid>
          </Container>
        </PackageContainer>
      </Package>

        <Package>
          <PackageContainer>
            <Title>Per Class Packages</Title>
            <Container>
              <Grid container>
                {props.perClassPackagesData.map(data => (
                  <Grid item sm={6} md={6} xs={12}>
                    <PriceCommon packagePerClass={true} {...data} />
                  </Grid>
                ))}
              </Grid>
            </Container>
          </PackageContainer>
        </Package>

        <Package>
          <PackageContainer>
            <Title>Monthly Packages</Title>
            <Container>
              <Grid container>
                  {props.monthlyPackagesData.map(data => (
                    <Grid item sm={6} md={6} xs={12}>
                      <PriceMonthly {...data} />
                    </Grid>
                  ))}
              </Grid>
            </Container>
          </PackageContainer>
        </Package>

    </Wrapper>
  )
}

PackagesList.propTypes = {
  priceComponent: PropTypes.element,
  title: PropTypes.string
}

export default PackagesList;
