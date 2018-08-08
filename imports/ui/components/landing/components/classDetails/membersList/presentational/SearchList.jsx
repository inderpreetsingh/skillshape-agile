import React from "react";
import styled from "styled-components";

import { withStyles } from "material-ui/styles";
import Icon from "material-ui/Icon";
import TextField from "material-ui/TextField";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";

const Wrapper = styled.div`
  display: flex;
  margin-left: ${helpers.rhythmDiv}px;
`;

const styles = {
  icon: {
    color: helpers.black,
    fontSize: helpers.baseFontSize * 1.5
  },
  inputRoot: {
    height: 18
  }
};

const SearchList = props => (
  <Wrapper>
    <TextField
      value={props.searchedValue}
      InputProps={{ classes: { input: props.classes.inputRoot } }}
      onChange={props.onChange}
    />
    <Icon className={props.classes.icon}>{"search"}</Icon>
  </Wrapper>
);

export default withStyles(styles)(SearchList);
