import React from "react";
import  ClaimSchoolFilter  from "./filter";

import FilterPanel from '../landing/components/FilterPanel.jsx';
import FiltersDialogBox from '../landing/components/dialogs/FiltersDialogBox.jsx';

import ClaimSchoolList  from "./claimSchoolList";
// import Sticky from 'react-sticky-el';
import Sticky from 'react-stickynode';

import { ContainerLoader } from '/imports/ui/loading/container.js';

export default function () {
   return (
       <div>
        {
          this.state.isLoading && <ContainerLoader />
        }
        {this.state.filterPanelDialogBox &&
          <FiltersDialogBox
              open={this.state.filterPanelDialogBox}
              onModalClose={() => this.handleFiltersDialogBoxState(false)}
              filterPanelProps={{
                ref: "ClaimSchoolFilter",
                applyFilters: this.applyFilters,
                onLocationChange: this.onLocationChange,
                handleSchoolNameChange: this.handleSchoolNameChange,
                locationInputChanged: this.locationInputChanged,
                filters: this.state.filters,
                tempFilters: this.state.tempFilters,
                fliterSchoolName: this.fliterSchoolName,
                filterAge: this.filterAge,
                filterGender: this.filterGender,
                skillLevelFilter: this.skillLevelFilter,
                perClassPriceFilter: this.perClassPriceFilter,
                pricePerMonthFilter: this.pricePerMonthFilter,
                collectSelectedSkillCategories: this.collectSelectedSkillCategories,
                collectSelectedSkillSubject: this.collectSelectedSkillSubject,
              }}
          />
        }
        <Sticky activeClassName={"filter-panel-sticked"} innerZ={1} onStateChange={this.handleFixedToggle}>
            {/*<ClaimSchoolFilter
                stickyPosition={this.state.sticky}
                ref="ClaimSchoolFilter"
                {...this.props}
                handleSkillCategoryChange={this.handleSkillCategoryChange}
                onLocationChange={this.onLocationChange}
                handleSchoolNameChange={this.handleSchoolNameChange}
                locationInputChanged={this.locationInputChanged}
                filters={this.state.filters}
             />*/}
             <FilterPanel
               displayChangeViewButton={false}
               ref="ClaimSchoolFilter"
               {...this.props}
               onModalClose={() => this.handleFiltersDialogBoxState(false)}
               stickyPosition={this.state.sticky}
               collectSelectedSkillCategories = {this.collectSelectedSkillCategories}
               fliterSchoolName={this.fliterSchoolName}
               locationInputChanged={this.locationInputChanged}
               handleShowMoreFiltersButtonClick={() => this.handleFiltersDialogBoxState(true)}
               handleNoOfFiltersClick={() => this.handleFiltersDialogBoxState(true)}
               filters={this.state.filters}
               onLocationChange= {this.onLocationChange}
             />
        </Sticky>
         <ClaimSchoolList
            filters={this.state.filters}
            handleClaimASchool={this.handleClaimASchool}
           />
       </div>
   )
 }