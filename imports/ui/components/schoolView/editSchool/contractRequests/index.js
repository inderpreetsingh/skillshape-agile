import { withStyles } from "material-ui/styles";
import React from "react";
import styled from 'styled-components';
import { rhythmDiv } from '/imports/ui/components/landing/components/jss/helpers.js';
import { ContainerLoader } from "/imports/ui/loading/container";
import { withPopUp,confirmationDialog } from "/imports/util";

const Wrapper = styled.div`
  background: white;
`;
const styles = theme => ({
  root: {
    maxWidth: `calc(90% - ${rhythmDiv * 4}px)`,
    margin: `0 auto`,
    boxShadow: 'none',
    background: 'transparent',
    marginBottom: rhythmDiv * 2,
  },
  rootGrid: {
    padding: '6px'
  }
})


class ContractRequests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        isLoading:false
  }
}

  componentWillMount() {
  }

  render() {
    const {isLoading} = this.state;
    return (
      <Wrapper>
        {isLoading && <ContainerLoader />}
      </Wrapper>
    );
  }
}
export default withStyles(styles)(withPopUp(ContractRequests));