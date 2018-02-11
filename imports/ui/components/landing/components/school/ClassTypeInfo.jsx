import React, {Fragment} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import * as helpers from '../jss/helpers.js';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
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

const MetaInfo = (props) => (
  <InfoCapsule>
    <CapsuleHead>{props.title}</CapsuleHead>
    <CapsuleText> {props.data}</CapsuleText>
  </InfoCapsule>
)

const ClassTypeInfo = (props) => (
  <Wrapper>
    {props.ageRange && <MetaInfo data={props.ageRange} title='Age Range:' />}

    {props.gender && <MetaInfo data={props.gender} title='Gender:' />}

    {props.experience && <MetaInfo data={props.experience} title='Experience:' />}

    {props.subjects && <MetaInfo data={props.subjects} title='Subjects:' />}
  </Wrapper>
);

ClassTypeInfo.propTypes = {
  ageRange: PropTypes.string,
  gender: PropTypes.string,
  experience: PropTypes.string,
  subjects: PropTypes.string,
}

export default ClassTypeInfo;
