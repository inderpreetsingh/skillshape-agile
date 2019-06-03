import { CircularProgress } from 'material-ui/Progress';
import React from 'react';
import './container.css';

const className = 'preload-container';

export class ContainerLoader extends React.Component {
  render() {
    const viewClass = this.props.className ? `${className} ${this.props.className}` : className;

    return (
      <div className={viewClass}>
        <CircularProgress color="primary" thickness={5} />
      </div>
    );
  }
}
