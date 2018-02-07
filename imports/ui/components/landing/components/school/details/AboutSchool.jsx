import React from 'react';
import styled from 'styled-components';
import ReactStars from 'react-stars';
import PropTypes from 'prop-types';

import * as helpers from '../../jss/helpers.js';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const Title = styled.h2`
  font-size: ${helpers.baseFontSize * 2}px;
  font-family: ${helpers.specialFont};
  color: ${helpers.primaryColor};
  margin: 0;
  margin-bottom: ${helpers.rhythmDiv/2}px;
  font-weight: 300;
  line-height: 1;
`;

const Description = styled.p`
  margin: 0;
  font-size: ${helpers.baseFontSize}px;
  font-family: ${helpers.specialFont};
  line-height: 1;
`;

const SchoolWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const Address = styled.address`
  font-weight: 300;
  font-style: italic;
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize}px;
  line-height: 1;
`;

const Website = styled.a`
  line-height: 1;
  color: inherit;
`;

const Postal = styled.p`
  margin: 0;
  line-height: 1;
`;

const addHttpProtocol = (website) => {
  if(website.match('http')) {
    return website;
  }
  return 'https://'+website;
}

const AboutSchool = (props) => (
  <Wrapper>
    <SchoolWrapper>
      <Title>About {props.title}</Title>
      <Address>
        {props.address && <Postal>{props.address}</Postal>}
        {props.website && <Website href={addHttpProtocol(props.website)} target="_blank"> {props.website} </Website>}
      </Address>
    </SchoolWrapper>
    <Description>{props.description}</Description>
  </Wrapper>
);

AboutSchool.propTypes = {
  title: PropTypes.string,
  address: PropTypes.string,
  website: PropTypes.string,
  description: PropTypes.string
}

export default AboutSchool;
