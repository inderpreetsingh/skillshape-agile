import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { withStyles } from "material-ui/styles";
import Button from "material-ui/Button";
import Icon from "material-ui/Icon";

import Preloader from "/imports/ui/components/landing/components/Preloader.jsx";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";

/* Because we are extending a material ui button, it us jss instead of styled Components */
const styles = {
  skillShapeButton: {
    marginRight: helpers.rhythmDiv,
    marginBottom: helpers.rhythmDiv,
    fontFamily: helpers.specialFont,
    fontSize: helpers.baseFontSize,
    backgroundColor: helpers.action,
    "&:hover": {
      backgroundColor: helpers.action
    }
  },
  skillShapeButton: {
    color: helpers.lightTextColor,
    textTransform: "none"
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
  } else if (props.withPreloader) {
    return (
      <Preloader width={helpers.rhythmDiv * 2} height={helpers.rhythmDiv * 2} />
    );
  }

  return "";
};

const getColor = (props, rootClass) => {
  if (props.action) return rootClass + " " + props.classes.action;
  else if (props.information)
    return rootClass + " " + props.classes.information;
  else if (props.danger) return rootClass + " " + props.classes.danger;
  else if (props.caution) return rootClass + " " + props.classes.caution;
  else if (props.cancel) return rootClass + " " + props.classes.cancel;
  else if (props.black) return rootClass + " " + props.classes.black;
  else return rootClass + " " + props.classes.action;
};

const getLabelColor = (props, labelClass) => {
  if (props.caution) return labelClass + " " + props.classes.darkLabelColor;
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

  if (props.itemScope && props.itemType) {
    return (
      <Button
        classes={{
          root: rootClass,
          label: labelClass
        }}
        onClick={props.onClick}
        disabled={props.disabled}
        itemScope
        itemType={props.itemType}
      >
        {getIconForButton(props)}

        {props.label ? props.label : "Submit"}
      </Button>
    );
  }

  return (
    <Button
      classes={{
        root: rootClass,
        label: labelClass
      }}
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
