import React from 'react';
import get from 'lodash/get';
import { browserHistory } from 'react-router';
import DocumentTitle from 'react-document-title';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import NotFound from './icons/NotFound.jsx';

//TODO: Automatic imports depending upon variables used - intellij
import PrimaryButton from './buttons/PrimaryButton.jsx';

import * as helpers from './jss/helpers.js';

const Wrapper = styled.div`
    ${helpers.flexCenter}
    flex-direction: column;
    max-width: ${helpers.baseFontSize * 30}px;
    margin: ${helpers.rhythmDiv * 4}px auto;
`;

const Title = styled.h1`
    font-family: ${helpers.specialFont};
    margin: 0;
    margin-bottom: ${helpers.rhythmDiv * 2}px;
    font-weight: 300;
    color: ${helpers.black};
    font-size: ${helpers.baseFontSize * 3}px;
    font-style: italic;

    @media screen and (max-width: ${helpers.mobile}px) {
        font-size: ${helpers.baseFontSize * 2}px;
    }
`;

const ButtonsWrapper = styled.div`
    ${helpers.flexCenter}
    align-items: stretch;
    width: 100%;

    @media screen and (max-width: ${helpers.mobile}px) {
        flex-direction: column;
        align-items: center;
        padding: 0 0 0 ${helpers.rhythmDiv}px;
    }
`;

const IconWrapper = styled.div`
    width: ${helpers.rhythmDiv * 24}px;
    height: ${helpers.rhythmDiv * 24}px;
    margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const NoPageFound = (props) => (
    <DocumentTitle title={get(props, "route.name", "Untitled")}>
        <Wrapper>
            <IconWrapper>
                <NotFound/>
            </IconWrapper>

            <Title>404 Page Not Found</Title>

            <ButtonsWrapper>
                <PrimaryButton
                    fullWidth={true}
                    onClick={() => browserHistory.push('/')}
                    label="Back to SkillShape Home"
                    noMarginBottom
                />
            </ButtonsWrapper>
        </Wrapper>
  </DocumentTitle>
);

export default NoPageFound;
