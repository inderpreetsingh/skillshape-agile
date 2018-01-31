import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { CSSTransition, Transition } from 'react-transition-group';
import styled from 'styled-components';

import { withStyles } from 'material-ui/styles';
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
    cursor: 'pointer'
  },
  cardIcon : {
    cursor: 'pointer'
  }
}

const CardImageWrapper = styled.div`
  height: 250px;
  width: 100%;
  position: relative;
`;

const CardImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
`;

const CardContent = styled.div`

`;

const CardContentHeader = styled.div`
  display: flex;
  padding: 10px;
  padding-bottom: ${helpers.rhythmDiv}px;
  justify-content: space-between;
  align-items: center;
`;

const CardContentTitle = styled.div`
  font-size: ${helpers.baseFontSize * 1.5}px;
  font-weight: 300;
  font-family: ${helpers.specialFont};

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

const CardDescriptionActionArea = styled.div`
  padding: 5px;
`;

const CardDescription = ({ key, classes, className, name, hideCardContent, descriptionContent }) => (
  <CardDescriptionWrapper key={key} className={`reveal-card reveal-card-${className}`}>

    <CardDescriptionHeader>
      <CardContentTitle>{name}</CardContentTitle>

      <CardDescriptionActionArea>
        <IconButton className={classes.cardIcon} color="primary" onClick={hideCardContent}> <Clear /> </IconButton>
      </CardDescriptionActionArea>
    </CardDescriptionHeader>

    {descriptionContent}
  </CardDescriptionWrapper>
);

const Reveal = ({children, ...props}) => {
  console.log(props,"props..");
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
    imageContainerHeight: '250px',
    revealCard: false
  };
  revealCardContent = (e) => {
    this.setState({ revealCard: true });
  }
  hideCardContent = (e) => {
    this.setState({ revealCard: false });
  }
  updateDimensions = () => {
    const container = ReactDOM.findDOMNode(this.imgContainer);
    const width = window.getComputedStyle(container,null).width;
    //console.log('width',container,width,this.state.imgContainerHeight);
    this.setState({
      imageContainerHeight: width
    })
  }
  componentDidMount() {
    //this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
  }
  componentWillUnMount() {
    window.addEventListener("resize", this.updateDimensions);
  }
  render() {
    const { name, classTypeImg, descriptionContent, body, classes } = this.props;

    //console.log(ShowDetails,"adsljfj")
    return (
      <Paper className={classes.cardWrapper} itemScope itemType="http://schema.org/Service">

        <div onClick={this.revealCardContent}>
          <CardImageWrapper ref={(div) => this.imgContainer = div} style={{height: this.state.imageContainerHeight}}>
            <CardImage src={classTypeImg || cardImgSrc} alt="card img" />
          </CardImageWrapper>

          <CardContent>
            <CardContentHeader>
              <CardContentTitle itemProp="name">{name}</CardContentTitle>
              <IconButton className={classes.cardIcon} onClick={this.revealCardContent} >
                <MoreVert />
              </IconButton>
            </CardContentHeader>

            <CardContentBody>{body}</CardContentBody>
          </CardContent>
        </div>
        {console.log(this.state.revealCard,"changing state...")}

        <Transition timeout={{enter : 0, exit: 0}} in={this.state.revealCard}>
          {(state) => (<CardDescription
              descriptionContent={descriptionContent}
              hideCardContent={this.hideCardContent}
              name={name}
              classes={classes}
              className={state}
              key={this.props._id}
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

export default withStyles(styles)(CardsReveal);
