import React from "react";
import styled from "styled-components";
import ClearIcon from "material-ui-icons/Clear";

import { withStyles } from "material-ui/styles";
import FormGhostButton from "/imports/ui/components/landing/components/buttons/FormGhostButton.jsx";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";

const styles = {
  icon: {
    position: "absolute",
    right: 0,
    top: 0
  }
};

const Wrapper = styled.div`
  position: relative;
  backgound: ${props => props.bgColor};
  padding: ${helpers.rhythmDiv * 2}px;
`;

const TextWrapper = styled.div`
  /* prettier-ignore */
  ${helpers.flexHorizontalSpaceBetween}
`;

const Text = style.p`
  margin: 0;
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize}px;
  color: white;
  line-height: 1;
`;

const Notification = props => (
  <Wrapper bgColor={props.bgColor}>
    <ClearIcon classes={{ root: props.classes.icon }} />
    <TextWrapper>
      <Text>You do not have packages that will cover this class!</Text>
      <FormGhostButton onClick={props.onPurchaseButtonClick}>
        Purchase Classes
      </FormGhostButton>
    </TextWrapper>
  </Wrapper>
);

Notification.propTypes = {
  bgColor: PropTypes.string,
  onPurchaseButtonClick: PropTypes.func
};

Notification.defaultProps = {
  bgColor: helpers.alertColor
};

export default withStyles(styles)(Notification);
