import React from "react";
import  ClaimSchoolFilter  from "./filter";
import ClaimSchoolList  from "./claimSchoolList";
import Sticky from 'react-sticky-el';

import { ContainerLoader } from '/imports/ui/loading/container.js';

export default function () {
   return (
       <div>
        {
          this.state.isLoading && <ContainerLoader />
        }
        <Sticky stickyClassName={"filter-panel-sticked"} onFixedToggle={this.handleFixedToggle}>
            <ClaimSchoolFilter
                stickyPosition={this.state.sticky}
                ref="ClaimSchoolFilter"
                {...this.props}
                handleSkillCategoryChange={this.handleSkillCategoryChange}
                onLocationChange={this.onLocationChange}
                handleSchoolNameChange={this.handleSchoolNameChange}
                locationInputChanged={this.locationInputChanged}
                filters={this.state.filters}
             />
        </Sticky>
         <ClaimSchoolList
            filters={this.state.filters}
            handleClaimASchool={this.handleClaimASchool}
           />
       </div>
   )
 }

