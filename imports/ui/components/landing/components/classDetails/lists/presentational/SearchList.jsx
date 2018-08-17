import React from "react";
import styled from "styled-components";

import { withStyles } from "material-ui/withStyles";
import Icon from "material-ui/Icon";
import TextField from "material-ui/TextField";

const Wrapper = styled.div`
  display: flex;
`;

const styles = {
  icon: {
    color: helpers.rhythmDiv,
    fontSize: helpers.baseFontSize * 1.5
  }
};

const SearchList = props => (
  <Wrapper>
    <TextField value={props.searchedValue} onChange={props.onChange} />
    <Icon className={props.classes.icon}>{"search"}</Icon>
  </Wrapper>
);

export default withStyles(styles)(SearchList);
