import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Icon from 'material-ui/Icon';

import Button from 'material-ui/Button';
import PrimaryButton from '../buttons/PrimaryButton.jsx';

import { lightenDarkenColor } from '/imports/util';
import * as helpers from '../jss/helpers';
import { cardImgSrc } from '../../site-settings.js';

const styles = {
  cardWrapper: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    cursor: 'pointer'
  },
  cardIconButton : {
    borderRadius: '50%',
    minWidth: '0',
    minHeight: '0',
    padding: `0 ${helpers.rhythmDiv}px`,
    height: helpers.rhythmDiv * 4,
    width: helpers.rhythmDiv * 4,
    backgroundColor: 'white',
    boxShadow: '1px 1px 1px 1px rgba(0,0,0,0.1), 1px 0px 1px 1px rgba(0,0,0,0.1)',
    '&:hover': {
      backgroundColor: 'white'
    }
  }
}

const SolutionCardOuterWrapper = styled.div`
  transition: 0.1s background-color ease-in, 0.1s height ease-in;
  height: 180px;
  position: relative;
  max-width: 200px;
  min-width: 0;
  width: 100%;
  margin-right: ${helpers.rhythmDiv * 4}px;
  margin-bottom: ${helpers.rhythmDiv * 4}px;

  &:last-of-type {
    margin-right: 0;
  }
`;

const SolutionCardWrapper = styled.article`
  position: absolute;
  ${props => props.downwards ? 'top: 0' : 'bottom: 0'};
  width: 100%;
  border-radius: ${helpers.rhythmDiv * 2}px;
  cursor: pointer;
  background-image: url('${props => props.bgImage}');
  padding: ${helpers.rhythmDiv * 2}px;
  height: 100%;
  margin: 0;
  background-color: ${props => props.cardBgColor};
  transition: 0.1s background-color ease-in, 0.1s height ease-in;

  @media screen and (max-width: ${helpers.tablet}px ) {
    margin-right: ${helpers.rhythmDiv * 2}px;
    margin-bottom: ${helpers.rhythmDiv * 2}px;
  }

  @media screen and (max-width: ${helpers.mobile}px) {
    width: 200px;
    margin: 0 auto;
    margin-bottom: ${helpers.rhythmDiv * 2}px;
    &:last-of-type {
      margin-right: auto;
    }
  }

  // &:hover {
  //   background-color: ${props => lightenDarkenColor(props.cardBgColor,-20)};
  // }
`;

const CardDescriptionWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  padding: ${helpers.rhythmDiv * 2}px;
  background-color: white;
  width: 100%;
  z-index: 9;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  margin-top: ${helpers.rhythmDiv * 8}px;
  position: absolute;
  transform-origin: 100% 100%;
  transition: transform .2s linear;
  border-bottom-left-radius: ${helpers.rhythmDiv * 2}px;
  border-bottom-right-radius: ${helpers.rhythmDiv * 2}px;
  transform: ${props => props.revealCard ? 'scaleY(1)' : 'scaleY(0)'};
`;

const SolutionCardContent = styled.div`
  ${helpers.flexCenter}
  flex-direction: column;
  height: 100%;
`;

const SolutionIconButtonWrapper = styled.div`

`;

const CardTitle = styled.h3`
  font-size: ${helpers.baseFontSize * 2}px;
  font-weight: 500;
  font-style: italic;
  font-family: ${helpers.fancyFont};
  margin: 0;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
  text-align: center;
  line-height: 1;
  text-transform: lowercase;

  :first-letter {
    text-transform: capitalize;
  }

  @media screen and (max-width: ${helpers.tablet + 100}px) {
    font-size: ${helpers.baseFontSize * 1.5}px;
  }
`;

const CardContentTitle = styled.h4`
  font-size: ${props => props.description ? 18 : helpers.baseFontSize}px;
  font-weight: 500;
  font-family: ${helpers.specialFont};
  margin: 0;
  text-align: center;
  line-height: 1;
  font-style: italic;
  margin-bottom: ${props => props.description ? helpers.rhythmDiv : 0}px;
  margin-top: ${props => props.description ? helpers.rhythmDiv : 0}px;
