import React from 'react';
import styled from 'styled-components';
import ReactStars from 'react-stars';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';

import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  font-size: ${helpers.baseFontSize * 2}px;
  font-family: ${helpers.specialFont};
  font-weight: 300;
  margin: 0;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
  color: ${helpers.headingColor};
  text-align: center;
`;

const Notes = styled.div`
  margin: 0;
  padding: 0;
  font-size: ${helpers.baseFontSize}px;
  font-family: ${helpers.specialFont};
  color: ${helpers.black};
  padding: 0 ${helpers.rhythmDiv * 2}px;

  ul, ol {
    margin: 0;
    padding: 0;
  }

  li {
    list-style-position: outside;
    margin-bottom: ${helpers.rhythmDiv}px;
  }
`;

const Note = styled.li`
  list-style: dot;
  font-size: ${helpers.baseFontSize}px;
  font-family: ${helpers.specialFont};
  line-height: 1;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
  color: ${helpers.primaryColor};
`;

const NoteStyled = styled.p`
  font-size: ${helpers.baseFontSize}px;
  font-family: ${helpers.specialFont};
  margin-bottom: ${helpers.rhythmDiv * 2}px;
  color: ${helpers.black};
`;

// const transformNotes = function(node,index) {
//   console.info("Transform Notes are here...............",node);
//   debugger;
//   if(node.type == 'tag' && node.name == 'ul') {
//     return convertNodeToElement(node,index,transformNotes);
//   }else if(node.type == 'tag' && node.name == 'li') {
//     return <Note>{node.children[0].data}</Note>;
//     return convertNodeToElement(node,index,transformNotes);
//   }
//   return undefined;
// }

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
