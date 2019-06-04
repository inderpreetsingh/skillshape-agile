import get from 'lodash/get';
import Clear from 'material-ui-icons/Clear';
import Edit from 'material-ui-icons/Edit';
import MoreVert from 'material-ui-icons/MoreVert';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ProgressiveImage from 'react-progressive-image';
import { Transition } from 'react-transition-group';
import styled from 'styled-components';
import PrimaryButton from '/imports/ui/components/landing/components/buttons/PrimaryButton';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers';
import { cardImgSrc } from '/imports/ui/components/landing/site-settings';
import { verifyImageURL } from '/imports/util';

const styles = {
  cardWrapper: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    cursor: 'pointer',
  },
  cardIcon: {
    cursor: 'pointer',
    height: 24,
    width: 24,
  },
  cardProfileImageIcon: {
    cursor: 'pointer',
    height: 24,
    width: 24,
    position: 'absolute',
    top: '8px',
    right: '8px',
  },
};

const CardImageTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 320px;
`;

const CardImageWrapper = styled.div`
  max-height: 300px;
  height: 100%;
  width: 100%;
  position: relative;
  transition: background-image 1s linear !important;
  background-position: 50% 50%;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url('${props => props.bgImage}');
`;

const CardContent = styled.div``;

const EditImageButtonWrapper = styled.div`
  position: absolute;
  top: ${helpers.rhythmDiv}px;
  right: ${helpers.rhythmDiv}px;
`;

const IconButtons = styled.div`
  ${helpers.flexCenter}
`;

const CardContentHeader = styled.div`
  display: flex;
  padding: ${helpers.rhythmDiv}px ${helpers.rhythmDiv * 2}px;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
