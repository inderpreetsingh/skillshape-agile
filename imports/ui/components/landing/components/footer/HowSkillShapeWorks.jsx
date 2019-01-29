import React from 'react';
import styled from 'styled-components';

import {flexDirectionColumn} from '../jss/helpers.js';
import { FooterSectionHeader, FooterText } from './FooterHelpers';

const HowSkillShapeWorksWrapper = styled.div`
    ${flexDirectionColumn}
`;

const HowSkillShapeWorks = () => (
    <HowSkillShapeWorksWrapper itemScope itemType="http://schema.org/Organization">
        <FooterSectionHeader>How <span itemProp="legalName">SkillShape</span> Works ?</FooterSectionHeader>
        <FooterText itemProp="descripton">SkillShape connects people who are looking for educational experiences  with people who have skills and activities to offer.</FooterText>
    </HowSkillShapeWorksWrapper>
);

export default HowSkillShapeWorks;
