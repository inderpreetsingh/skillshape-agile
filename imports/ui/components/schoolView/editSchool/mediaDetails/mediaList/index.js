import React from "react";
import MediaListRender from "./mediaListRender";

export default class MediaList extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {}
  }

  render() {
    return MediaListRender.call(this, this.props);
  }

}