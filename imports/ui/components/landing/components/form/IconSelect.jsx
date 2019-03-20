import { FormControl } from 'material-ui/Form';
import Icon from 'material-ui/Icon';
import Input, { InputAdornment, InputLabel } from 'material-ui/Input';
import { MenuItem } from "material-ui/Menu";
import Select from 'material-ui/Select';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import React from 'react';
import * as helpers from '../jss/helpers';

const styles = {
  label: {
    color: helpers.defaultInputColor
  }
}

const IconSelect = (props) => (
    <FormControl fullWidth>
      <InputLabel htmlFor={props.inputId} classes={{ root: props.classes.label }}>{props.labelText}</InputLabel>
      <Select
        autoWidth
        value={props.value || ''}
        onChange={props.onChange}
        MenuProps={{
          onEnter: () => {
            setTimeout(() => {
              if (document.activeElement) {
                document.activeElement.blur();
              }
            }, 500);
          }   
        }}
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
