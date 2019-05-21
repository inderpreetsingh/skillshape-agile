import React from 'react';
import DocumentTitle from 'react-document-title';
// import Sticky from 'react-sticky-el';
import Sticky from 'react-stickynode';
import styled from 'styled-components';
import FiltersDialogBox from '../landing/components/dialogs/FiltersDialogBox';
// import  ClaimSchoolFilter  from "./filter";
import FilterPanel from '../landing/components/FilterPanel';
import ClaimSchoolList from './claimSchoolList';
import SkillShapeDialogBox from '/imports/ui/components/landing/components/dialogs/SkillShapeDialogBox';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers';
import { ContainerLoader } from '/imports/ui/loading/container';


export default function (props) {
  return (
    <DocumentTitle title={this.props.route.name}>
      <div>
        {this.state.isLoading && <ContainerLoader />}
        {this.state.showConfirmationModal && (
          <SkillShapeDialogBox
            open={this.state.showConfirmationModal}
            defaultButtons
            onModalClose={() => this.setState({ showConfirmationModal: false })}
            type="inform"
            title="New School"
            content="This will create a new school for you, Are you sure?"
            onAffirmationButtonClick={this.handleListingOfNewSchool}
            onCloseButtonClick={() => this.setState({ showConfirmationModal: false })
            }
          />
        )}
        {this.state.filterPanelDialogBox && (
          <FiltersDialogBox
            open={this.state.filterPanelDialogBox}
            onModalClose={() => this.handleFiltersDialogBoxState(false)}
            filterPanelProps={{
              ref: 'ClaimSchoolFilter',
              removeAllFilters: this.removeAllFilters,
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
              collectSelectedSkillCategories: this
                .collectSelectedSkillCategories,
              collectSelectedSkillSubject: this.collectSelectedSkillSubject,
            }}
          />
        )}

        <Sticky
          activeClassName="filter-panel-sticked"
          innerZ={1}
          onStateChange={this.handleFixedToggle}
        >
          {/* <ClaimSchoolFilter
                stickyPosition={this.state.sticky}
                ref="ClaimSchoolFilter"
                {...this.props}
                handleSkillCategoryChange={this.handleSkillCategoryChange}
                onLocationChange={this.onLocationChange}
                handleSchoolNameChange={this.handleSchoolNameChange}
                locationInputChanged={this.locationInputChanged}
                filters={this.state.filters}
             /> */}
          <FilterPanel
            displayChangeViewButton={false}
            fullWidth
            ref="ClaimSchoolFilter"
            {...this.props}
            onModalClose={() => this.handleFiltersDialogBoxState(false)}
            stickyPosition={this.state.sticky}
            collectSelectedSkillCategories={this.collectSelectedSkillCategories}
            fliterSchoolName={this.fliterSchoolName}
            locationInputChanged={this.locationInputChanged}
            handleShowMoreFiltersButtonClick={() => this.handleFiltersDialogBoxState(true)
            }
            handleNoOfFiltersClick={() => this.handleFiltersDialogBoxState(true)
            }
            filters={this.state.filters}
            onLocationChange={this.onLocationChange}
          />
        </Sticky>
        {/* <Wrapper>
          <TextWrapper className={this.props.classes.textStyle}>
              Check to see if any of these are your school.
              if so, press the <b>claim</b> button
              if not, Click the button to the right to open a new listing
          </TextWrapper>
          <FormSubmitButtonWrapper>
            <Button className={this.props.classes.sideButton} onClick={this.showConfirmationModal}>None of these are my school. <br/>Start a new Listing! </Button>
          </FormSubmitButtonWrapper>
        </Wrapper> */}
        <ClaimSchoolList
          removeAllFilters={this.removeAllFilters}
          filters={this.state.filters}
          tempFilters={this.state.tempFilters}
          handleClaimASchool={this.handleClaimASchool}
          handleSuggestionFormState={this.handleSuggestionFormState}
          handleGoBackButtonClick={this.handleGoBackButtonClick}
          onStartNewListingButtonClick={this.showConfirmationModal}
        />
      </div>
    </DocumentTitle>
  );
}
