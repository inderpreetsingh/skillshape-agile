import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Icon from 'material-ui/Icon';
import Select from 'material-ui/Select';
import { MenuItem } from "material-ui/Menu";
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';

import * as helpers from '../jss/helpers';

const styles = {
  label: {
    color: helpers.defaultInputColor
  }
}


const IconSelect = (props) => (
  <div>
    <FormControl fullWidth>
      <InputLabel htmlFor={props.inputId} classes={{ root: props.classes.label }}>{props.labelText}</InputLabel>
      <Select
        autoWidth
        value={props.value || ''}
        onChange={props.onChange}
        input={<Input
          name={props.inputId || props.inputProps.name}
          id={props.inputId || props.inputProps.id}
          endAdornment={
            <InputAdornment position="end">
              <Icon color="disabled">{props.iconName}</Icon>
            </InputAdornment>
          } />

        }>
        {props.children ||
          props.options.map(selectOption => (
            <MenuItem value={selectOption.value}>
              {selectOption.name || selectOption.label}
            </MenuItem>))}
      </Select>
    </FormControl>
  </div>
);

IconSelect.propTypes = {
  inputProps: PropTypes.object,
  iconName: PropTypes.string,
  placeHolder: PropTypes.string,
  labelText: PropTypes.string,
  onChange: PropTypes.func,
  inputId: PropTypes.string,
  children: PropTypes.element,
}

IconSelect.defaultProps = {
  inputProps: {
    name: 'input-select',
    id: ''
  }
}

export default withStyles(styles)(IconSelect);
