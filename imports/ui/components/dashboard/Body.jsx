import React from 'react';
import styled from 'styled-components';

import { rhythmDiv } from '/imports/ui/components/landing/components/jss/helpers.js';
import SchoolsList from './school/SchoolsList';

const Wrapper = styled.div`
    padding: ${rhythmDiv * 4}px ${rhythmDiv * 2}px;
`;

const Body = (props) => (
    <Wrapper>
        <SchoolsList
            mySchools={props.schoolsListProps.mySchools}
        />
    </Wrapper>
)

export default Body;