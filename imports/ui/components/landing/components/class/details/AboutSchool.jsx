import React from 'react';
import styled from 'styled-components';
import ReactStars from 'react-stars';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';

import { cutString } from '/imports/util';

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
  font-weight: 300;
  line-height: 1;
  text-transform: capitalize;
  text-align: center;
`;

const Description = styled.p`
  margin: 0;
  font-size: ${helpers.baseFontSize}px;
  font-family: ${helpers.specialFont};
  line-height: 1;
  text-align: justify;
  padding: 0px 44px;
`;

const SchoolWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const Address = styled.address`
  font-weight: 300;
  font-style: italic;
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize}px;
  line-height: 1;
  text-align: center;
`;

const Website = styled.a`
  line-height: 1;
  color: inherit;
`;

const Postal = styled.p`
  margin: 0;
  line-height: 1;
`;

const Heading = styled.h2`
  text-align: center;
  font-size: ${helpers.baseFontSize * 2}px;
  font-family: ${helpers.specialFont};
  font-weight: 300;
  margin: 0;
  line-height: 1;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
  padding: 0 ${helpers.rhythmDiv * 2}px;
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
      <Heading>About</Heading>
      <Title>{props.title.toLowerCase()}</Title>
      <Address>
        {props.address && <Postal>{props.address}</Postal>}
        {props.website && <Website href={addHttpProtocol(props.website)} target="_blank"> {cutString(props.website,60)} </Website>}
      </Address>
    </SchoolWrapper>
    <Description>{props.description && ReactHtmlParser(props.description)}</Description>
  </Wrapper>
);

AboutSchool.propTypes = {
  title: PropTypes.string,
  address: PropTypes.string,
  website: PropTypes.string,
  description: PropTypes.string
}

export default AboutSchool;
