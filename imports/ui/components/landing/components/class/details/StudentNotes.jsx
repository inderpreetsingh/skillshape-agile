import PropTypes from 'prop-types';
import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import styled from 'styled-components';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers';

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

  ul,
  ol {
    margin: 0;
    padding: 0;
  }

  li {
    list-style-position: outside;
    margin-bottom: ${helpers.rhythmDiv}px;
  }
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

const conditionalRender = props => (props.notes ? (
  <Wrapper>
    <Title>Student Notes</Title>
    <Notes>{ReactHtmlParser(props.notes)}</Notes>
  </Wrapper>
) : null);

const StudentNotes = props => conditionalRender(props);

StudentNotes.propTypes = {
  noClassTypeData: false,
  notes: PropTypes.arrayOf(PropTypes.String),
};

export default StudentNotes;
