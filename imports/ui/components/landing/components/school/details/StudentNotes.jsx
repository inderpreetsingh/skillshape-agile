import React from 'react';
import styled from 'styled-components';
import ReactStars from 'react-stars';
import PropTypes from 'prop-types';

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

const Notes = styled.ul`
  margin: 0;
  padding: 0;
`;

const Note = styled.li`
  list-style: dot;
  font-size: ${helpers.baseFontSize}px;
  font-family: ${helpers.specialFont};
  line-height: 1;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const conditionalRender = (props) => {
  return (props.notes ? (<Wrapper>
    <Title>Student Notes</Title>
    <Notes>
      {props.notes.map(note => <Note>{note}</Note>)}
    </Notes>
  </Wrapper>) : <span></span>);
}

const StudentNotes = (props) => {
  return conditionalRender(props);
}

StudentNotes.propTypes = {
  notes: PropTypes.arrayOf(PropTypes.String)
}

export default StudentNotes;
