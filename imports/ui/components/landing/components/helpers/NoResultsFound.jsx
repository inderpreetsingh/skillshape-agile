import React from 'react';
import styled from 'styled-components';

import PropTypes from 'prop-types';

import Plant from '/imports/ui/components/landing/components/icons/Plant.jsx';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

const Wrapper = styled.div`
  ${helpers.flexCenter}
  flex-direction: column;
`;

const Head = styled.div`
  display: flex;
  align-items: flex-end;
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const Title = styled.h2`
  font-weight: 300;
  font-style: italic;
  font-size: ${helpers.baseFontSize * 2}px;
  font-family: ${helpers.specialFont};
  margin: 0;
  line-height: 1;
`;

const Tagline = styled.p`
  font-weight: 400;
  font-size: ${helpers.baseFontSize}px;
  font-family: ${helpers.specialFont};
  line-height: 1;
  margin: 0;
`;

const PlantIcon = styled.div`
  transform: translateX(${helpers.rhythmDiv * 3}px);
`;

const NoResultsFound = (props) => (<Wrapper>
  <Head>
    <PlantIcon>
      <Plant height="64px" width="64px" />
    </PlantIcon>
    <Title>{props.title}</Title>
  </Head>
  <Tagline>{props.tagline1}</Tagline>
  <Tagline>{props.tagline2}</Tagline>
</Wrapper>);

NoResultsFound.propTypes = {
  title: PropTypes.string,
  tagline1: PropTypes.string,
  tagline2: PropTypes.string
}

export default NoResultsFound;
