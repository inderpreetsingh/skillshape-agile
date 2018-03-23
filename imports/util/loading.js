import React,{Fragment} from 'react';
import { ContainerLoader } from '/imports/ui/loading/container';


export function componentLoader(WrappedComponent) {

  class loader extends React.Component {
    constructor(props) {
      super(props);
    }
    show = ()=> {
      if(this.textInput) {
          this.textInput.style.display = "block";
      }
    }
    hide = ()=> {
      if(this.textInput) {
          this.textInput.style.display = "none";
      }
    }
    render() {
        return (
          <Fragment>
            <div name='appendLoader' style={{display: "none"}} ref={(input) => { this.textInput = input; }}> <ContainerLoader/> </div>
            <WrappedComponent {...this.props} isLoading={{show:this.show,hide:this.hide }}/>
          </Fragment>
        )
    }
  };
  return loader;
}