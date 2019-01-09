import React from "react";
import styled from 'styled-components';
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Button from "material-ui/Button";

import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

const styles = theme => {
  // console.log("theme", theme);
  return {
    btn: {
      marginRight: helpers.rhythmDiv,
      marginBottom: helpers.rhythmDiv,
      width: helpers.baseFontSize * 9,
      display: "inline-block",
      borderRadius: "4px",
      position: "relative",
      background: "#c0c1c0"
    },
    btnActive: {
      marginBottom: helpers.rhythmDiv,
      marginRight: helpers.rhythmDiv,
      width: 165,
      color: "#fff"
    },
    muiLabel: {
      color: "#fff",
      fontSize: "14px",
      fontWeight: "bold"
    }
  };
};

// Currently the distributed works well for 3 items only.

const InnerWrapper = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  margin: ${helpers.rhythmDiv}px 0; 
  ${props => props.variant === 'distributed' && 'justify-content: space-between;'}
  @media screen and (max-width: ${helpers.mobile + 100}px) {
    ${props => props.variant === 'distributed' && 'justify-content: flex-start;'}
  } 
`;

class ResponsiveTabs extends React.Component {
  constructor(props) {
    super(props);
    let { defaultValue } = this.props;

    this.state = {
      tabValue: this.props.tabValue
    };
  }
  componentWillReceiveProps(nextProps) {
    // We should set state for class details tab so that it opens automatically.
    if (this.props.tabValue !== nextProps.tabValue) {
      this.setState({ tabValue: nextProps.tabValue });
    }
  }
  componentDidMount() {
    if (this.props.tabValue == undefined) {
      this.props.onTabChange(0);
    } else {
      this.props.onTabChange(this.props.tabValue);
    }
  }

  render() {
    const { classes, defaultValue, variant } = this.props;
    return (
      <div className="responsive-tab">
        <InnerWrapper variant={variant}>
          {this.props.tabs.map((tab, index) => {
            return (
              <Button
                classes={{ label: classes.muiLabel }}
                className={
                  index == this.state.tabValue ? classes.btnActive : classes.btn
                }
                raised
                color={index == this.state.tabValue && this.props.color}
                onClick={() => {
                  this.props.onTabChange(index);
                  this.setState({ tabValue: index });
                }}
              >
                {tab}
              </Button>
            );
          })}
        </InnerWrapper>
      </div>
    );
  }
}

ResponsiveTabs.propTypes = {
  variant: PropTypes.string,
  classes: PropTypes.object.isRequired
};

ResponsiveTabs.defaultProps = {

}

export default withStyles(styles)(ResponsiveTabs);
