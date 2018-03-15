import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import PrimaryButton from '../buttons/PrimaryButton.jsx';
import {withStyles} from 'material-ui/styles';
import TextField from 'material-ui/TextField';

import * as helpers from '../jss/helpers.js';
import { schoolDoorImgSrc } from '../../site-settings.js';

const styles = {
    root: {
      ['@media screen and (max-width : '+helpers.tablet+'px)']: {
        boxShadow: helpers.inputBoxShadow
      },
      ['@media screen and (max-width : '+helpers.mobile+'px)']: {
        width: '100%'
      }
    },
    formControl: {
      width: 250,
      height: helpers.rhythmDiv * 6,
      ['@media screen and (max-width : '+helpers.mobile+'px)']: {
        width: '100%'
      }
    },
    userEmailInput : {
        padding: `0 ${helpers.rhythmDiv}px`,
        background: helpers.lightTextColor,
        fontFamily: helpers.specialFont,
        fontStyle: 'italic',
        borderRadius: 3,
        height: '100%'
    },
    userEmailInputInkBar: {
        '&:after': {
            backgroundColor: helpers.darkBgColor
        }
    }
}


const HeaderContent = styled.div`
  width: 500px;
  padding: ${helpers.rhythmDiv * 2}px;
`;

const Title = styled.h2`
  font-weight: 600;
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize * 3}px;
  color: ${helpers.black};
  margin: 0;
  line-height: 1;
  margin-bottom: ${helpers.rhythmDiv}px;

  @media screen and (max-width: ${helpers.tablet}px) {
    font-size: ${helpers.baseFontSize * 3}px;
  }
`;

const Content = styled.p`
  margin: 0;
  line-height: 1;
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize * 2}px;
  font-style: italic;
  color: ${helpers.black};
  font-weight: 400;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const HeaderContentWrapper = styled.div`
  ${helpers.flexCenter}
  justify-content: flex-start;
  height: 100%;
  position: relative;
  z-index: 0;
`;

const OuterWrapper = styled.div`
  background-color: ${helpers.schoolPageColor};
  position: relative;
  z-index: 1;
  clip-path: ${helpers.clipPathCurve};
  //
  // &:after {
  //   content: "";
  //   position: absolute;
  //   width: 100%;
  //   background-color: inherit;
  //   border-bottom: ${helpers.rhythmDiv * 8}px solid ${helpers.schoolPageColor};
  //   border-radius: 100%;
  //   bottom: -${helpers.rhythmDiv * 8}px;
  //   z-index: -1;
  //   height: ${helpers.rhythmDiv * 8}px;
  //
  //   @media screen and (max-width: ${helpers.tablet}px) {
  //     opacity: 0.5;
  //   }
  // }
`;

const Wrapper = styled.div`
  max-width: ${helpers.schoolPageContainer}px;
  height: 600px;
  margin: 0 auto;
  background-image: url(${props => props.bgSrc});
  background-size: 500px;
  background-position: 100% calc(100% - 14px);
  background-repeat: no-repeat;
  position: relative;

  @media screen and (max-width: ${helpers.tablet}px) {
    background-position: calc(100% + 125px) calc(100% - 14px);
  }

  @media screen and (max-width: ${helpers.mobile}px) {
    background-position: calc(100% + 250px) calc(100% - 14px);
  }
`;

const HeaderOverlay = styled.div`
  display: none;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${helpers.overlayColor};
  z-index: -1;

  @media screen and ( max-width: ${helpers.tablet}px) {
    display: block;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;

  @media screen and (max-width: ${helpers.mobile}px) {
    flex-direction: column;
  }
`;

const ButtonWrapper = styled.div`
  @media screen and (max-width: ${helpers.tablet}px) {
    display: none;
  }
`;

const ButtonSmallWrapper = styled.div`
  display: none;

  @media screen and (max-width: ${helpers.tablet}px) {
    display: block;
  }

  @media screen and (max-width: ${helpers.mobile}px) {
    width: 100%;
    margin-top: ${helpers.rhythmDiv}px;
    margin-left: 0;
  }
`;

const SchoolHeader = (props) => (
  <OuterWrapper>
    <Wrapper bgSrc={props.schoolHeaderImgSrc}>
      <HeaderContentWrapper>
        <HeaderContent>
          <Title>{props.title}</Title>
          <Content>{props.content}</Content>
          <InputWrapper>
            <TextField
              id="user-email"
              placeholder="Enter Your Email Id"
              type="email"
              color={helpers.lightTextColor}
              className={props.classes.root}
              InputProps={{
                disableUnderline: true,
                classes: {
                    root: props.classes.formControl,
                    input: props.classes.userEmailInput,
                    inkbar: props.classes.userEmailInputInkBar
                }
              }}
              onChange={props.onEmailFieldChange}/>
              <ButtonWrapper>
                <PrimaryButton
                  label="Sign Up"
                  increaseHeight
                  noMarginBottom
                  onClick={props.onSignUpBtnClick} />
              </ButtonWrapper>
              <ButtonSmallWrapper>
                <PrimaryButton
                  label="Sign Up"
                  increaseHeight
                  noMarginBottom
                  boxShadow
                  onClick={props.onSignUpBtnClick} />
              </ButtonSmallWrapper>
            </InputWrapper>
        </HeaderContent>

        <HeaderOverlay>
          {/* This div adds an overlay over the background in smaller sizes */}
        </HeaderOverlay>
      </HeaderContentWrapper>
    </Wrapper>
  </OuterWrapper>
);

SchoolHeader.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  schoolHeaderImgSrc: PropTypes.string,
}

SchoolHeader.defaultProps = {
  title: 'This is your school',
  content: 'Amazing things happen when people enter these doors',
  schoolHeaderImgSrc: schoolDoorImgSrc
}

export default withStyles(styles)(SchoolHeader);
