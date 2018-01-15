import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Typography from 'material-ui/Typography';

import * as helpers from '../jss/helpers.js';

const Wrapper = styled.div`
  ${helpers.flexDirectionColumn}
  margin: ${helpers.rhythmDiv} 0;
  padding: ${helpers.rhythmDiv}px;

  @media screen and (max-width: ${helpers.tablet}px) {
      margin: 0;
  }
`;

const Title = styled.h3`
  font-family: ${helpers.specialFont};
  font-weight: 400;
  color: ${helpers.headingColor};
  font-size: ${helpers.baseFontSize * 1.25}px;
`;

const TextWrapper = styled.div`
  text-align: center;
`;

const SchoolAddress = (props) => (
  <Wrapper>
    <Title>Address</Title>
    <TextWrapper>
      {props.site && <Typography>{props.site}</Typography>}
      <Typography>{props.address}</Typography>
    </TextWrapper>
  </Wrapper>
);

SchoolAddress.propTypes = {
  site: PropTypes.string,
  address: PropTypes.string
}

SchoolAddress.defaultProps = {
  site: 'www.gracie.com',
  address: '123, anywhere St, San Diego Ca'
}

export default SchoolAddress;
