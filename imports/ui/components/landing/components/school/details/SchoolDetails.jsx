import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import StudentNotes from './StudentNotes.jsx';
import AboutSchool from './AboutSchool.jsx';
import ImgSlider from '../ImgSlider.jsx';

import * as helpers from '../../jss/helpers.js';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${helpers.rhythmDiv * 8}px;

  @media screen and (max-width: ${helpers.tablet}px) {
    ${helpers.flexDirectionColumn}
    align-items: center;
  }

  @media screen and (max-width: ${helpers.mobile}px) {
    padding-bottom: 0;
  }

`;

const SchoolSection = styled.div`
  max-width: 476px;
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-right: ${helpers.rhythmDiv * 3}px;

  @media screen and (max-width: ${helpers.tablet}px) {
    margin-bottom: ${helpers.rhythmDiv}px;
    margin-right: 0;
  }

  @media screen and (max-width: ${helpers.mobile}px) {
    padding: ${helpers.rhythmDiv * 2}px;
  }
`;

const ImgSliderSection = styled.div`
  max-width: 500px;
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
      <StudentNotes notes={props.notes}/>
    </SchoolSection>
    <ImgSliderSection>
      <ImgSlider images={props.images} />
    </ImgSliderSection>
  </Wrapper>
);

SchoolDetails.propTypes = {
  schoolName: PropTypes.string,
  description: PropTypes.string,
  images: PropTypes.arrayOf({
    original: PropTypes.string,
    thumbnail: PropTypes.string
  }),
  notes: PropTypes.oneOfType([PropTypes.string,PropTypes.element]),
}

export default SchoolDetails;
