import Button from "material-ui/Button";
import Icon from "material-ui/Icon";
import { CircularProgress } from "material-ui/Progress";
import { withStyles } from "material-ui/styles";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";



/* Because we are extending a material ui button, it us jss instead of styled Components */
const styles = {
  primaryButton: {
    marginRight: helpers.rhythmDiv,
    marginBottom: helpers.rhythmDiv,
    fontFamily: helpers.specialFont,
    fontSize: helpers.baseFontSize,
    fontWeight: 400,
    backgroundColor: helpers.primaryColor,
    "&:hover": {
      backgroundColor: helpers.primaryColor
    }
  },
  disabled: {
    backgroundColor: helpers.panelColor,
    "&:hover": {
      backgroundColor: helpers.panelColor
    }
  },
  disabledButtonLabel: {
    color: helpers.textColor,
    textTransform: "none"
  },
  primaryButtonLabel: {
    color: helpers.lightTextColor,
    textTransform: "none"
  },
  fullWidth: {
    width: "100%"
  },
  noMarginBottom: {
    marginBottom: 0
  },
  noMarginRight: {
    marginRight: 0
  },
  circularProgress: {},
  icon: {
    display: "inline-block",
    marginRight: "5px",
    fontSize: "inherit"
  },
  customIcon: {
    display: "inline-block",
    fontSize: "inherit"
  },
  searchBarHeight: {
    height: 48
  },
  searchBarShadow: {
    boxShadow: `2px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14) , 0px 3px 1px -2px rgba(0, 0, 0, 0.12)`
  },
  ["@media (max-width:" + helpers.mobile + "px)"]: {
    primaryButton: {
      width: "100%"
    }
  }
};

const PreloaderWrapper = styled.div`
  width: ${helpers.rhythmDiv * 4}px;
  transform: translateY(4px);
`;

const getIconForButton = props => {
  const CustomIcon = props.customIcon;
  if (CustomIcon && props.icon) {
    return <CustomIcon className={props.classes.customIcon} />;
  } else if (props.icon) {
    return <Icon className={props.classes.icon}>{props.iconName}</Icon>;
  }

  return "";
};

const getButtonClassesConfiguration = classes => {
  const {
    disabled,
    noMarginRight,
    noMarginBottom,
    fullWidth,
    searchBarHeight,
    searchBarShadow,
    disabledButtonLabel
  } = classes;

  return {
    fullWidth,
    noMarginRight,
    noMarginBottom,
    increaseHeight: searchBarHeight,
    boxShadow: searchBarShadow,
    disabled,
    disabledButtonLabel: disabledButtonLabel
  };
};

const createString = (propertyToCheck, stringToCreate) => {
  return propertyToCheck === "true" ? stringToCreate : null;
};

const PrimaryButton = props => {
  let rootClass = ``;
  let labelClass = props.classes.primaryButtonLabel;
  // const buttonClassesConfiguration = getButtonClassesConfiguration(props.classes);
  // console.log(CustomIcon,"Custom Icon")
  if (props.fullWidth && props.noMarginBottom) {
    rootClass = `${props.classes.primaryButton} ${props.classes.fullWidth} ${
      props.classes.noMarginBottom
    }`;
  } else if (props.fullWidth) {
    rootClass = `${props.classes.primaryButton} ${props.classes.fullWidth}`;
  } else if (props.noMarginBottom) {
    rootClass = `${props.classes.primaryButton} ${
      props.classes.noMarginBottom
    }`;
  } else {
    rootClass = props.classes.primaryButton;
  }

  if (props.noMarginRight) {
    rootClass = rootClass + " " + `${props.classes.noMarginRight}`;
  }

  // These classes are very specific to the filter button in the searchBar
  if (props.increaseHeight) {
    rootClass = rootClass + " " + props.classes.searchBarHeight;
  }

  if (props.boxShadow) {
    rootClass = rootClass + " " + props.classes.searchBarShadow;
  }

  if (props.disabled) {
    rootClass = rootClass + " " + props.classes.disabled;
    labelClass = props.classes.disabledButtonLabel;
  }

  // const rootClasses = [
  //   createString(props.noMarginBottom, "noMarginBottom"),
  //   createString(props.boxShadow, "boxShadow"),
  //   createString(props.disabled,'disabled')
  //   createString(props.increaseHeight,'increaseHeight')
  //   createString(props.noMarginBottom,'noMarginBottom')
  //   createString(props.noMarginBottom,'noMarginBottom')
  //   createString(props.noMarginBottom,'noMarginBottom')
  // ];
  // const labelClasses = [];

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
      formId={props.formId}
    >
      {getIconForButton(props)}

      {props.label ? props.label : "Submit"}

      {props.withLoader && (
        <PreloaderWrapper>
          <CircularProgress
            color="secondary"
            className={props.classes.circularProgress}
            thickness={5}
            size={16}
          />
        </PreloaderWrapper>
      )}
    </Button>
  );
};

PrimaryButton.propTypes = {
  onClick: PropTypes.func,
  icon: PropTypes.bool,
  customIcon: PropTypes.element,
  iconName: PropTypes.string,
  label: PropTypes.string,
  fullWidth: PropTypes.bool,
  noMarginBottom: PropTypes.bool,
  increaseHeight: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  itemScope: PropTypes.bool,
  boxShadow: PropTypes.bool,
  itemType: PropTypes.string,
};

PrimaryButton.defaultProps = {
  disabled: false
};

export default withStyles(styles)(PrimaryButton);
