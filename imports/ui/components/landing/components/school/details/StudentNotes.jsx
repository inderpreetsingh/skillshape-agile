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
  line-height: 1;
  font-size: ${helpers.baseFontSize}px;
`;

const Notes = styled.ul`
  margin: 0;
  padding: 0;
`;

const Note = styled.li`
  list-style: none;
  font-size: ${helpers.baseFontSize}px;
  font-family: ${helpers.specialFont};
  line-height: 1;

  &:before {
    content: '*';
    margin-right: ${helpers.rhythmDiv}px;
  }
`;

const StudentNotes = (props) => (
  <Wrapper>
    <Title>Student Notes</Title>
    <Notes>
      {props.notes.map(note => <Note>{note}</Note>)}
    </Notes>
  </Wrapper>
);

StudentNotes.propTypes = {
  notes: PropTypes.arrayOf(PropTypes.String)
}

export default StudentNotes;
