import React from 'react'

export default class Footer extends React.Component{

  constructor(props){
    super(props);
  }

  render(){
    return(
      <footer className="footer" style={{textAlign: 'center'}}>
        <div className="container-fluid" >
          <div className="container">
           skillshape © 2017
         </div>
       </div>
     </footer>
    )
  }
}
