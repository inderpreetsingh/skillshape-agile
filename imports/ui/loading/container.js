"use strict"

import React from "react";
import { CircularProgress } from 'material-ui/Progress';
import './container.css';

const style = {
  display: 'block',
  position: 'relative',
}

const className = "preload-container"

export class ContainerLoader extends React.Component {

  render () {

    const viewClass = this.props.className
      ? `${className} ${this.props.className}`
      : className

    return (
        <div className={viewClass}>
            <CircularProgress 
                style={{ color: "#FF9800" }} 
                thickness={7} 
            />
        </div>
    )
  }
}
