import React, { Fragment } from 'react';
import styled from 'styled-components';
import { SolutionGfx } from './sharedStyledComponents';
import { SubHeading, Text } from '/imports/ui/components/landing/components/jss/sharedStyledComponents.js';
import {rhythmDiv} from '/imports/ui/components/landing/components/jss/helpers.js';

import {SOLUTION_BOX_WIDTH} from './constants.js';

const Wrapper = styled.div`
    width: 1200px;
    height: 500px;
    margin: 0 auto;
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: ${rhythmDiv * 2}px;
`;

const GfxWrapper = styled.div`
    height: 300px;
`;

const IssueSolution = (props) => (
    <Wrapper key={props.key}>
        <GfxWrapper>
            <SolutionGfx src={props.solutionContent} />
        </GfxWrapper>
        <Content>
            <SubHeading>{props.title}</SubHeading>
            <Text>{props.content}</Text>
        </Content>
    </Wrapper>
);

export default IssueSolution;
