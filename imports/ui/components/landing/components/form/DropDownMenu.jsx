import React, { Component } from "react";
import { withStyles } from "material-ui/styles";
import IconButton from "material-ui/IconButton";
import Menu, { MenuItem } from "material-ui/Menu";
// import {MenuItem from "material-ui/Menu";
import MoreVertIcon from "material-ui-icons/MoreVert";

import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";

const styles = {
  iconButton: {
    cursor: "pointer",
    width: 24,
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
      menu: false,
      selectedOptionValue: ""
    };
  }

  handleMenuState = state => {
    this.setState(prevState => {
      return {
        ...prevState,
        menu: state
      };
    });
  };

  handleMenuItemClick = name => {
    console.log(name);
  };

  render() {
    const { menu } = this.state;
    const {
      options,
      selectedOptionValue,
      onMenuButtonClick,
      menuOptions,
      classes
    } = this.props;
    return (
      <div>
        <IconButton
          aria-owns={menu ? "my-menu" : null}
          aria-label="More"
          aria-haspopup="true"
          onClick={this.handleClick}
          classes={{
            root: classes.iconButton,
            icon: classes.icon
          }}
        >
          <MoreVertIcon onClick={onMenuButtonClick} />
        </IconButton>

        <Menu id="my-menu" open={menu} onClose={this.hanlde}>
          {menuOptions.map(option => (
            <MenuItem
              key={option}
              selected={option.value === selectedOptionValue}
              onClick={this.handleMenuItemClick}
            >
              {option.displayValue}
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  }
}

export default withStyles(styles)(DropDownMenu);
