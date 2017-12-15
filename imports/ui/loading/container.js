"use strict"

import React from "react";
import PropTypes from "prop-types";
import RefreshIndicator from "material-ui/RefreshIndicator";
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
          <div>
            <RefreshIndicator
              size={50}
              left={0}
              top={0}
              loadingColor="#FF9800"
              status="loading"
              style={style}
            />
          </div>
        </div>
    )
  }
}
