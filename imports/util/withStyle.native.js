import React from "react"
export withStyle = (styles) =>  (Component)=>{
	return class withStyleWrapper extends React.Component{
		render(){
			return <Component {...this.props} styles={styles}/>
		}
	}
};