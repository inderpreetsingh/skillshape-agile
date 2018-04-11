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

const Title = styled.h3`
  font-weight: 600;
  font-family: ${helpers.specialFont};
  margin: 0;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
  line-height: 1;
  font-size: ${helpers.baseFontSize}px;
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
  return(<Wrapper>
    <Title>Student Notes</Title>
    <Notes>
      {props.notes ? ReactHtmlParser(props.notes) : <NoteStyled>Nothing for the moment, but keep an eye. We may add soon.</NoteStyled>}
    </Notes>
  </Wrapper>);
}

const StudentNotes = (props) => {
  return conditionalRender(props);
}

StudentNotes.propTypes = {
  notes: PropTypes.arrayOf(PropTypes.String)
}

export default StudentNotes;
