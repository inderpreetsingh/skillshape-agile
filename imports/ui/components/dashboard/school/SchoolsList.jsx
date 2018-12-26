import React from 'react';
import styled from 'styled-components';

import SchoolCard from './SchoolCard';
import { flexCenter, rhythmDiv } from '/imports/ui/components/landing/components/jss/helpers.js';

const SCHOOL_CARD_WIDTH = 300;

const Wrapper = styled.div`
    max-width: ${SCHOOL_CARD_WIDTH * 3 + rhythmDiv * (2 * 3)}px;
`;

const SchoolCardWrapper = styled.div`
    max-width: ${SCHOOL_CARD_WIDTH}px;
`;

const handleVisitSchoolClick = (schoolData) => (e) => {
    e.preventDefault();
    browserHistory.push(`/schools/${schoolData.slug}`);
}


const handleEditSchoolClick = (schoolData) => (e) => {
    e.preventDefault();
    browserHistory.push(`/schools/edit/${schoolData.slug}`);
}

const SchoolsList = (props) => (
    <Wrapper>
        {props.schools.map(schoolData =>
            <SchoolCard
                schoolLogo={get(schoolData, 'logoImg', get(schoolData, 'logoImgMedium', ''))}
                onVisitSchoolClick={handleVisitSchoolClick(schoolData)}
                onEditSchoolClick={handleEditSchoolClick(schoolData)}
            />)}
    </Wrapper>
);

export default SchoolsList;