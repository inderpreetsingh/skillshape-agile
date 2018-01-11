import React from 'react';
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
    padding: 24px;
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
    margin-top:${helpers.rhythmDiv}*2;
    margin-bottom:${helpers.rhythmDiv};

    @media screen and (min-width: 0) and (max-width: ${helpers.tablet}px) {
        padding-left: 0;
        text-align: center;
    }
`;

const CardsList = ({ title, cardsData, mapView, classInterestData}) => (
    <CardsListWrapper>
        <CardsListTitle>{title} </CardsListTitle>
        <CardsListGridWrapper>
            <Grid container spacing={24}>
                {cardsData.map((card, index) => {
                    return (
                        <Grid key={card._id} item md={4} sm={6} lg={3} xs={12}>
                            <ClassTypeCard classInterestData={classInterestData} classTypeData={card}/>
                        </Grid>
                    );
                })}
            </Grid>
        </CardsListGridWrapper>
        <More>
         <SecondaryButton label="See More"/>
        </More>
    </CardsListWrapper>
);


CardsList.propTypes = {
    cardsData: PropTypes.arrayOf(CardStructure),
    title: PropTypes.string.isRequired,
}

CardsList.defaultTypes = {
    title: 'Title'
}

export default CardsList;