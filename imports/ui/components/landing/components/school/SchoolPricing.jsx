import React from 'react';
import styled from 'styled-components';
import SecondaryButton from '/imports/ui/components/landing/components/buttons/SecondaryButton';
import SchoolPriceCard from '/imports/ui/components/landing/components/cards/SchoolPriceCard';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers';
import Events from '/imports/util/events';

const Wrapper = styled.div`
  max-width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${helpers.schoolPageColor};
`;

const Text = styled.p`
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize}px;
  font-weight: 300;
`;

const Title = Text.withComponent('h2').extend`
  font-style: italic;
  font-size: ${helpers.baseFontSize * 1.5}px;
  color: white;
  margin: 0 auto;
  max-width: 500px;
`;

// const ComingSoon = Text.extend`
//   color: ${helpers.primaryColor};
// `;

const TitleWrapper = styled.div`
  background-color: ${helpers.black};
  padding: ${helpers.rhythmDiv * 4}px ${helpers.rhythmDiv * 2}px;
  text-align: center;
`;

const PricingBoxWrapper = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: ${helpers.schoolPageContainer}px;
  padding: ${helpers.rhythmDiv * 4}px;
  height: 100%;
  flex-grow: 1;
  /* prettier-ignore */
  ${helpers.flexCenter}
`;

const PricingWrapper = styled.div`
  width: 100%;
  /* prettier-ignore */
  ${helpers.flexCenter}
  justify-content: space-between;

  @media screen and (max-width: ${helpers.tablet + 50}px) {
    flex-direction: column;
  }
`;

const onJoinNowButtonClick = () => {
  Events.trigger('registerAsSchool', { userType: 'School' });
};

const ComingSoon = () => <SecondaryButton noMarginBottom label="Coming Soon" disabled />;

const SchoolPricing = props => (
  <Wrapper>
    <TitleWrapper>
      <Title>{props.title}</Title>
    </TitleWrapper>
    <PricingBoxWrapper>
      <PricingWrapper>
        {props.cardsData
            && props.cardsData.map((card, index) => {
              if (index > 0) {
                return <SchoolPriceCard key={index} {...card} myCustomComponent={<ComingSoon />} />;
              }
              return (
                <SchoolPriceCard key={index} {...card} onButtonClick={onJoinNowButtonClick} />
              );
            })}
      </PricingWrapper>
    </PricingBoxWrapper>
  </Wrapper>
);

SchoolPricing.defaultProps = {
  title: 'So sign up for a skillshape account and see what everyone is talking about.',
};

export default SchoolPricing;
