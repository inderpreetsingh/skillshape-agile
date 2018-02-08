import React, {Fragment} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import * as helpers from '../jss/helpers.js';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
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
  margin-top: ${helpers.rhythmDiv * 2}px;
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
    {props.ageRange && <InfoCapsule>
      <CapsuleHead>Age Range:</CapsuleHead>
      <CapsuleText> {props.ageRange}</CapsuleText>
    </InfoCapsule>}

    {props.gender && <InfoCapsule>
      <CapsuleHead>Gender:</CapsuleHead>
      <CapsuleText> {props.gender}</CapsuleText>
    </InfoCapsule>}

    {props.experience && <InfoCapsule>
      <CapsuleHead>Experience:</CapsuleHead>
      <CapsuleText> {props.experience}</CapsuleText>
    </InfoCapsule>}

    {props.subjects && <InfoCapsule>
      <CapsuleHead>Subjects:</CapsuleHead>
      <CapsuleText>  {props.subjects}</CapsuleText>
    </InfoCapsule>}
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
