import Button from "material-ui/Button";
import Icon from "material-ui/Icon";
import { withStyles } from "material-ui/styles";
import PropTypes from "prop-types";
import React from "react";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";



/* Because we are extending a material ui button, it us jss instead of styled Components */
const styles = {
  formGhostButton: {
    fontFamily: helpers.specialFont,
    fontSize: helpers.baseFontSize,
    backgroundColor: "transparent",
    border: "1px solid",
    borderColor: helpers.primaryColor,
    color: helpers.primaryColor,
    textTransform: "none",
    fontWeight: 500,
    marginRight: "10px",
    "&:hover": {
      backgroundColor: helpers.primaryColor,
      color: "white"
    }
  },
  fullWidth: {
    width: "100%"
  },
  buttonIcon: {
    display: "inline-block",
    marginRight: "5px",
    fontSize: helpers.baseFontSize
  },
  whiteColor: {
    color: "white",
    borderColor: "white",
    "&:hover": {
      backgroundColor: "white",
      color: "black"
    }
  },
  redColor: {
    color: helpers.alertColor,
    borderColor: helpers.alertColor,
    "&:hover": {
      backgroundColor: helpers.alertColor,
      color: "white"
    }
  },
  blackColor: {
    color: helpers.black,
    borderColor: helpers.black,
    "&:hover": {
      backgroundColor: helpers.black,
      color: "white"
    }
  },
  greyColor: {
    color: helpers.cancel,
    borderColor: helpers.cancel,
    "&:hover": {
      backgroundColor: helpers.cancel,
      color: "white"
    }
  },
  darkGreyColor: {
    color: helpers.darkBgColor,
    borderColor: helpers.darkBgColor,
    "&:hover": {
      backgroundColor: helpers.darkBgColor,
      color: "white"
    }
  },
  icon: {
    display: "inline-block",
    marginRight: "5px",
    fontSize: "inherit"
  },
  customIcon: {
    display: "inline-block",
    fontSize: "inherit"
  }
};

const getIconForButton = props => {
  const CustomIcon = props.customIcon;
  if (CustomIcon && props.icon) {
    return <CustomIcon className={props.classes.customIcon} />;
  } else if (props.icon) {
    return <Icon className={props.classes.icon}>{props.iconName}</Icon>;
  }

  return "";
};

const FormGhostButton = props => {
  let rootClass = ``;
  if (props.fullWidth) {
    rootClass = `${props.classes.formGhostButton} ${props.classes.fullWidth}`;
  } else {
    rootClass = props.classes.formGhostButton;
  }
  // debugger;
  /* prettier-ignore */
  if (props.blackColor || (props.color == "black")) {
    rootClass = rootClass + " " + props.classes.blackColor;
  } else if (props.greyColor || (props.color == "grey")) {
    rootClass = rootClass + " " + props.classes.greyColor;
  } else if (props.darkGreyColor || (props.color == "dark-grey")) {
    rootClass = rootClass + " " + props.classes.darkGreyColor;
  } else if (props.alertColor || (props.color == "alert")) {
    rootClass = rootClass + " " + props.classes.redColor;
  }else if(props.whiteColor || (props.color == 'white')) {
    rootClass = rootClass + " " + props.classes.whiteColor;
  }
  return (
    <Button
      type={props.type}
      classes={{
        root: rootClass
      }}
      onClick={props.onClick}
      form={props.form}
    >
      {getIconForButton(props)}

      {props.label ? props.label : "Submit"}
    </Button>
  );
};

FormGhostButton.propTypes = {
  type: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.bool,
  iconName: PropTypes.string,
  label: PropTypes.string,
  fullWidth: PropTypes.bool,
  color: PropTypes.string,
  classes: PropTypes.object.isRequired,
  customIcon: PropTypes.element
};

FormGhostButton.defaultProps = {
  type: "button"
};

export default withStyles(styles)(FormGhostButton);
