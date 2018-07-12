import React from "react";
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import {cutString} from '/imports/util';
import { InfiniteScroll } from '/imports/util';
import { browserHistory, Link } from 'react-router';

import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import SchoolCard from "/imports/ui/components/landing/components/cards/schoolCard";
import NoResults from '/imports/ui/components/landing/components/NoResults';
import FilterPanel from '/imports/ui/components/landing/components/FilterPanel.jsx';
import SchoolSuggestionDialogBox from "/imports/ui/components/landing/components/dialogs/SchoolSuggestionDialogBox.jsx";

import {getContainerMaxWidth} from '/imports/util/cards.js';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

const SPACING = helpers.rhythmDiv * 2;
const CARD_WIDTH = 300;

const NoResultContainer = styled.div`
  text-align: center;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;

  @media screen and (max-width: ${helpers.tablet}px) {
    flex-direction: column;
  }
`;

const FormSubmitButtonWrapper =styled.div`
  padding: ${helpers.rhythmDiv * 2}px;
`;

const TextWrapper =styled.div`
  font-size: ${helpers.baseFontSize * 1.25}px;
  text-align: left;
  max-width: 900px;
  margin-left: ${helpers.rhythmDiv * 2}px;
`;


const GridInnerWrapper = styled.div`
  ${helpers.flexCenter}
  justify-content: flex-start;
  flex-wrap: wrap;

  @media screen and (max-width: ${helpers.mobile}px) {
    justify-content: center;
  }
`;

const GridItem = styled.div`
  width: ${CARD_WIDTH}px;
  margin: ${props => props.spacing/2 || '16'}px;

  @media screen and (max-width: ${helpers.mobile}px) {
    max-width: ${CARD_WIDTH}px;
    margin: ${props => props.spacing/2 || '16'}px 0;
  }
`;

const GridWrapper = styled.div`
    padding: ${SPACING/2}px;
    margin: 0 auto;
    max-width: ${getContainerMaxWidth(CARD_WIDTH,SPACING,4) + 24}px;

    @media screen and (max-width: ${getContainerMaxWidth(CARD_WIDTH,SPACING,4) + 24}px) {
      max-width: ${getContainerMaxWidth(CARD_WIDTH,SPACING,3) + 24}px;
    }

    @media screen and (max-width: ${getContainerMaxWidth(CARD_WIDTH,SPACING,3) + 24}px) {
      max-width: ${getContainerMaxWidth(CARD_WIDTH,SPACING,2) + 24}px;
    }

    @media screen and (max-width: ${getContainerMaxWidth(CARD_WIDTH,SPACING,2) + 24}px) {
      max-width: ${getContainerMaxWidth(CARD_WIDTH,SPACING,1) + 24}px;
      margin: 0 auto;
    }
`;

const FormWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

export default function (props) {
    let schools = this.props.collectionData || [];

    const NoneOfMyLisiting = (props) => (<Wrapper>
        <TextWrapper>
            Check to see if any of these are your school. The filters can help you search!
            If you find your school, press the <b>claim</b> button.
            If you do not find it, click the button to the right to open a new listing!
        </TextWrapper>
        <FormSubmitButtonWrapper>
          <Button className={props.classes.buttonStyles} onClick={props.onStartNewListingButtonClick}>
            None of these are my school. <br/>Start a new Listing!
          </Button>
        </FormSubmitButtonWrapper>
      </Wrapper>)

    if(isEmpty(schools)) {
        return (
            <GridWrapper>
              <NoResultContainer>
                <NoneOfMyLisiting {...props} />
                <FormWrapper>
                  <FilterPanel
                    filtersInDialogBox
                    filtersForSuggestion
                    filters={this.state.filters}
                    tempFilters={this.state.tempFilters}
                    onLocationChange={this.onLocationChange}
                    locationInputChanged={this.locationInputChanged}
                    fliterSchoolName={this.fliterSchoolName}
                    filterAge={this.filterAge}
                    filterGender={this.filterGender}
                    skillLevelFilter={this.skillLevelFilter}
                    perClassPriceFilter={this.perClassPriceFilter}
                    pricePerMonthFilter={this.pricePerMonthFilter}
                    collectSelectedSkillCategories={this.collectSelectedSkillCategories}
                    collectSelectedSkillSubject={this.collectSelectedSkillSubject}
                    onGiveSuggestion={this.handleGiveSuggestion}
                  />
                </FormWrapper>
                <NoResults
                  icon={false}
                  hideTitle={true}
                  removeAllFiltersButtonClick={props.removeAllFilters}
                  addYourSchoolButtonClick = {props.onStartNewListingButtonClick}
                />
              </NoResultContainer>
            </GridWrapper>
        )
    } else {
        return (
            <div>

                <GridWrapper>
                  <NoneOfMyLisiting {...props} />
                  <GridInnerWrapper>
                    {
                      schools.map((school, index) => {
                          return (
                              <GridItem spacing={SPACING} key={index}>
                                  <SchoolCard schoolCardData={school} handleClaimASchool={this.props.handleClaimASchool}/>
                              </GridItem>
                          )
                      })
                    }
                    </GridInnerWrapper>
                </GridWrapper>
            </div>
        )
    }
}
