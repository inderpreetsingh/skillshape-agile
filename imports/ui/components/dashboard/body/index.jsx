import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router';

import { rhythmDiv, primaryColor } from '/imports/ui/components/landing/components/jss/helpers.js';
import { Text, SubHeading } from '/imports/ui/components/landing/components/jss/sharedStyledComponents.js';

import SchoolsList from '../schools/presentational/SchoolsList';

const Wrapper = styled.div`
    padding: ${rhythmDiv * 4}px ${rhythmDiv * 2}px;
`;

const Content = SubHeading.extend`
    text-align: center;
    margin-bottom: ${rhythmDiv * 2}px;
`;

const MyLink = styled(Link)`
    color: ${primaryColor};
    cursor: pointer;
    transition: color .1s linear;
    
    &:hover {
        color: ${primaryColor};
    }
`;

const Body = (props) => (
    <Wrapper>
        <Content>If you want to add a new school, <MyLink>click here</MyLink> </Content>
        <SchoolsList
            schools={props.schoolsListProps.mySchools}
        />
    </Wrapper>
)

export default Body;