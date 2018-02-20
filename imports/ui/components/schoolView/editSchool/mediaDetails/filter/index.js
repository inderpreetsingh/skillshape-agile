import React from "react";
import MediaFilterRender from "./mediaFilterRender";

export default class MediaFilter extends React.Component {

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