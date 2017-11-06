import React from "react";
import  ClaimSchoolFilter  from "./filter";
import ClaimSchoolList  from "./claimSchoolList"
export default function () {
  console.log("claim school render ==",this.props);
   return (
       <div>
         <ClaimSchoolFilter ref="ClaimSchoolFilter" {...this.props} onSearch={this.onSearch}/>
         <ClaimSchoolList filter={this.state.filters} />
       </div>
   )
 }

