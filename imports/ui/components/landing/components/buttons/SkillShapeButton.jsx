import Button from "material-ui/Button";
import Icon from "material-ui/Icon";
import { withStyles } from "material-ui/styles";
import PropTypes from "prop-types";
import React from "react";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";



/* Because we are extending a material ui button, it us jss instead of styled Components */
const styles = {
  skillShapeButton: {
    marginRight: helpers.rhythmDiv,
    marginBottom: helpers.rhythmDiv,
    fontFamily: helpers.specialFont,
    fontSize: helpers.baseFontSize,
    backgroundColor: helpers.primary,
    color: helpers.lightTextColor,
    textTransform: "none",
    "&:hover": {
      backgroundColor: helpers.primary
    }
  },
  lightLabelColor: {
    color: helpers.lightTextColor,
    textTransform: "none"
  },
  darkLabelColor: {
    color: helpers.textColor,
    textTransform: "none"
  },
  fullWidth: {
    width: "100%"
  },
  noMarginBottom: {
    marginBottom: 0
  },
  skillShapeButtonIcon: {
    display: "inline-block",
    marginRight: "5px",
    fontSize: "inherit"
  },
  skillShapeButtonCustomIcon: {
    display: "inline-block",
    fontSize: "inherit"
  },
  primary: {
    backgroundColor: helpers.primaryColor,
    "&:hover": {
      backgroundColor: helpers.primaryColor
    }
  },
  action: {
    backgroundColor: helpers.action,
    "&:hover": {
      backgroundColor: helpers.action
    }
  },
  caution: {
    backgroundColor: helpers.caution,
    "&:hover": {
      backgroundColor: helpers.caution
    }
  },
  information: {
    backgroundColor: helpers.information,
    "&:hover": {
      backgroundColor: helpers.information
    }
  },
  danger: {
    backgroundColor: helpers.danger,
    "&:hover": {
      backgroundColor: helpers.danger
    }
  },
  cancel: {
    backgroundColor: helpers.cancel,
    "&:hover": {
      backgroundColor: helpers.cancel
    }
  },
  black: {
    backgroundColor: helpers.black,
    "&:hover": {
      backgroundColor: helpers.black
    }
  },
  white: {
    border: `1px solid ${helpers.black}`,
    backgroundColor: 'white',
    "&:hover": {
      backgroundColor: "white"
    }
  },
  ["@media (max-width:" + helpers.mobile + "px)"]: {
    skillShapeButton: {
      width: "100%"
    }
  }
};

const getIconForButton = props => {
  const CustomIcon = props.customIcon;
  if (CustomIcon && props.icon) {
    return <CustomIcon className={props.classes.skillShapeButtonCustomIcon} />;
  } else if (props.icon) {
    return (
      <Icon className={props.classes.skillShapeButtonIcon}>
        {props.iconName}
      </Icon>
    );
  }

  return "";
};

const getColor = (props, rootClass) => {
  if (props.action) return rootClass + " " + props.classes.action;
  else if (props.primary) return rootClass + " " + props.classes.primary;
  else if (props.information)
    return rootClass + " " + props.classes.information;
  else if (props.danger) return rootClass + " " + props.classes.danger;
  else if (props.caution) return rootClass + " " + props.classes.caution;
  else if (props.cancel) return rootClass + " " + props.classes.cancel;
  else if (props.black) return rootClass + " " + props.classes.black;
  else if (props.white) return rootClass + " " + props.classes.white;
  else return rootClass + " " + props.classes.action;
};

const getLabelColor = (props, labelClass) => {
  if (props.caution || props.white) return labelClass + " " + props.classes.darkLabelColor;
  else return labelClass;
};

const SkillShapeButton = props => {
  let rootClass = ``;
  let labelClass = props.classes.skillShapeButton;

  // console.log(CustomIcon,"Custom Icon")
  if (props.fullWidth && props.noMarginBottom) {
    rootClass = `${props.classes.skillShapeButton} ${props.classes.fullWidth} ${
      props.classes.noMarginBottom
      }`;
  } else if (props.fullWidth) {
    rootClass = `${props.classes.skillShapeButton} ${props.classes.fullWidth}`;
  } else if (props.noMarginBottom) {
    rootClass = `${props.classes.skillShapeButton} ${
      props.classes.noMarginBottom
      }`;
  } else {
    rootClass = props.classes.skillShapeButton;
  }

  // Getting the apt color from the classes.
  rootClass = getColor(props, rootClass);
  labelClass = getLabelColor(props, labelClass);

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
    >
      {getIconForButton(props)}

      {props.label ? props.label : "Submit"}
    </Button>
  );
};

SkillShapeButton.propTypes = {
  onClick: PropTypes.func,
  icon: PropTypes.bool,
  customIcon: PropTypes.element,
  iconName: PropTypes.string,
  label: PropTypes.string,
  fullWidth: PropTypes.bool,
  noMarginBottom: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  itemScope: PropTypes.bool,
  action: PropTypes.bool,
  caution: PropTypes.bool,
  information: PropTypes.bool,
  danger: PropTypes.bool,
  cancel: PropTypes.bool,
  black: PropTypes.bool,
  itemType: PropTypes.string
};

SkillShapeButton.defaultProps = {};

export default withStyles(styles)(SkillShapeButton);
