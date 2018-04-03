import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';

import StudentNotes from './StudentNotes.jsx';
import AboutSchool from './AboutSchool.jsx';
import ClassTypeImgSlider from '../ClassTypeImgSlider.jsx';

import * as helpers from '../../jss/helpers.js';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 ${helpers.rhythmDiv * 2}px;
  margin-bottom: ${helpers.rhythmDiv * 8}px;

  @media screen and (max-width: ${helpers.tablet}px) {
    ${helpers.flexDirectionColumn}
    align-items: center;
    padding: 0;
  }

  @media screen and (max-width: ${helpers.mobile}px) {
    padding-bottom: 0;
  }

`;

const SchoolSection = styled.div`
  max-width: 474px;
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-right: ${helpers.rhythmDiv * 3}px;

  @media screen and (max-width: ${helpers.tablet}px) {
    margin-bottom: ${helpers.rhythmDiv * 2}px;
    margin-right: 0;
    padding: ${helpers.rhythmDiv * 2}px;
    padding-top: 0;
  }
`;

// Max-width of image slider is 2px added to remove the half pixel render issue on large screens
const ImgSliderSection = styled.div`
  max-width: 502px;
  max-height: 500px;
  width: 100%;
`;

const SchoolDetails = (props) => (
  <Wrapper>
    <SchoolSection>
      <AboutSchool
        website={props.website}
        address={props.address}
        title={props.schoolName}
        description={props.description}/>
        {!isEmpty(props.images) && <StudentNotes notes={props.notes} />}
    </SchoolSection>
    <ImgSliderSection>
      {
        !isEmpty(props.images) ?
        <ClassTypeImgSlider images={props.images} />
        :
        <StudentNotes notes={props.notes}/>
      }
    </ImgSliderSection>
  </Wrapper>
);

SchoolDetails.propTypes = {
  schoolName: PropTypes.string,
  description: PropTypes.string,
  images: PropTypes.arrayOf({
    original: PropTypes.string,
  }),
  notes: PropTypes.oneOfType([PropTypes.string,PropTypes.element]),
}

export default SchoolDetails;
