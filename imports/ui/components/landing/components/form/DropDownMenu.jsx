import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import IconButton from "material-ui/IconButton";
import Menu, { MenuItem } from "material-ui/Menu";
// import {MenuItem from "material-ui/Menu";
import MoreVertIcon from "material-ui-icons/MoreVert";

import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";

const styles = {
  iconButton: {
    cursor: "pointer",
    width: 8,
    height: 24,
    fontSize: helpers.baseFontSize
  },
  icon: {
    height: 24,
    width: 24
  }
};

class DropDownMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null
    };
  }

  handleClick = e => {
    this.setState({
      anchorEl: e.currentTarget
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null
    });
  };

  handleMenuItemClick = option => () => {
    this.setState({
      anchorEl: null
    });

    this.props.onMenuItemClick && this.props.onMenuItemClick(option);
  };

  handleMenuEnter = element => {
    // NOTE: Allow first menu to not be focused.
    element.firstChild.firstChild.blur();
    // console.log(element, );
  };

  render() {
    const { menu, anchorEl } = this.state;
    const {
      options,
      selectedOptionValue,
      onMenuButtonClick,
      menuButton,
      menuOptions,
      menuIconClass,
      menuButtonClass,
      classes,
    } = this.props;

    let rootClass,
      iconClass = "";
    rootClass = classes.iconButton;
    iconClass = classes.icon;

    if (menuButtonClass) rootClass = rootClass + " " + menuButtonClass;
    if (menuIconClass) iconClass = iconClass + " " + menuIconClass;
    return (
      <div>
        {(menuButton && React.clone(menuButton)) || (
          <IconButton
            aria-owns={anchorEl ? "my-menu" : null}
            aria-label="More"
            aria-haspopup="true"
            onClick={this.handleClick}
            classes={{
              root: rootClass,
              icon: iconClass
            }}
          >
            <MoreVertIcon />
          </IconButton>
        )}

        <Menu
          id="my-menu"
          disableAutoFocusItem={true}
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={this.handleClose}
          onEnter={this.handleMenuEnter}
        >
          {menuOptions.map(option => (
            <MenuItem
              key={option.value}
              selected={false}
              onClick={this.handleMenuItemClick(option)}
            >
              {option.name}
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  }
}

DropDownMenu.propTypes = {
  menuButton: PropTypes.element,
  menuOptions: PropTypes.arrayOf({
    name: PropTypes.string,
    value: PropTypes.string
  })
};

export default withStyles(styles)(DropDownMenu);
