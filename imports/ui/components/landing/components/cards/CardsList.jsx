import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Grid from 'material-ui/Grid';

import ClassTypeCard from './ClassTypeCard.jsx';
import CardStructure from '../../constants/structure/card.js';
import SecondaryButton from '../buttons/SecondaryButton.jsx';

import * as helpers from '../jss/helpers.js';

const CardsListWrapper = styled.div`
    padding: 0;
`;

const CardsListGridWrapper = styled.div`
    padding: ${props => props.mapView ? '8px' : '24px'};
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
     console.log(nextProps,'saljf')
     if(this.props.title !==  nextProps.title) {
       return true;
     }else if(this.props.mapView !==  nextProps.mapView) {
       return true;
     }else if(this.props.cardsData.length !== nextProps.cardsData.length) {
       return true;
     }else {
       return this._compareCardsData(this.props.cardsData,nextProps.cardsData);
     }
   }
  render() {
    const { title, cardsData, mapView,handleSeeMore,name,classInterestData} = this.props;
    return(
      <CardsListWrapper>
          <CardsListTitle>{title} </CardsListTitle>
          <CardsListGridWrapper mapView={mapView}>
               <Grid container spacing={24}>
                   {cardsData.map(card => {
                       if(mapView) {
                         return (
                           <Grid item key={card.id} md={6} sm={12} lg={6} xs={12}>
                               <ClassTypeCard classInterestData={classInterestData} {...card}/>
                           </Grid>
                         )
                       }else {
                         return (
                           <Grid item key={card.id} md={4} sm={6} lg={3} xs={12}>
                               <ClassTypeCard classInterestData={classInterestData} {...card}/>
                           </Grid>
                         )
                       }
                   })}
               </Grid>
          </CardsListGridWrapper>
          <More>
           <SecondaryButton label="See More" onClick={() => {handleSeeMore(name)}}/>
          </More>
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
