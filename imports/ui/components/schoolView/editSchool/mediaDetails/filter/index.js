import React from "react";
import MediaFilterRender from "./mediaFilterRender";
import { withStyles } from "/imports/util";
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

class MediaFilter extends React.Component {

  constructor(props){
    super(props);
    this.state = {
    	startDate: null,
    	endDate: null,
      mediaName: ""
    }
  }

  resetFilter = () => {
    this.setState({
      startDate: null,
      endDate: null,
      mediaName: ""
    })
    this.props.resetFilter();
  }

  render() {
    return MediaFilterRender.call(this, this.props);
  }

}

const styles = theme => {
  return {
    searchBtn: {
      padding: theme.spacing.unit * 3,
      marginLeft: theme.spacing.unit * 3,
      color: helpers.action,
    },
    resetBtn: {
      padding: theme.spacing.unit * 3,
      marginLeft: theme.spacing.unit * 3,
      color: helpers.reset,
    },
  }
}

export default withStyles(styles)(MediaFilter);