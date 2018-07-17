import React, { Component, Fragment } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";

import IconButton from "material-ui/IconButton";
import Input from "material-ui/Input";
import Paper from "material-ui/Paper";

import ClearIcon from "material-ui-icons/Clear";
import SearchIcon from "material-ui-icons/Search";
import { grey } from "material-ui/colors";

import * as helpers from "./jss/helpers.js";

const styles = {
  root: {
    height: "100%",
    width: "100%",
    padding: "0 8px",
    borderRadius: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    boxShadow: helpers.inputBoxShadow
  },
  iconButtonRoot: {
    height: 32,
    width: 32,
    transition:
      "transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1), opacity 200ms cubic-bezier(0.4, 0.0, 0.2, 1)"
  },
  defaultBorderRadius: {
    borderRadius: 2
  },
  searchContainer: {},
  hide: {
    position: "absolute",
    opacity: 0,
    transform: "scale(0,0)"
  },
  show: {
    opacity: 1,
    transform: "scale(1,1)"
  },
  iconTransitions: {
    transition:
      "transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1), opacity 200ms cubic-bezier(0.4, 0.0, 0.2, 1)"
  },
  rightAlign: {
    textAlign: "right"
  }
};

const iconTransitions = {
  transition:
    "transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1), opacity 200ms cubic-bezier(0.4, 0.0, 0.2, 1)"
};

const LeftSideInput = styled.div`
  display: ${props => (props.inputOnSide === "left" ? "block" : "none")};
  width: 100%;
`;

const RightSideInput = styled.div`
  display: ${props => (props.inputOnSide === "right" ? "block" : "none")};
`;

class MySearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focus: false,
      value: props.value,
      active: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({ ...this.state, value: nextProps.value, active: false });
    }
    if (this.props.resetSearch != nextProps.resetSearch) {
      this.setState({ value: "", active: false });
    }
  }

  handleFocus = () => {
    this.setState({ focus: true });
  };

  handleBlur = () => {
    this.setState({ focus: false });
    if (this.state.value.trim().length === 0) {
      this.setState({ value: "" });
    }
  };

  handleInput = e => {
    // this.setState({value: e.target.value})
    this.setState({
      value: e.target.value,
      active: e.target.value !== "" ? true : false
    });

    this.props.onChange && this.props.onChange(e);
  };

  handleCancel = () => {
    this.setState({ active: false, value: "" });
    this.props.onChange && this.props.onChange("");
  };

  handleKeyPressed = e => {
    if (e.charCode === 13 || e.key === "Enter") {
      this.props.onRequestSearch(this.state.value);
    }
  };

  _getCloseIconClassName = (active, classes) => {
    if (this.props.noCloseIcon) {
      return classes.hide;
    }
    return active ? classes.show : classes.hide;
  };

  _getShowIconClassName = (active, classes) => {
    if (this.props.noCloseIcon) {
      return classes.show;
    }
    return active ? classes.hide : classes.show;
  };
  render() {
    const { value } = this.state;
    let self = this;
    // console.log('value in MySearchBar===>',value);
    // console.log('state in MySearchBar===>',this.state);
    // console.log('props in MySearchBar===>',this.props);
    const {
      closeIcon,
      disabled,
      onRequestSearch, // eslint-disable-line
      searchIcon,
      classes,
      ...inputProps
    } = this.props;

    let closeIconClass =
      classes.iconButtonRoot +
      " " +
      this._getCloseIconClassName(this.state.active, classes);
    let showIconClass =
      classes.iconButtonRoot +
      " " +
      this._getShowIconClassName(this.state.active, classes);
    let rootClass = `${classes.root} `;
    let inputClass = ``;

    if (this.props.defaultBorderRadius) {
      rootClass += `${classes.defaultBorderRadius}`;
    }

    if (this.props.rightAlign) {
      inputClass = `${classes.rightAlign}`;
    }

    const props = this.props;
    let inputRef;
    if (props.googlelocation) {
      setTimeout(() => {
        let options = { strictBounds: true };
        // Google's API
        let autocomplete = new google.maps.places.Autocomplete(
          inputRef,
          options
        );
        // This runs when user changes location.
        autocomplete.addListener("place_changed", () => {
          let place = autocomplete.getPlace();
          alert(place);
          console.log("place chnaged", place);
          let coords = [];
          coords[0] = place.geometry["location"].lat();
          coords[1] = place.geometry["location"].lng();
          this.setState({ value: place.formatted_address });
          props.onLocationChange({
            name: place.name,
            coords,
            fullAddress: place.formatted_address
          });
        });
      }, 2000);
    }

    // console.log('clostIconClass',closeIconClass,showIconClass);
    return (
      <Paper className={rootClass}>
        <LeftSideInput inputOnSide={this.props.inputOnSide}>
          <Input
            {...inputProps}
            inputRef={ref => (inputRef = ref)}
            onBlur={this.handleBlur}
            value={value}
            onChange={this.handleInput}
            onKeyUp={this.handleKeyPressed}
            onFocus={this.handleFocus}
            fullWidth
            disableUnderline={true}
            disabled={disabled}
            classes={{ input: inputClass }}
          />
        </LeftSideInput>
        {this.props.withIcon && (
          <Fragment>
            <IconButton
              style={styles.iconTransitions}
              className={showIconClass}
              disabled={disabled}
              onClick={props.onSearchIconClick}
            >
              {React.cloneElement(searchIcon)}
            </IconButton>
            <IconButton
              style={styles.iconTransitions}
              onClick={this.handleCancel}
              className={closeIconClass}
              onClick={props.onCloseIconClick}
              disabled={disabled}
            >
              {React.cloneElement(closeIcon)}
            </IconButton>
          </Fragment>
        )}
        <RightSideInput inputOnSide={this.props.inputOnSide}>
          <Input
            {...inputProps}
            onBlur={this.handleBlur}
            value={value}
            onChange={this.handleInput}
            onKeyUp={this.handleKeyPressed}
            onFocus={this.handleFocus}
            fullWidth
            disableUnderline={true}
            disabled={disabled}
          />
        </RightSideInput>
      </Paper>
    );
  }
}

MySearchBar.defaultProps = {
  closeIcon: <ClearIcon style={{ color: grey[500] }} />,
  disabled: false,
  placeholder: "Search",
  searchIcon: <SearchIcon style={{ color: grey[500] }} />,
  style: null,
  inputOnSide: "left",
  defaultBorderRadius: false,
  withIcon: true,
  rightAlign: false,
  noCloseIcon: false
};

MySearchBar.propTypes = {
  // This specifies the side in the bar where there is input.
  inputOnSide: PropTypes.string,
  // To specify whether we want closing/searching icon
  withIcon: PropTypes.bool,
  closeIcon: PropTypes.node,
  noCloseIcon: PropTypes.bool,
  disabled: PropTypes.bool,
  /** Sets placeholder for the embedded text field. */
  placeholder: PropTypes.string,
  /** Fired when the text value changes. */
  onChange: PropTypes.func,
  /** Fired when the search icon is clicked. */
  onRequestSearch: PropTypes.func,
  onCloseIconClick: PropTypes.func,
  onSearchIconClick: PropTypes.func,
  searchIcon: PropTypes.node,
  value: PropTypes.string
};

export default withStyles(styles)(MySearchBar);