`;

const CardContent = styled.p`
  margin: 0;
  font-size: ${helpers.baseFontSize}px;
  font-weight: 400;
  line-height: 1.2;
  font-family: ${helpers.specialFont};
`;

const IconButtonWrapper = styled.div`
  position: absolute;
  bottom: ${props => props.closeButton ? 'initial' : 0};
  top: ${props => props.closeButton ? 0 : 'initial'};
  right: 16px;
  transform: translateY(${props => props.closeButton ? '-50%' : '50%'});
  transition: ${props => props.revealCard ? 'none' : 'opacity .1s linear .15s'};
  transition: ${props => props.closeButton && 'none'};
  opacity: ${props => props.revealCard ? '0' : '1'};
  opacity: ${props => props.closeButton && 1};
`;

const CardContentInnerWrapper = styled.div`

`;

const CardDescription = (props) => (
  <CardDescriptionWrapper key={props.key} revealCard={props.revealCard}>
    <IconButtonWrapper revealCard={props.revealCard} closeButton>
      <Button className={props.classes.cardIconButton} variant="fab" color="secondary" aria-label="close" onClick={props.hideCardContent}>
        <Icon>clear</Icon>
      </Button>
    </IconButtonWrapper>
    <CardContentTitle description>{props.tagline}</CardContentTitle>
    <CardContent>{props.content}</CardContent>
  </CardDescriptionWrapper>
);

class SchoolSolutionCard extends Component {
  state = {
    revealCard: false,
    maxHeightForContainer: 0
  };

  revealCardContent = (e) => {
    this.setState({ revealCard: true });
  }
  hideCardContent = (e) => {
    e.stopPropagation();
    this.setState({ revealCard: false });
  }

  render() {
    // console.log(this.state,"adsljfj")
    return (<SolutionCardOuterWrapper active={this.props.active}>
      <SolutionCardWrapper
        downwards={this.props.downwards}
        cardBgColor={this.props.cardBgColor}
        bgImage={this.props.bgImage}
        active={this.props.active}
        itemScope
        itemType="http://schema.org/Service"
        onClick={this.props.onCardClick}
        >
          <SolutionCardContent>
            <CardContentInnerWrapper ref={container => this.contentContainer = container}>
              <CardTitle>{this.props.title}</CardTitle>
              {/*<CardContentTitle>{this.props.tagline}</CardContentTitle> */}
            </CardContentInnerWrapper>
          </SolutionCardContent>

          <CardDescription
            content={this.props.content}
            hideCardContent={this.hideCardContent}
            revealCardContent={this.revealCardContent}
            title={this.props.title}
            tagline={this.props.tagline}
            classes={this.props.classes}
            key={this.props._id}
            revealCard={this.state.revealCard}
          />

          {/*<IconButtonWrapper revealCard={this.state.revealCard} showMoreButton>
            <Button className={this.props.classes.cardIconButton} variant="fab" aria-label="show-more" onClick={this.revealCardContent}>
              <Icon>more_vert</Icon>
            </Button>
          </IconButtonWrapper>*/}
          </SolutionCardWrapper>
      </SolutionCardOuterWrapper>
    );
  }
}

CardDescription.propTypes = {
  name : PropTypes.string,
  tagline: PropTypes.string,
  title: PropTypes.string,
  content: PropTypes.element,
  hideCardContent : PropTypes.func.isRequired
}

SchoolSolutionCard.propTypes = {
  name: PropTypes.string,
  classes: PropTypes.object.isRequired,
  content: PropTypes.string,
  tagline: PropTypes.string,
  title: PropTypes.string,
  bgImage: PropTypes.string,
  cardBgColor: PropTypes.string,
  marginTop: PropTypes.string,
  onCardClick: PropTypes.func
}

SchoolSolutionCard.defaultProps = {
   title: 'Patented Media Management',
   tagline: 'Highlights your school and it\'s offerings',
   content: 'And makes it easy for students to search by times, skill levels, location, and other parameters to find the class that truly meets their needs.',
   marginTop: 0,
}

export default withStyles(styles)(SchoolSolutionCard);
