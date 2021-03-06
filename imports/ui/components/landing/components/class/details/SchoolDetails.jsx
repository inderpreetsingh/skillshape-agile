import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import ClassTypeImgSlider from '/imports/ui/components/landing/components/class/ClassTypeImgSlider.jsx';
import AboutSchool from '/imports/ui/components/landing/components/class/details/AboutSchool.jsx';
import StudentNotes from '/imports/ui/components/landing/components/class/details/StudentNotes.jsx';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';



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
  ${helpers.flexCenter}
  align-items: ${props => props.notes ? 'flex-start' : 'center'};
  padding: 0 ${helpers.rhythmDiv * 2}px;
`;

const ImgSliderStudentNotes = styled.div`
  padding: 0 ${helpers.rhythmDiv * 2}px;
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
    {!isEmpty(props.images) && !isEmpty(props.notes) && <ImgSliderSection notes={isEmpty(props.images)}>
      {
        !isEmpty(props.images) ?
        <ClassTypeImgSlider images={props.images} />
        :
        <ImgSliderStudentNotes>
          <StudentNotes notes={props.notes}/>
        </ImgSliderStudentNotes>
      }
    </ImgSliderSection>}
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
