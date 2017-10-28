import React from 'react'

export default class Home extends React.Component{

  constructor(props){
    super(props);
  }

  render(){
    return(
      <footer className="footer" style={{textAlign: 'center'}}>
        <div className="container-fluid" >
          <div className="container">
            middle content
         </div>
       </div>
     </footer>
    )
  }
}