import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import React , {Component} from 'react';
import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import {blueGrey} from 'material-ui/colors';
import muiTheme from '../jss/muitheme.jsx';
import * as helpers from '../jss/helpers.js';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const SliderWrapper = styled.div`
  width : 100%;
  min-height: 10px;
`;

const SliderValue = styled.p`
  color: ${helpers.ignoreMeText};
  font-size: ${helpers.baseFontSize}px;
  font-family: ${helpers.commonFont};
`;

class SliderControl extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      value: props.defaultRange
    }
  }

  handleChange = value => {

    if(this.props.onChange) {
        this.props.onChange(value);
    }
  };

  handleOnBeforeChange = () => {
    // console.log('Change event started');
    // const value = this.state.value;
    // if(this.props.onBeforeChange) {
    //     this.props.onBeforeChange(value);
    // }
  };

  handleOnAfterChange = () => {
    // console.log('Change event completed');
    // const value = this.state.value;

    // if(this.props.onAfterChange) {
    //     this.props.onAfterChange(value);
    // }
  };

  render () {
    const { value, labelText, defaultRange, min, max, step } = this.props;
    const currentMinValue = value[0];
    const currentMaxValue = value[1];
    const valueRange = `${currentMinValue} - ${currentMaxValue}`;
    return (
      <SliderWrapper>
        <SliderValue>{labelText} ( {valueRange} ) </SliderValue>
        <Range min={min} max={max} defaultValue={defaultRange} count={2} step={step}
        trackStyle={[{ backgroundColor: muiTheme.palette.primary[500]},{ backgroundColor: muiTheme.palette.primary[500]}]}
        handleStyle={[{ borderColor: muiTheme.palette.primary[500], backgroundColor: muiTheme.palette.primary[500] },{ borderColor: muiTheme.palette.primary[500], backgroundColor: muiTheme.palette.primary[500] }]}
        tipFormatter={value => `${value}%`}
        onChange={this.handleChange}
        onBeforeChange={this.handleOnBeforeChange}
        onAfterChange={this.handleOnAfterChange}
        />
      </SliderWrapper>
    )
  }
}

SliderControl.propTypes = {
    labelText: PropTypes.string,
    defaultValue: PropTypes.number,
    min : PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    onChange: PropTypes.func,
    onBeforeChange: PropTypes.func,
    onAfterChange: PropTypes.func,
    defaultRange: PropTypes.arrayOf(PropTypes.number)
}

SliderControl.defaultProps = {
    labelText: 'Label',
    defaultValue: 10,
    min: 0,
    max: 100,
    step: 1,
    defaultRange: [4,40],
}

export default SliderControl;
