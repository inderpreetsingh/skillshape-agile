import React, {Fragment} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import * as helpers from '../jss/helpers.js';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: ${helpers.rhythmDiv}px;
  height: 100%;
`;

const InfoCapsule = styled.div`
  border-radius: 50px;
  background: ${helpers.lightTextColor};
  color: ${helpers.black};
  padding: ${helpers.rhythmDiv}px;
  font-family: ${helpers.specialFont};
  font-weight: 400;
  font-size: ${helpers.baseFontSize}px;
  margin-right: ${helpers.rhythmDiv}px;
  margin-top: ${helpers.rhythmDiv}px;
  height: ${helpers.rhythmDiv * 4}px;
  line-height: 1;
`;

const CapsuleHead = styled.span`
  line-height: 1;
`;

const CapsuleText = styled.span`
  line-height: 1;
`;

const ClassTypeInfo = (props) => (
  <Wrapper>
    <InfoCapsule>
      <CapsuleHead>Age Range:</CapsuleHead>
      <CapsuleText> {props.ageRange}</CapsuleText>
    </InfoCapsule>

    <InfoCapsule>
      <CapsuleHead>Gender:</CapsuleHead>
      <CapsuleText> {props.gender}</CapsuleText>
    </InfoCapsule>

    <InfoCapsule>
      <CapsuleHead>Experience:</CapsuleHead>
      <CapsuleText> {props.experience}</CapsuleText>
    </InfoCapsule>

    <InfoCapsule>
      <CapsuleHead>Subjects:</CapsuleHead>
      <CapsuleText>  {props.subjects}</CapsuleText>
    </InfoCapsule>
  </Wrapper>
);

ClassTypeInfo.propTypes = {
  ageRange: PropTypes.string,
  gender: PropTypes.string,
  experience: PropTypes.string,
  subjects: PropTypes.string,
}

ClassTypeInfo.defaultProps = {
  ageRange: '2 - 4',
  gender: 'Any',
  experience: 'Any',
  subjects: 'Yoga, Meditation',
}

export default ClassTypeInfo;
