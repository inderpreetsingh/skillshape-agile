import React from 'react';

export default class Home extends React.Component{

  constructor(props){
    super(props);
  }

  render(){
    return(
      <div className="content">
        <div className="container-fluid">
          Middle Content
        </div>
      </div>
    )
  }
}