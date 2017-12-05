import React from "react";
import MediaFilterRender from "./mediaFilterRender";

export default class MediaFilter extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
    	startDate: null,
    	endDate: null,
    }
  }

  render() {
    return MediaFilterRender.call(this, this.props);
  }

}