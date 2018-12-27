import React from 'react';
import styled from 'styled-components';
import { isEmpty, get } from 'lodash';

import SchoolCard from './SchoolCard';
import { flexCenter, rhythmDiv } from '/imports/ui/components/landing/components/jss/helpers.js';
import { classTypeImgSrc } from '/imports/ui/components/landing/site-settings.js';
import { SCHOOL_CARD_WIDTH } from '../../constants';

const LARGE_SCREEN_GW = SCHOOL_CARD_WIDTH * 3 + rhythmDiv * (4 * 3);
const MED_SCREEN_GW = SCHOOL_CARD_WIDTH * 2 + rhythmDiv * (4 * 2);
const SMALL_SCREEN_GW = SCHOOL_CARD_WIDTH * 1;

const Wrapper = styled.div`
    ${flexCenter}
    justify-content: flex-start;
    flex-wrap: wrap;
    max-width: ${LARGE_SCREEN_GW}px;
    margin: 0 auto;
    
    @media screen and (max-width: ${LARGE_SCREEN_GW}px) {
        max-width: ${MED_SCREEN_GW}px;    
    }

    @media screen and (max-width: ${MED_SCREEN_GW}px) {
        max-width: ${SMALL_SCREEN_GW}px;
    }
`;

const SchoolCardWrapper = styled.div`
    max-width: ${SCHOOL_CARD_WIDTH}px;
    width: 100%;
    margin: 0 ${rhythmDiv * 2}px ${rhythmDiv * 2}px ${rhythmDiv * 2}px;  

    :nth-of-type(3n) {
        margin-right: 0;
    }

    @media screen and (max-width: ${LARGE_SCREEN_GW}px) {
        :nth-of-type(2n) {
            margin-right: 0;
        }
        
        :nth-of-type(3n) {
            margin-right: ${rhythmDiv * 2}px;
        }
    }

    @media screen and (max-width: ${MED_SCREEN_GW}px) {
        margin: 0;
        margin-bottom: ${rhythmDiv * 2}px;    
        :nth-of-type(3n) {
            margin-right: 0;
        }
    }
`;


const handleVisitSchoolClick = (schoolData) => (e) => {
    e.preventDefault();
    browserHistory.push(`/schools/${schoolData.slug}`);
}


const handleEditSchoolClick = (schoolData) => (e) => {
    e.preventDefault();
    browserHistory.push(`/schoolAdmin/edit/${schoolData.slug}`);
}

const SchoolsList = (props) => (
    <Wrapper>
        {!isEmpty(props.schools) && props.schools.map((schoolData, i) =>
            <SchoolCardWrapper key={i}>
                <SchoolCard
                    schoolCover={get(schoolData, 'mainImage', get(schoolData, 'mainImageMedium', get(schoolData, 'mainImageLow', classTypeImgSrc)))}
                    schoolLogo={get(schoolData, 'logoImg', get(schoolData, 'logoImgMedium', ''))}
                    onVisitSchoolClick={handleVisitSchoolClick(schoolData)}
                    onEditSchoolClick={handleEditSchoolClick(schoolData)}
                />
            </SchoolCardWrapper>
        )}
    </Wrapper>
);

export default SchoolsList;