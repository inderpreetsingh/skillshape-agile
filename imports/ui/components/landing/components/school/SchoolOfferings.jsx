import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Typography from 'material-ui/Typography';

import PrimaryButton from '../buttons/PrimaryButton';
//TODO: Automatic imports depending upon variables used - intellij
import * as helpers from '../jss/helpers.js';

const Wrapper = styled.div`
  ${helpers.flexCenter}
  flex-direction: column;
  padding: ${helpers.rhythmDiv}px;
`;

const MainText = styled.h2`
  font-family: ${helpers.specialFont};
  font-weight: 500;
  margin: ${helpers.rhythmDiv}px 0;
`;

const SchoolOfferings = (props) => (
  <Wrapper>
    <MainText>{props.classTypeName}</MainText>
    <Typography>at</Typography>
    <MainText>{props.schoolName}</MainText>
    <Typography>Subjects: {props.subjects}</Typography>
    <Typography>Age Range: {props.ageRange}</Typography>
    <Typography>Gender: {props.gender}</Typography>
    <Typography>Experience Level: {props.experienceLevel}</Typography>
    {props.isAdmin && <PrimaryButton label={`Edit ${helpers.classTypeName}`} onClick={props.onEditClassTypeBtnClick}/>}
  </Wrapper>
);

SchoolOfferings.propTypes = {
  classTypeName: PropTypes.string,
  schoolName: PropTypes.string,
  subjects: PropTypes.string,
  ageRange: PropTypes.string,
  gender: PropTypes.string,
  experienceLevel: PropTypes.string,
}

SchoolOfferings.defaultProps = {
  classTypeName: 'Class Type Name',
  schoolName: 'Gracia University'
}

export default SchoolOfferings;
