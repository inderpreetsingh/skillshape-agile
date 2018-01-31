import React from "react";
import  ClaimSchoolFilter  from "./filter";
import ClaimSchoolList  from "./claimSchoolList";
import Sticky from 'react-sticky-el';
export default function () {
   return (
       <div>
        <Sticky stickyClassName={"filter-panel-sticked"} onFixedToggle={this.handleFixedToggle}>
            <ClaimSchoolFilter
                stickyPosition={this.state.sticky}
                ref="ClaimSchoolFilter"
                {...this.props}
                handleSkillCategoryChange={this.handleSkillCategoryChange}
                onLocationChange={this.onLocationChange}
                handleSchoolNameChange={this.handleSchoolNameChange}
                locationInputChanged={this.locationInputChanged}
             />
        </Sticky>
         <ClaimSchoolList
            filters={this.state.filters}
            handleClaimASchool={this.handleClaimASchool}
           />
       </div>
   )
 }

