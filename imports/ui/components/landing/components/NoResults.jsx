import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';


//TODO: Automatic imports depending upon variables used - intellij
import PrimaryButton from './buttons/PrimaryButton.jsx';
import Footer from './footer/index.jsx';
import * as helpers from './jss/helpers.js';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-family: ${helpers.specialFont};
  margin: 0;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
  color: ${helpers.headingColor};
`;

const Text = styled.p`
  font-size: ${helpers.baseFontSize}px;
  font-family: ${helpers.commonFont};
  color: ${helpers.textColor};
  margin: 0;
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const ListWrapper = styled.ul`
  margin: 0;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const ListPoint = styled.li`
  list-style: initial;
  font-family: ${helpers.commonFont};
`;

const ButtonWrapper = styled.div`
  display: flex;

`;

const NoResults = (props) => (
  <Wrapper>
    <Title>No Results</Title>
    <Text>Try adjusting your search, may be thats not correct.</Text>
    <ListWrapper>
      <ListPoint>
        <Text>Change your filters or dates</Text>
      </ListPoint>
      <ListPoint>
        <Text>Search for a specific city and address.</Text>
      </ListPoint>
    </ListWrapper>
    <ButtonWrapper>
      <PrimaryButton onClick={props.removeAllFiltersButtonClick} label="Remove All Filters"/>
    </ButtonWrapper>
  </Wrapper>
);

NoResults.propTypes = {
  removeAllFiltersButtonClick: PropTypes.func
}

export default NoResults;
