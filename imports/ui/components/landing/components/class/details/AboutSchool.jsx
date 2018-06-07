import React from "react";
import styled from "styled-components";
import ReactStars from "react-stars";
import PropTypes from "prop-types";
import ReactHtmlParser from "react-html-parser";

import { cutString } from "/imports/util";

import * as helpers from "../../jss/helpers.js";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${helpers.rhythmDiv * 4}px;
`;

const MainHeading = styled.div`
  ${helpers.flexCenter} flex-wrap : wrap;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const Title = styled.h2`
  font-size: ${helpers.baseFontSize * 2}px;
  font-family: ${helpers.specialFont};
  color: ${helpers.primaryColor};
  margin: 0;
  font-weight: 300;
  text-transform: capitalize;
  text-align: center;
  position: relative;

  // &:after {
  //   content: '';
  //   position: absolute;
  //   height: 2px;
  //   width: 100%;
  //   transform: scaleX(0);
  //   bottom: -2px;
  //   left: 0;
  //   background-color: currentColor;
  //   transition: 0.2s ease-in transform;
  // }

  &:hover {
    text-decoration: underline;
  }
`;

const Heading = styled.h2`
  font-size: ${helpers.baseFontSize * 2}px;
  font-family: ${helpers.specialFont};
  font-weight: 300;
  margin: 0;
  padding-right: ${helpers.rhythmDiv}px;
  color: ${helpers.headingColor};
`;

const Description = styled.p`
  margin: 0;
  font-size: ${helpers.baseFontSize}px;
  font-family: ${helpers.specialFont};
  line-height: 1;
  text-align: justify;
  padding: 0px ${helpers.rhythmDiv * 2}px;
`;

const SchoolWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 ${helpers.rhythmDiv * 2}px;
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
  color: inherit;
`;

const Postal = styled.p`
  margin: 0;
  line-height: 1;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const addHttpProtocol = website => {
  if (website && website.match("http")) {
    return website;
  }
  return "https://" + website;
};

const AboutSchool = props => (
  <Wrapper>
    <SchoolWrapper>
      <MainHeading>
        <Heading>About</Heading>
        <Website href={addHttpProtocol(props.website)} target="_blank">
          <Title>{props.title.toLowerCase()}</Title>
        </Website>
      </MainHeading>
      <Address>
        {props.address && <Postal>{props.address}</Postal>}
        {/*props.website && <Website href={addHttpProtocol(props.website)} target="_blank"> {cutString(props.website,60)} </Website>*/}
      </Address>
    </SchoolWrapper>
    <Description>
      {props.description && ReactHtmlParser(props.description)}
    </Description>
  </Wrapper>
);

AboutSchool.propTypes = {
  title: PropTypes.string,
  address: PropTypes.string,
  website: PropTypes.string,
  description: PropTypes.string
};

export default AboutSchool;
