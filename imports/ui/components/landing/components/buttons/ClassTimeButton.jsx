import Button from "material-ui/Button";
import Icon from "material-ui/Icon";
import { withStyles } from "material-ui/styles";
import PropTypes from "prop-types";
import React from "react";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";



/* Because we are extending a material ui button, it us jss instead of styled Components */
const styles = {
  classTimeButton: {
    fontFamily: helpers.specialFont,
    fontSize: helpers.baseFontSize,
    padding: `0`,
    backgroundColor: helpers.primaryColor,
    height: "inherit",
    minHeight: "32px",
    lineHeight: 1,
    marginRight: helpers.rhythmDiv,
    "&:hover": {
      backgroundColor: helpers.primaryColor
    }
  },
  classTimeSecondaryButton: {
    fontSize: helpers.baseFontSize,
    padding: "0px",
    height: "inherit",
    minHeight: "34px",
    fontFamily: helpers.specialFont,
    backgroundColor: helpers.panelColor,
    textTransform: "none",
    lineHeight: 1,
    "&:hover": {
      backgroundColor: helpers.lightTextColor
    }
  },
  classTimeButtonGhost: {
    border: `2px solid ${helpers.cancel}`,
    borderColor: helpers.cancel,
    backgroundColor: "transparent",
    transition: "all 0.3s linear",
    minHeight: "34px",
    lineHeight: 1,
    "&:hover": {
      backgroundColor: helpers.cancel
    },
    "&:hover > span": {
      color: helpers.lightTextColor
    }
  },
  classTimeButtonLabel: {
    color: helpers.lightTextColor,
    lineHeight: 1,
    textTransform: "none",
    height: "35px",
    padding: "15px"
  },
  classTimeSecondaryButtonLabel: {
    color: helpers.textColor,
    lineHeight: 1,
    textTransform: "none",
    height: "35px",
    padding: "15px"
  },
  classTimeButtonGhostLabel: {
    color: helpers.cancel,
    lineHeight: 1,
    textTransform: "none",
    "&:hover": {
      color: helpers.lightTextColor
    }
  },
  classTimeWhiteButton: {
    backgroundColor: "white",
    lineHeight: 1,
    "&:hover": {
      backgroundColor: "white"
    }
  },
  classTimeWhiteButtonLabel: {
    color: helpers.textColor,
    lineHeight: 1,
    textTransform: "none",
    "&:hover": {
      color: helpers.textColor
    }
  },
  lgButton: {
    minWidth: 200 // this is the width of Paper Card
  },
  fullWidth: {
    width: "100%"
  },
  noMarginBottom: {
    marginBottom: 0
  },
  classTimeButtonIcon: {
    display: "inline-block",
    marginRight: "5px",
    fontSize: "inherit"
  },
  classTimeButtonCustomIcon: {
    display: "inline-block",
    fontSize: "inherit"
  },
  ["@media (max-width:" + helpers.mobile + "px)"]: {
    classTimeButton: {
      width: "100%"
    }
  }
};

const getIconForButton = props => {
  const CustomIcon = props.customIcon;
  if (CustomIcon && props.icon) {
    return <CustomIcon className={props.classes.classTimeButtonCustomIcon} />;
  } else if (props.icon) {
    return (
      <Icon className={props.classes.classTimeButtonIcon}>
        {props.iconName}
      </Icon>
    );
  }

  return "";
};

const ClassTimeButton = props => {
  let rootClass = props.classes.classTimeButton;
  let labelClass = props.classes.classTimeButtonLabel;
  // console.log(CustomIcon,"Custom Icon")
  if (props.fullWidth && props.noMarginBottom) {
    rootClass = `${props.classes.classTimeButton} ${props.classes.fullWidth} ${
      props.classes.noMarginBottom
    }`;
  } else if (props.fullWidth) {
    rootClass = `${props.classes.classTimeButton} ${props.classes.fullWidth}`;
  } else if (props.noMarginBottom) {
    rootClass = `${props.classes.classTimeButton} ${
      props.classes.noMarginBottom
    }`;
  } else {
    rootClass = props.classes.classTimeButton;
  }

  if (props.ghost) {
    rootClass = rootClass + " " + props.classes.classTimeButtonGhost;
    labelClass = props.classes.classTimeButtonGhostLabel;
  } else if (props.secondary) {
    rootClass = rootClass + " " + props.classes.classTimeSecondaryButton;
    labelClass = props.classes.classTimeSecondaryButtonLabel;
  } else if (props.white) {
    rootClass = rootClass + " " + props.classes.classTimeWhiteButton;
    labelClass = props.classes.classTimeWhiteButtonLabel;
  }

  if (props.lgButton) {
    rootClass = rootClass + " " + props.classes.lgButton;
  }

  return (
    <Button
      classes={{
        root: rootClass,
        label: labelClass
      }}
      itemScope={props.itemScope}
      itemType={props.itemType}
      onClick={props.onClick}
      disabled={props.disabled}
      type={props.type}
      style={{ backgroundColor: `${props.bgColor && props.bgColor}` }}
    >
      {getIconForButton(props)}

      {props.label ? props.label : "Submit"}
    </Button>
  );
};

ClassTimeButton.propTypes = {
  onClick: PropTypes.func,
  icon: PropTypes.bool,
  customIcon: PropTypes.element,
  iconName: PropTypes.string,
  label: PropTypes.string,
  fullWidth: PropTypes.bool,
  noMarginBottom: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  itemScope: PropTypes.string,
  itemType: PropTypes.string
};

export default withStyles(styles)(ClassTimeButton);
