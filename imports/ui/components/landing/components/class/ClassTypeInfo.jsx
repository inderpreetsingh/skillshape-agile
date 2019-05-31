import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import MetaInfo from '/imports/ui/components/landing/components/helpers/MetaInfo';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const ClassTypeInfo = props => (
  <Wrapper>
    {props.categories && <MetaInfo data={props.categories} title="Categories:" />}

    {props.subjects && <MetaInfo data={props.subjects} title="Subjects:" />}

    {props.ageRange && <MetaInfo data={props.ageRange} title="Age Range:" />}

    {props.gender && <MetaInfo data={props.gender} title="Gender:" />}

    {props.experience && <MetaInfo data={props.experience} title="Experience:" />}
  </Wrapper>
);

ClassTypeInfo.propTypes = {
  ageRange: PropTypes.string,
  gender: PropTypes.string,
  experience: PropTypes.string,
  subjects: PropTypes.string,
};

export default ClassTypeInfo;
