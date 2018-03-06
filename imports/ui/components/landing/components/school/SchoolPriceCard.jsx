import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import { withStyles } from 'material-ui/styles';

import PrimaryButton from '../buttons/PrimaryButton.jsx';

import * as helpers from '../jss/helpers.js';

const styles = {
  iconButton : {
    width: helpers.rhythmDiv * 2,
    height: helpers.rhythmDiv * 2,
    marginRight: helpers.rhythmDiv * 2,
    transform: 'translateY(-8px)'
  }
}

const Wrapper = styled.div`
  max-width: 300px;
  width: 100%;
  background-color: white;
  height: ${props => props.extended ? '448' : '480'}px;
  border-radius: ${helpers.rhythmDiv * 6}px;
`;

const Price = styled.div`
  text-align: center;
  background-color: ${helpers.black};
  color: white;
  font-size: ${helpers.baseFontSize * 3}px;
  font-family: ${helpers.specialFont};
  margin-bottom: ${helpers.rhythmDiv * 2}px;
  border-top-left-radius: ${helpers.rhythmDiv * 6}px;
  border-top-right-radius: ${helpers.rhythmDiv * 6}px;
  padding: ${helpers.rhythmDiv * 2}px;
`;

const Title = styled.div`
  color: ${helpers.black};
  font-weight: 500;
  font-size: ${helpers.baseFontSize * 2}px;
  font-family: ${helpers.specialFont};
  text-align: center;
  text-transform: capitalize;
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

const Feature = (props) => (<FeatureWrapper>
  <IconButton className={props.classes.iconButton}>
    <Icon>{props.iconName}</Icon>
  </IconButton>
  <FeatureName>{props.featureName}</FeatureName>
</FeatureWrapper>);

const FeaturesListWrapper = styled.ul`
  display: flex;
  flex-direction: column;
`;

const FeaturesList = (props) => (<FeaturesListWrapper>
    {props.features && props.features.map(feature => <Feature {...feature} classes={props.classes} />)}
  </FeaturesListWrapper>
);

const SchoolCardContent = styled.div`
  padding: ${helpers.rhythmDiv * 2}px;
`;

const ButtonWrapper = styled.div`
  text-align: center;
`;

const SchoolPriceCard = (props) => (<Wrapper>
    <Price>{props.price}</Price>
    <SchoolCardContent>
      <Title>{props.title}</Title>
      <FeaturesList features={props.features} classes={props.classes}></FeaturesList>
      <ButtonWrapper>
        <PrimaryButton noMarginBottom />
      </ButtonWrapper>
    </SchoolCardContent>
  </Wrapper>
);

SchoolPriceCard.defaultProps = {
  features: [
    {
      iconName: 'people',
      featureName: 'Chat group'
    },
    {
      iconName: 'video_library',
      featureName: 'Media Management'
    },
    {
      iconName: 'payment',
      featureName: 'Web Frames'
    },
    {
      iconName: 'note',
      featureName: 'Student Enrollment and notes'
    },
    {
      iconName: 'share',
      featureName: 'Social Sharing'
    }
  ]
}

export default withStyles(styles)(SchoolPriceCard);
