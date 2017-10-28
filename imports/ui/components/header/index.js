import React from 'react'

export default class Header extends React.Component{

  constructor(props){
    super(props);
  }

  render(){
    return(
      <footer className="footer" style={{textAlign: 'center'}}>
        <div className="container-fluid" >
          <div className="container">
           Header
         </div>
       </div>
     </footer>
    )
  }
}