`;

const CardContentTitle = styled.h3`
  font-size: ${helpers.baseFontSize * 1.5}px;
  font-weight: 300;
  font-family: ${helpers.specialFont};
  line-height: 1;
  margin: 0;
  text-transform: capitalize;
  ${props => (props.description ? `padding: 0 ${helpers.rhythmDiv}px` : '')};
  text-align: ${props => (props.description ? 'center' : 'left')};
  @media screen and (max-width: ${helpers.mobile}px) {
    font-size: ${helpers.baseFontSize}px;
  }

  @media screen and (max-width: ${helpers.tablet}px) {
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
  z-index: 4;
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
  flex-shrink: 0;
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

const Avatar = styled.div`
  transition: background-image 1s linear !important;
  background-image: url(${props => props.bgImg});
  background-size: cover;
  border-radius: 50%;
  height: 100%;
  width: 100%;
`;

const CardDescription = ({
  editMode,
  key,
  classes,
  className,
  name,
  maxCharsLimit,
  hideCardContent,
  descriptionContent,
  bgImg,
}) => {
  const _getRefactoredTitle = (title, maxLimit) => {
    if (title.length <= maxLimit) {
      return title;
    }

    const words = title.split(' ');
    const maxCharsToDisplay = _getMaxCharsTitleLimit(words, maxLimit);
    return `${title.substr(0, maxCharsToDisplay)}...`;
  };

  // This function will let us count the max words of title we can display
  const _getMaxCharsTitleLimit = (words, maxLimit) => {
    let count = 0;

    for (let i = 0; i < words.length; ++i) {
      count += words[i].length + 1;

      // if the count increases the maxLimit, gets the last complete word
      if (count > maxLimit) {
        count -= words[i].length + 1;
        break;
      } else if (count == maxLimit) {
        break;
      }
    }

    return count;
  };

  return (
    <CardDescriptionWrapper key={key} className={`reveal-card reveal-card-${className}`}>
      <CardDescriptionHeader>
        <CardImageContainer>
          <ProgressiveImage src={bgImg} placeholder={config.blurImage}>
            {src => <Avatar bgImg={src} />}
          </ProgressiveImage>
        </CardImageContainer>

        <CardContentTitle description>
          {editMode ? name : _getRefactoredTitle(name, maxCharsLimit)}
        </CardContentTitle>

        <CardDescriptionActionArea>
          <IconButton className={classes.cardIcon} color="primary" onClick={hideCardContent}>
            {' '}
            <Clear />
            {' '}
          </IconButton>
        </CardDescriptionActionArea>
      </CardDescriptionHeader>

      {descriptionContent}
    </CardDescriptionWrapper>
  );
};

class CardsReveal extends Component {
  state = {
    maxCharsLimit: 18,
    revealCard: false,
    bgImg: this.props.bgImg,
  };

  revealCardContent = (e) => {
    this.setState({ revealCard: true });
  };

  hideCardContent = (e) => {
    this.setState({ revealCard: false });
  };

  setSchoolImage = (schoolId) => {
    Meteor.call('school.getMySchool', schoolId, true, (err, res) => {
      if (res && res.mainImage) {
        const img = get(res, 'mainImageMedium', get(res, 'mainImage', ''));
        verifyImageURL(img, (res) => {
          if (res) {
            this.setState({ bgImg: img });
          } else {
            this.setState({ bgImg: cardImgSrc });
          }
        });
      }
    });
  };

  verifyAndUpdateImageUrl(data) {
    const { bgImg, schoolId, medium } = data;
    const img = medium || bgImg;
    if (img == '/images/classtype/classtype-cover.jpg') {
      this.setSchoolImage(schoolId);
    } else {
      verifyImageURL(img, (res) => {
        if (res) {
          this.setState({ bgImg: img });
        } else {
          this.setSchoolImage(schoolId);
        }
      });
    }
  }

  componentWillMount() {
    this.verifyAndUpdateImageUrl(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { bgImg, medium } = nextProps;
    const img = medium || bgImg;
    if (this.state.bgImg !== img) {
      this.verifyAndUpdateImageUrl(nextProps);
    }
  }

  render() {
    const {
      name,
      descriptionContent,
      body,
      classes,
      onEditClassTypeImageClick,
      onEditClassTypeClick,
      editMode,
    } = this.props;
    const { bgImg } = this.state;
    const myTitle = name.toLowerCase();
    // console.log(ShowDetails,"adsljfj")
    return (
      <Paper className={classes.cardWrapper} itemScope itemType="http://schema.org/Service">
        <div onClick={this.revealCardContent}>
          <CardImageTitleWrapper>
            <ProgressiveImage placeholder={config.blurImage} src={bgImg}>
              {src => (
                <CardImageWrapper bgImage={src}>
                  {editMode && (
                    <EditImageButtonWrapper>
                      <PrimaryButton
                        icon
                        iconName="photo_camera"
                        onClick={onEditClassTypeImageClick}
                        label="Edit Image"
                      />
                    </EditImageButtonWrapper>
                  )}
                </CardImageWrapper>
              )}
            </ProgressiveImage>

            <CardContentHeader>
              <CardContentTitle itemProp="name">{myTitle}</CardContentTitle>

              <IconButtons>
                {editMode && (
                  <IconButton className={classes.cardIcon} onClick={onEditClassTypeClick}>
                    <Edit />
                  </IconButton>
                )}
                <IconButton className={classes.cardIcon} onClick={this.revealCardContent}>
                  <MoreVert />
                </IconButton>
              </IconButtons>
            </CardContentHeader>
          </CardImageTitleWrapper>

          <CardContent>
            <CardContentBody>{body}</CardContentBody>
          </CardContent>
        </div>

        <Transition timeout={{ enter: 0, exit: 0 }} in={this.state.revealCard}>
          {transitionState => (
            <CardDescription
              editMode
              descriptionContent={descriptionContent}
              hideCardContent={this.hideCardContent}
              name={myTitle}
              classes={classes}
              className={transitionState}
              maxCharsLimit={this.state.maxCharsLimit}
              key={this.props._id}
              bgImg={bgImg}
            />
          )}
        </Transition>
      </Paper>
    );
  }
}

CardDescription.propTypes = {
  name: PropTypes.string,
  descriptionContent: PropTypes.element,
  hideCardContent: PropTypes.func.isRequired,
};

CardsReveal.propTypes = {
  name: PropTypes.string,
  classTypeImg: PropTypes.string,
  height: PropTypes.number,
  classes: PropTypes.object.isRequired,
  descriptionContent: PropTypes.element,
  body: PropTypes.element,
  showDetailsComponent: PropTypes.element,
};

CardsReveal.defaultProps = {
  classTypeImg: cardImgSrc,
  name: 'Card Title',
};

export default withStyles(styles)(CardsReveal);
