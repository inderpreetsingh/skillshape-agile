import React from "react";
import styled from 'styled-components';
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Button from "material-ui/Button";

import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

const DISTRIBUTED = 'distributed';

const btnStyles = {
  marginRight: helpers.rhythmDiv,
  marginBottom: helpers.rhythmDiv,
  width: helpers.baseFontSize * 9,
  display: "inline-block",
  borderRadius: "4px",
  position: "relative",
  background: "#c0c1c0"
}

const styles = theme => {
  // console.log("theme", theme);
  return {
    btn: {
      ...btnStyles,
    },
    btnActive: {
      ...btnStyles,
      background: helpers.primaryColor
    },
    btnDistributed: {
      ...btnStyles,
      [`@media screen and (max-width: ${helpers.mobile}px)`]: {
        width: '100%'
      }
    },
    btnActiveDistributed: {
      ...btnStyles,
      background: helpers.primaryColor,
      [`@media screen and (max-width: ${helpers.mobile}px)`]: {
        width: '100%'
      }
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
  ${props => props.variant === DISTRIBUTED && 'justify-content: space-between; flex-wrap: nowrap;'}

  @media screen and (max-width: ${helpers.mobile}px) {
    ${props => props.variant === DISTRIBUTED && 'flex-direction: column; align-items: center;'}
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
    const btn = variant === DISTRIBUTED ? classes.btnDistributed : classes.btn;
    const btnActive = variant === DISTRIBUTED ? classes.btnActiveDistributed : classes.btnActive;
    return (
      <div className="responsive-tab">
        <InnerWrapper variant={variant}>
          {this.props.tabs.map((tab, index) => {
            return (
              <Button
              key={index.toString()}
                classes={{ label: classes.muiLabel }}
                className={
                  index == this.state.tabValue ? btnActive : btn
                }
                raised
                color={index == this.state.tabValue && this.props.color}
                onClick={() => {
                  this.props.onTabChange(index);
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
