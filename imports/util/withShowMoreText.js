import React, {Component} from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import * as helpers from '../ui/components/landing/components/jss/helpers.js';


const Wrapper = styled.div`

`;
const Read = styled.span`
  font-style: italic;
  cursor: pointer;
`;

const withShowMoreText = function(WrappedComponent,showMoreTextConfig) {
  let config = showMoreTextConfig || {};

  return class extends React.Component {
    state = {
      fullText: this.props.description,
      text: this.props.description,
      maxStringCharsToShow: config.maxChars || 135 ,
      showReadMore: false,
      fullTextState: false
    }

    componentWillMount = () => {
      // console.info('////////// component will mount ',this.state);
      const text = this._getLessCharsDescription(this.state.fullText);
      // console.info('less char string',text);
      if(text != this.state.fullText) {
        this.setState({
          text: text,
          showReadMore: true
        });
      }
    }

    componentDidMount = () => {
      //console.info('Show me state',this.state);
    }

    handleToggleFullTextState = () => {
      //console.log('click on this handleToggleFullTextState');
      this.setState({
        fullTextState: !this.state.fullTextState
      });
    }

    getDescriptionText = () => {
      if(this.state.showReadMore) {
        if(this.state.fullTextState) {
          return this.state.fullText;
        }
      }

      return this.state.text;
    }

    getShowMoreText = () => {
      if(this.state.showReadMore) {
        if(this.state.fullTextState) {
          return <Read onClick={this.handleToggleFullTextState}> ... Read Less</Read>
        }else {
          return <Read onClick={this.handleToggleFullTextState}> ... Read More</Read>
        }
      }

      return <span></span>
    }

    _getLessCharsDescription = (text) => {
      const maxLimit = this.state.maxStringCharsToShow;
      let count = 0;

      const words = text.split(' ');
      for(let i = 0; i < words.length; ++i) {
        count += words[i].length + 1;
        if(count > maxLimit) {
          count -= (words[i].length + 1);
          break;
        }else if( count == maxLimit) {
          break;
        }
      }

      const newMaxCharLimit = count;

      text.substr(0, newMaxCharLimit);
    }

    render() {
      //console.log('this. state , this. props',this.state,this.props);
      return (
        <Wrapper>
          <WrappedComponent
              {...this.props}
              fullTextState={this.state.fullTextState}
              fullText={this.state.fullText}
              text={this.state.text}
              showReadMore={this.state.showReadMore}
              getShowMoreText={this.getShowMoreText}
              getDescriptionText={this.getDescriptionText}
            />
        </Wrapper>)
    }
  }
}

export default withShowMoreText;
