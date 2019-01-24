import React, { Fragment } from 'react';
import styled from 'styled-components';
import { SolutionGfx } from './sharedStyledComponents';
import { SubHeading, Text } from '/imports/ui/components/landing/components/jss/sharedStyledComponents.js';
import { rhythmDiv } from '/imports/ui/components/landing/components/jss/helpers.js';

import { SOLUTION_BOX_WIDTH } from './constants.js';

const Wrapper = styled.div`
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 ${rhythmDiv * 6}px;
    width: 100%;
    margin: 0 auto;    
`;

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;`;

const GfxWrapper = styled.div`
    position: relative;
    width: 100%;
    max-width: ${SOLUTION_BOX_WIDTH}px;
`;

const Content = styled.div`
    position: absolute;
    bottom: 0;
    background-image: url('${props => props.bgImage}');
    background-color: ${props => props.cardBgColor};
    background-position: 50% 50%;
    background-repeat: repeat;
    max-width: ${SOLUTION_BOX_WIDTH}px;
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    padding: ${rhythmDiv * 2}px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;    
`;

const IssueSolution = (props) => (
    <Wrapper key={props.key}>
        <ContentWrapper>
            <GfxWrapper>
                <SolutionGfx src={props.solutionContent} />
                <Content cardBgColor={props.cardBgColor} bgImage={props.bgImage}>
                    <SubHeading>{props.title}</SubHeading>
                    <Text>{props.content}</Text>
                </Content>
            </GfxWrapper>
        </ContentWrapper>
    </Wrapper>
);

export default IssueSolution;
