import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import { withStyles } from 'material-ui/styles';

import PrimaryButton from '../buttons/PrimaryButton.jsx';
import Badge from '../icons/Badge.jsx';

import * as helpers from '../jss/helpers.js';

const styles = {
  iconButton : {
    width: helpers.rhythmDiv * 2,
    height: helpers.rhythmDiv * 2,
    marginRight: helpers.rhythmDiv * 2,
    transform: 'translateY(-8px)'
  }
}

const Wrapper = styled.article`
  max-width: 300px;
  width: 100%;
  background-color: white;
  height: ${props => props.extended ? '528' : '496'}px;
  border-radius: ${helpers.rhythmDiv * 6}px;
  margin-right: ${helpers.rhythmDiv * 2}px;
  display: flex;
  flex-direction: column;
  min-width: 0;

  box-shadow: 1px 1px 0px 1px rgba(0,0,0,0.1), -1px -1px 0px 1px rgba(0,0,0,0.1);

  &:last-of-type {
    margin-right: 0;
  }

  @media screen and (max-width: ${helpers.tablet + 50}px) {
    margin-right: 0;
    margin-bottom: ${helpers.rhythmDiv * 4}px;
    &:last-of-type {
      margin-bottom: 0;
    }
  }

`;

const Price = styled.p`
  margin: 0;
  text-align: center;
  background-color: ${helpers.black};
  color: white;
  font-size: ${helpers.baseFontSize * 3}px;
  font-family: ${helpers.specialFont};
  margin-bottom: ${helpers.rhythmDiv * 2}px;
  border-top-left-radius: ${helpers.rhythmDiv * 6}px;
  border-top-right-radius: ${helpers.rhythmDiv * 6}px;
  padding: ${helpers.rhythmDiv * 2}px;
  position: relative;
`;

const Title = styled.h2`
  color: ${helpers.black};
  font-weight: 500;
  font-size: ${helpers.baseFontSize * 2}px;
  font-family: ${helpers.specialFont};
  text-align: center;
  text-transform: capitalize;
  margin: 0;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const FeatureWrapper = styled.li`
  ${helpers.flexCenter}
  justify-content: flex-start;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const FeatureName = styled.p`
  font-size: ${helpers.baseFontSize}px;
  font-weight: 400;
  font-style: italic;
  font-family: ${helpers.specialFont};
  margin: 0;
`;


const FeaturesListWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  padding-left: ${helpers.rhythmDiv * 2}px;
`;


const SchoolCardContent = styled.div`
  padding: ${helpers.rhythmDiv * 2}px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const ButtonWrapper = styled.div`
  text-align: center;
  flex-grow: 1;
  ${helpers.flexCenter}
  align-items: flex-end;
`;

const PerMonth = styled.span`
  font-size: ${helpers.baseFontSize}px;
  font-style: italic;
  display: inline-block;
  transform: translate(-4px);
`;

const ContentWrapper = styled.div`
`;

const BadgeWrapper = styled.div`
  position: absolute;
  top: 0px;
  right: 50px;
  font-size: 20px;
  line-height: 1;
`;

const Feature = (props) => (<FeatureWrapper>
  <IconButton className={props.classes.iconButton}>
    <Icon>{props.iconName}</Icon>
  </IconButton>
  <FeatureName>{props.featureName}</FeatureName>
  </FeatureWrapper>
);

const FeaturesList = (props) => (<FeaturesListWrapper>
    {props.features && props.features.map(feature => <Feature {...feature} classes={props.classes} />)}
  </FeaturesListWrapper>
);

const MostCommon = () => (<BadgeWrapper><Badge height='20px' width='20px'/></BadgeWrapper>);

const SchoolPriceCard = (props) => (<Wrapper extended={props.extended}>
    <Price>
    {props.price}
    {props.perMonth && <PerMonth>per month</PerMonth>}
    {props.trending && <MostCommon />}
    </Price>
    <SchoolCardContent>
      <ContentWrapper>
        <Title>{props.title}</Title>
        <FeaturesList features={props.features} classes={props.classes}></FeaturesList>
      </ContentWrapper>
      <ButtonWrapper>
        <PrimaryButton noMarginBottom labelText="Join Now"/>
      </ButtonWrapper>
    </SchoolCardContent>
  </Wrapper>
);

SchoolPriceCard.defaultProps = {

}

export default withStyles(styles)(SchoolPriceCard);
