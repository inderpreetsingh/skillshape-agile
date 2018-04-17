import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import size from 'lodash/size';
import isEmpty from 'lodash/isEmpty';

import Grid from 'material-ui/Grid';

import ClassTypeCard from './ClassTypeCard.jsx';
import CardStructure from '../../constants/structure/card.js';
import SecondaryButton from '../buttons/SecondaryButton.jsx';

import {getContainerMaxWidth} from '../../../../../util/cards.js';

import * as helpers from '../jss/helpers.js';

const CardsListWrapper = styled.div`
  padding: 0;
`;

const SPACING = helpers.rhythmDiv * 3;
const CARD_WIDTH = 280;

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
    max-width: ${props => props.mapView ? getContainerMaxWidth(CARD_WIDTH,SPACING, 2) + 24 : getContainerMaxWidth(CARD_WIDTH,SPACING,4) + 24}px;

    @media screen and (max-width: ${getContainerMaxWidth(CARD_WIDTH,SPACING,4) + 24}px) {
      max-width: ${getContainerMaxWidth(CARD_WIDTH,SPACING,3) + 24}px;
    }

    @media screen and (max-width: ${getContainerMaxWidth(CARD_WIDTH,SPACING,3) + 24}px) {
      max-width: ${props => props.mapView ? getContainerMaxWidth(CARD_WIDTH,SPACING,1) + 24 : getContainerMaxWidth(CARD_WIDTH,SPACING,2) + 24}px;
    }

    @media screen and (max-width: ${getContainerMaxWidth(CARD_WIDTH,SPACING,2) + 24}px) {
      max-width: ${getContainerMaxWidth(CARD_WIDTH,SPACING,1) + 24}px;
      margin: 0 auto;
    }
`;

const More = styled.div`
  width:100%;
  padding:${helpers.rhythmDiv}px;
  ${helpers.flexCenter}
  margin-top: ${helpers.rhythmDiv * 3}px;
`;

const CardsListTitle = styled.h2`
  padding-left: ${helpers.oneRow}px;
  color: ${helpers.textColor};
  font-size: ${helpers.baseFontSize * 2}px;
  font-weight: 600;
  font-family: ${helpers.specialFont};
  margin-bottom: ${helpers.rhythmDiv}px;
  margin-top: 0;

  @media screen and (min-width: 0) and (max-width: ${helpers.tablet}px) {
      padding-left: 0;
  }
`;


class CardsList extends Component {
    _compareCardsData(currentCardsData,newCardsData) {
        for(let i = 0; i < currentCardsData.length; ++i) {
            if(currentCardsData[i]._id !== newCardsData[i]._id
                || currentCardsData[i].classTypeImg !== newCardsData[i].classTypeImg
                || currentCardsData[i].name !== newCardsData[i].name
                || currentCardsData[i].desc !== newCardsData[i].desc
                || currentCardsData[i].reviewsStats !== newCardsData[i].reviewsStats
            ) {
                return true;
           }
        }

        return false;
    }

    shouldComponentUpdate = (nextProps) => {
        // console.log(nextProps, 'saljf')
        if (this.props.title !== nextProps.title) {
            return true;
        } else if (this.props.mapView !== nextProps.mapView) {
            return true;
        } else if (this.props.cardsData.length !== nextProps.cardsData.length) {
            return true;
        } else if (this.props.classTimesData && this.props.classTimesData.length !== nextProps.classTimesData.length) {
            return true;
        } else if ((this.props.classInterestData && nextProps.classInterestData) && this.props.classInterestData.length !== nextProps.classInterestData.length) {
            return true;
        } else {
            return this._compareCardsData(this.props.cardsData, nextProps.cardsData);
        }
    }

    seeMoreStatus = (cardsData, filters, name) => {
        const { limit, skillCategoryClassLimit } = filters;
        // console.log("skillCategoryClassLimit -->>",skillCategoryClassLimit[name],size(cardsData))
        if(skillCategoryClassLimit && skillCategoryClassLimit[name]) {
            if (skillCategoryClassLimit[name] <= size(cardsData)) {
                return true
            }
        } else {
            if ((size(cardsData) >= 4 && isEmpty(skillCategoryClassLimit))
                || (skillCategoryClassLimit && skillCategoryClassLimit[name] < size(cardsData))) {
                return true
            }
        }
        return false;
    }

    render() {
        const { title, cardsData, mapView,handleSeeMore,name,classInterestData, filters} = this.props;

        // console.log("CardsList cardsData-->>",this.props);
        return(
          <CardsListWrapper>
              <CardsListGridWrapper mapView={mapView}>
                <CardsListTitle>{title}</CardsListTitle>
                 <GridContainer>
                     {cardsData.map(card => {
                        return (
                           <GridItem key={card._id} spacing={24}>
                               <ClassTypeCard classInterestData={classInterestData} {...card}/>
                           </GridItem>
                         )
                     })}
                 </GridContainer>

                 {
                   this.seeMoreStatus(cardsData, filters, name) && (
                       <More>
                          <SecondaryButton label="See More" onClick={() => {handleSeeMore(name)}}/>
                       </More>
                   )
                 }
              </CardsListGridWrapper>

          </CardsListWrapper>
        )
    }
}

CardsList.propTypes = {
    cardsData: PropTypes.arrayOf(CardStructure),
    title: PropTypes.string.isRequired,
}

CardsList.defaultTypes = {
    title: 'Title'
}

export default CardsList;
