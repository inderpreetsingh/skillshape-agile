import React from 'react';
import styled from 'styled-components';

import {flexDirectionColumn} from '../jss/helpers.js';
import { FooterSectionHeader, FooterText } from './FooterHelpers';

const HowSkillShapeWorksWrapper = styled.div`
    ${flexDirectionColumn}
`;

const HowSkillShapeWorks = () => (
    <HowSkillShapeWorksWrapper>
        <FooterSectionHeader>How <span itemProp="legalName">SkillShape</span> Works ?</FooterSectionHeader>
        <FooterText itemProp="descripton">SkillShape connects people who are looking for learning and with people who have skills and activities to offer.</FooterText>
    </HowSkillShapeWorksWrapper>
);

export default HowSkillShapeWorks;
