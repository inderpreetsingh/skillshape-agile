import React from 'react';
import styled from 'styled-components';
import ReactStars from 'react-stars';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';

import * as helpers from '../../jss/helpers.js';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  font-weight: 300;
  font-family: ${helpers.specialFont};
  margin: 0;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
  color: ${helpers.headingColor};
  font-size: ${helpers.baseFontSize * 2}px;
`;

const Notes = styled.div`
  margin: 0;
  padding: 0;
  font-size: ${helpers.baseFontSize}px;
  font-family: ${helpers.specialFont};
  color: ${helpers.black};
`;

const Note = styled.li`
  list-style: dot;
  font-size: ${helpers.baseFontSize}px;
  font-family: ${helpers.specialFont};
  line-height: 1;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
  color: ${helpers.black};
`;

const NoteStyled = styled.p`
  font-size: ${helpers.baseFontSize}px;
  font-family: ${helpers.specialFont};
  margin-bottom: ${helpers.rhythmDiv * 2}px;
  color: ${helpers.black};
`;

const conditionalRender = (props) => {
  return (props.notes ? (<Wrapper>
    <Title>Student Notes</Title>
    <Notes>
      {ReactHtmlParser(props.notes)}
    </Notes>
  </Wrapper>) : null);
}

const StudentNotes = (props) => {
  return conditionalRender(props);
}

StudentNotes.propTypes = {
  noClassTypeData: false,
  notes: PropTypes.arrayOf(PropTypes.String)
}

export default StudentNotes;
