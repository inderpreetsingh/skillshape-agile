import React from "react";
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import {cutString} from '/imports/util';
import { InfiniteScroll } from '/imports/util';
import { browserHistory, Link } from 'react-router';
import Grid from 'material-ui/Grid';

import SchoolCard from "/imports/ui/components/landing/components/cards/schoolCard";
import NoResults from '/imports/ui/components/landing/components/NoResults';

import {getContainerMaxWidth} from '/imports/util/cards.js';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';


const NoResultContainer = styled.div`
  text-align: center;
  width: 100%;
  height: 100vh;
  ${helpers.flexCenter}
  flex-direction: column;
`;
const SPACING = helpers.rhythmDiv * 2;
const CARD_WIDTH = 300;

const GridContainer = styled.div`
  ${helpers.flexCenter}
  justify-content: flex-start;
  flex-wrap: wrap;

  @media screen and (max-width: ${helpers.mobile}px) {
    justify-content: center;
  }
`;

const GridItem = styled.div`
  width: ${CARD_WIDTH}px;
  margin: ${props => props.spacing/2 || '16'}px;

  @media screen and (max-width: ${helpers.mobile}px) {
    max-width: ${CARD_WIDTH}px;
    margin: ${props => props.spacing/2 || '16'}px 0;
  }
`;

const CardsListGridWrapper = styled.div`
    padding: ${SPACING/2}px;
    margin: 0 auto;
    max-width: ${getContainerMaxWidth(CARD_WIDTH,SPACING,4) + 24}px;

    @media screen and (max-width: ${getContainerMaxWidth(CARD_WIDTH,SPACING,4) + 24}px) {
      max-width: ${getContainerMaxWidth(CARD_WIDTH,SPACING,3) + 24}px;
    }

    @media screen and (max-width: ${getContainerMaxWidth(CARD_WIDTH,SPACING,3) + 24}px) {
      max-width: ${getContainerMaxWidth(CARD_WIDTH,SPACING,2) + 24}px;
    }

    @media screen and (max-width: ${getContainerMaxWidth(CARD_WIDTH,SPACING,2) + 24}px) {
      max-width: ${getContainerMaxWidth(CARD_WIDTH,SPACING,1) + 24}px;
      margin: 0 auto;
    }

`;


export default function (props) {
    let schools = this.props.collectionData || [];

    if(isEmpty(schools)) {
        return (
            <NoResultContainer>
                <NoResults
                    removeAllFiltersButtonClick={this.props.removeAllFilters}
                />
            </NoResultContainer>
        )
    } else {
        return (
            <div>
                <CardsListGridWrapper>
                  <GridContainer>
                    {
                      schools.map((school, index) => {
                          return (
                              <GridItem spacing={SPACING} key={index}>
                                  <SchoolCard schoolCardData={school} handleClaimASchool={this.props.handleClaimASchool}/>
                              </GridItem>
                          )
                      })
                    }
                    </GridContainer>
                </CardsListGridWrapper>
            </div>
        )
    }
}
