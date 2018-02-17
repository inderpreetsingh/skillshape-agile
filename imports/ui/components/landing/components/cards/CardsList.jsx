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
const SPACING_MAPVIEW = helpers.rhythmDiv;
const CARD_WIDTH = 320;

const CardsListGridWrapper = styled.div`
    padding: ${props => props.mapView ? SPACING_MAPVIEW : SPACING}px;
    margin: 0;
    margin-right: auto;
    max-width: ${props => props.mapView ? getContainerMaxWidth(CARD_WIDTH,SPACING_MAPVIEW,2) + 8 : getContainerMaxWidth(CARD_WIDTH,SPACING,4) + 24}px;

    @media screen and (max-width: 1279px) {
      max-width: ${getContainerMaxWidth(CARD_WIDTH,SPACING,3)  + 24}px;
    }

    @media screen and (max-width: 959px) {
      max-width: ${props => props.mapView ? getContainerMaxWidth(CARD_WIDTH,SPACING_MAPVIEW,1) + 8 : getContainerMaxWidth(CARD_WIDTH,SPACING,2)  + 24}px;
    }

    @media screen and (max-width: 600px) {
      max-width: ${getContainerMaxWidth(CARD_WIDTH,SPACING,1)  + 24}px;
    }
`;

const More = styled.div`
    width:100%;
    padding:${helpers.rhythmDiv}px;
    ${helpers.flexCenter}
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
        text-align: center;
    }
`;

class CardsList extends Component {
    _compareCardsData(currentCardsData,newCardsData) {
        for(let i = 0; i < currentCardsData.length; ++i) {
            if(currentCardsData[i]._id !== newCardsData[i]._id
                || currentCardsData[i].reviews !== newCardsData[i].reviews
                || currentCardsData[i].classTypeImg !== newCardsData[i].classTypeImg
                || currentCardsData[i].ratings !== newCardsData[i].ratings
                || currentCardsData[i].name !== newCardsData[i].name
                || currentCardsData[i].desc !== newCardsData[i].desc
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
        } else if ((this.props.classInterestData && nextProps.classInterestData) && this.props.classInterestData.length !== nextProps.classInterestData.length) {
            return true;
        } else {
            return this._compareCardsData(this.props.cardsData, nextProps.cardsData);
        }
    }

    seeMoreStatus = (cardsData, filters) => {
        const { limit, skillCategoryClassLimit } = filters;
        if(limit) {
            if (limit <= size(cardsData)) {
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
              <CardsListTitle>{title} </CardsListTitle>
              <CardsListGridWrapper mapView={mapView}>
                 <Grid container spacing={24}>
                     {cardsData.map(card => {
                         if(mapView) {
                           return (
                             <Grid item key={card.id} md={6} sm={12} lg={6} xs={12}>
                                 <ClassTypeCard schoolData={this.props.schoolData} classInterestData={classInterestData} {...card}/>
                             </Grid>
                           )
                         }else {
                           return (
                             <Grid item key={card.id} md={4} sm={6} lg={3} xs={12}>
                                 <ClassTypeCard schoolData={this.props.schoolData} classInterestData={classInterestData} {...card}/>
                             </Grid>
                           )
                         }
                     })}
                 </Grid>
              </CardsListGridWrapper>
              {
                this.seeMoreStatus(cardsData, filters) && (
                    <More>
                       <SecondaryButton label="See More" onClick={() => {handleSeeMore(name)}}/>
                    </More>
                )
              }
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
