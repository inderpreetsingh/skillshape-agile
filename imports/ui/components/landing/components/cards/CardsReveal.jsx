import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { CSSTransition, Transition } from 'react-transition-group';
import styled from 'styled-components';

import { withStyles } from 'material-ui/styles';
import withImageExists from '/imports/util/withImageExists.js';

import Paper from 'material-ui/Paper';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import Clear from 'material-ui-icons/Clear';
import MoreVert from 'material-ui-icons/MoreVert';

import PrimaryButton from '../buttons/PrimaryButton.jsx';

import * as helpers from '../jss/helpers';
import { cardImgSrc } from '../../site-settings.js';

const styles = {
  cardWrapper: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    cursor: 'pointer',
    minHeight: 420
  },
  cardIcon : {
    cursor: 'pointer',
    height: 24,
    width: 24
  }
}

const imageExistsConfig = {
  originalImagePath: 'classTypeImg',
  defaultImage: cardImgSrc
}

const CardImageTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 320px;
`;

const CardImageWrapper = styled.div`
  max-height: 300px;
  height: 100%;
  width: 100%;

  background-position: 50% 50%;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url('${props => props.bgImage}');
`;

const CardImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CardContent = styled.div`

`;

const CardContentHeader = styled.div`
  display: flex;
  padding: ${helpers.rhythmDiv}px ${helpers.rhythmDiv * 2}px;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
`;

const CardContentTitle = styled.h2`
  font-size: ${helpers.baseFontSize * 1.5}px;
  font-weight: 300;
  font-family: ${helpers.specialFont};
  line-height: 1;
  margin: 0;
  text-transform: capitalize;
  text-align: center;

  @media screen and (max-width : ${helpers.mobile}px) {
    font-size: ${helpers.baseFontSize}px;
  }

  @media screen and (max-width : ${helpers.tablet}px) {
    font-size: ${helpers.baseFontSize * 1.2}px;
  }
`;

const CardContentBody = styled.div`
  padding: 0px 10px 10px 10px;
`;

const CardDescriptionWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  font-family: ${helpers.specialFont};
  padding: 10px;
  position: absolute;
  background-color: white;
  width: 100%;
  z-index: 9;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  transform-origin: 100% 100%;
`;

const CardDescriptionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const CardImageContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 45px;
  width: 45px;
  flex: 0 0 auto;
`;

const CardDescriptionActionArea = styled.div`
  padding: 5px;
`;

const CardContentInnerTitle = styled.span`
  text-transform: capitalize;
`;

const Avatar = styled.div`
  background-image: url(${props => props.bgImg});
  background-size: cover;
  border-radius: 50%;
  height: 100%;
  width: 100%;
`;

const CardDescription = ({ key, classes, className, name, maxCharsLimit ,hideCardContent, descriptionContent, bgImg}) => {

  const _getRefactoredTitle = (title, maxLimit) => {
    if(title.length <= maxLimit) {
      return title;
    }

    const words = title.split(' ');
    const maxCharsToDisplay = _getMaxCharsTitleLimit(words,maxLimit);
    return title.substr(0,maxCharsToDisplay) + '...';
  }

  // This function will let us count the max words of title we can display
  const _getMaxCharsTitleLimit = (words, maxLimit) => {
    let count = 0;

    for(let i = 0; i < words.length; ++i) {
      count += words[i].length + 1;

      // if the count increases the maxLimit, gets the last complete word
      if(count > maxLimit) {
        count -= (words[i].length + 1);
        break;
      }else if( count == maxLimit) {
        break;
      }
    }

    return count;
  }


  return (<CardDescriptionWrapper key={key} className={`reveal-card reveal-card-${className}`}>
    <CardDescriptionHeader>
      <CardImageContainer>
        <Avatar bgImg={bgImg} />
      </CardImageContainer>

      <CardContentTitle description>{_getRefactoredTitle(name, maxCharsLimit)}</CardContentTitle>

      <CardDescriptionActionArea>
        <IconButton className={classes.cardIcon} color="primary" onClick={hideCardContent}> <Clear /> </IconButton>
      </CardDescriptionActionArea>
    </CardDescriptionHeader>

    {descriptionContent}
  </CardDescriptionWrapper>);
}

const Reveal = ({children, ...props}) => {
  // console.log(props,"props..");
  return (
    <CSSTransition
      {...props}
      classNames="reveal-card"
      timeout={500}
    >
    {children}
    </CSSTransition>
  );
}

class CardsReveal extends Component {
  state = {
    maxCharsLimit: 18,
    revealCard: false,
  };

  revealCardContent = (e) => {
    this.setState({ revealCard: true });
  }

  hideCardContent = (e) => {
    this.setState({ revealCard: false });
  }


  render() {
    const { name, classTypeImg, descriptionContent, body, classes, bgImg } = this.props;
    const myTitle = name.toLowerCase();
    //console.log(ShowDetails,"adsljfj")
    return (<Paper className={classes.cardWrapper} itemScope itemType="http://schema.org/Service">
        <div onClick={this.revealCardContent}>
          <CardImageTitleWrapper>

            <CardImageWrapper bgImage={bgImg}></CardImageWrapper>

            <CardContentHeader>
              <CardContentTitle itemProp="name">{myTitle}</CardContentTitle>
              <IconButton className={classes.cardIcon} onClick={this.revealCardContent} >
                <MoreVert />
              </IconButton>
            </CardContentHeader>

          </CardImageTitleWrapper>

          <CardContent>
            <CardContentBody>{body}</CardContentBody>
          </CardContent>
        </div>

        <Transition timeout={{enter : 0, exit: 0}} in={this.state.revealCard}>
          {(transitionState) => (<CardDescription
              descriptionContent={descriptionContent}
              hideCardContent={this.hideCardContent}
              name={myTitle}
              classes={classes}
              className={transitionState}
              maxCharsLimit={this.state.maxCharsLimit}
              key={this.props._id}
              bgImg={bgImg}
            />)}
        </Transition>
      </Paper>
    );
  }
}

CardDescription.propTypes = {
    name : PropTypes.string,
    descriptionContent: PropTypes.element,
    hideCardContent : PropTypes.func.isRequired
}

CardsReveal.propTypes = {
    name: PropTypes.string,
    classTypeImg: PropTypes.string,
    height: PropTypes.number,
    classes: PropTypes.object.isRequired,
    descriptionContent: PropTypes.element,
    body: PropTypes.element,
    showDetailsComponent : PropTypes.element
}

CardsReveal.defaultProps = {
   classTypeImg: cardImgSrc,
   name: 'Card Title'
}

export default withStyles(styles)(withImageExists(CardsReveal,imageExistsConfig));
