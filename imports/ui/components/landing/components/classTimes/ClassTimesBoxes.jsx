import React, { Component , Fragment } from 'react';
import PropTypes from 'prop-types';

import ClassTimesSlider from './ClassTimesSlider.jsx';
import ClassTimesBar from './ClassTimesBar.jsx';

import classTime from '../../constants/structure/classTime.js';

class ClassTimesBoxes extends Component {
  state = {
    slider: false
  }
  handleSliderToggle = () => {
    // console.log(window.innerWidth," resize, this.handleSliderToggle");
    if(window.innerWidth <= 600) {
      if(!this.state.slider) {
          this.setState({
            slider: true
          });
        }
    }else {
      if(this.state.slider) {
        this.setState({
          slider: false
        });
      }
    }
  }
  componentDidMount = () => {
    this.handleSliderToggle();
    window.addEventListener('resize',this.handleSliderToggle);
  }
  componentWillUnMount = () => {
    window.removeEventListener('resize',this.handleSliderToggle);
  }
  render() {
    const { slider } = this.state;
    const { classTimesData} = this.props;
    return (<Fragment>
      {slider ?
        <ClassTimesSlider data={classTimesData} padding={helpers.rhythmDiv} />
        :
        <ClassTimesBar classTimesData={classTimesData} />
      }
    </Fragment>)
  }
}

ClassTimesBoxes.propTypes = {
  classTimesData: PropTypes.arrayOf(classTime),
}

export default ClassTimesBoxes;
