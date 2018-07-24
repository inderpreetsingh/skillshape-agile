import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { browserHistory } from "react-router";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

import Icon from "material-ui/Icon";
import { withStyles } from "material-ui/styles";
import IconButton from "material-ui/IconButton";

import MyMultiSelect from "/imports/ui/components/landing/components/form/multiSelect/MyMultiSelect.jsx";
import SearchBarStyled from "./SearchBarStyled.jsx";
import IconInput from "./form/IconInput.jsx";
import MySearchBar from "./MySearchBar.jsx";

import NearByClassesButton from "./buttons/NearByClassesButton";
import PrimaryButton from "./buttons/PrimaryButton";
import FormGhostButton from "./buttons/FormGhostButton";
import SecondaryButton from "./buttons/SecondaryButton";

import Grade from "material-ui-icons/Grade";
import Location from "material-ui-icons/LocationOn";
import MyLocation from "material-ui-icons/MyLocation";
import SearchIcon from "material-ui-icons/Search";

import { grey } from "material-ui/colors";

import * as helpers from "./jss/helpers.js";
// import IconInput from './form/IconInput.jsx';

const styles = {
  iconButtonStyle: {
    color: helpers.textColor,
    background: helpers.panelColor,
    borderRadius: 10
  }
};

const SearchAreaPanel = styled.div`
  padding: ${helpers.rhythmDiv}px;
  max-width: 450px; //computed size
  margin: auto;

  @media screen and (min-width: 0) and (max-width: ${helpers.mobile}px) {
    max-width: 500px;
    padding-left: ${helpers.rhythmDiv}px;
    overflow-x: hidden;
  }
`;

const TaglineArea = styled.div``;

const Tagline = styled.h2`
  font-family: ${helpers.specialFont};
  font-weight: 100;
  color: ${helpers.headingColor};
  font-size: ${helpers.baseFontSize * 3}px;
  margin: 0;
  text-align: center;
  @media screen and (min-width: 0) and (max-width: ${helpers.mobile}px) {
    font-size: ${helpers.baseFontSize * 2}px;
  }
`;

const TaglineText = styled.p`
  font-family: ${helpers.commonFont};
  font-size: ${helpers.baseFontSize}px;
  color: ${helpers.textColor};
  margin: ${helpers.rhythmDiv}px 0;

  @media screen and (max-width: ${helpers.mobile}px) {
    max-width: 300px;
    padding: 0 ${helpers.rhythmDiv * 2}px;
  }
`;

const In = styled.p`
  ${helpers.flexCenter}
  font-family : ${helpers.specialFont};
  font-weight: 500;
  font-style: italic;
  font-size: ${helpers.baseFontSize}px;
  margin: 0;
  line-height: 1;
  height: ${helpers.rhythmDiv * 6}px;
  background-color: white;
  color: rgba(0,0,0,0.4);
  padding: 0 8px;
  position: relative;
  box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.1), 0px 2px 0px 0px rgba(0, 0, 0, 0.1), 0px 3px 1px -2px rgba(0, 0, 0, 0.05);
`;

const GenericButtonWrapper = styled.div`
  @media screen and (max-width: ${helpers.mobile}px) {
    ${helpers.flexCenter} max-width: 300px;
    width: 100%;
  }
`;

const FilterButtonWrapper = GenericButtonWrapper.extend`
  width: 50%;

  @media screen and (max-width: ${helpers.mobile}px) {
    ${helpers.flexCenter} max-width: 300px;
    width: 100%;
  }
`;

const SearchIconButtonWrapper = styled.div`
  padding-left: ${helpers.rhythmDiv}px;
`;

const SearchInputsSectionWrapper = styled.div`
  ${helpers.flexCenter}
  flex-direction: column;

  @media screen and (max-width: 320px) {
    max-width: 290px; // bit of hacky as skill input is not reducing it's width.
    margin: 0 auto;
  }
`;

const InputWrapper = styled.div`
  ${props => (props.locationInput ? `${helpers.flexCenter}` : "")} width: 100%;
  height: 48px;
`;

const InputsWrapper = styled.div`
  ${helpers.flexCenter} max-width: 100%;
  width: 100%;
  padding: ${props => props.noPadding ? '0' : helpers.rhythmDiv}px;
  background: ${props => (props.background ? props.background : "transparent")};
  margin-bottom: ${helpers.rhythmDiv}px;
  border-radius: 4px;

  @media screen and (max-width: ${helpers.mobile}px) {
    max-width: 300px;
    margin: 0 auto;
  }
`;

const SkillInputWrapper = InputsWrapper.extend`
  height: ${helpers.rhythmDiv * 6}px;

  @media screen and (max-width: ${helpers.mobile}px) {
    margin-right: 0;
    margin-left: 0;
    margin-bottom: ${helpers.rhythmDiv}px;
  }

`;

const MapViewButtonWrapper = GenericButtonWrapper.extend`
  width: 50%;
  margin-left: ${helpers.rhythmDiv}px;

  @media screen and (max-width: ${helpers.mobile}px) {
    margin: 0;
  }
`;

const ButtonsWrapper = styled.div`
  ${helpers.flexCenter} width: 100%;
  margin-top: ${helpers.rhythmDiv}px;

  @media screen and (max-width: ${helpers.mobile}px) {
    flex-direction: column;
    ${props => props.smallScreenRow ? 'flex-direction: row' : ''};
  }
`;

{
  /*<InputWrapper>
  <MySearchBar
    placeholder="Skill Type"
    defaultBorderRadius={true}
    onChange={props.onSkillTypeChange}
    withIcon={false}
    rightAlign
    resetSearch={props.resetSearch}
    value={props.skillTypeText}
  />
</InputWrapper> */
}

const SearchInputsSection = props => (
  <SearchInputsSectionWrapper>
    {/*<InputsWrapper>
      <InputWrapper>
        <MySearchBar
          placeholder="Skill Type"
          defaultBorderRadius={true}
          onChange={props.onSkillTypeChange}
          withIcon={false}
          rightAlign
          resetSearch={props.resetSearch}
          value={props.skillTypeText}
        />
      </InputWrapper>
      <InputWrapper locationInput>
        <MySearchBar
          placeholder="Location"
          defaultValue={props.currentAddress}
          defaultBorderRadius={true}
          withIcon={false}
          noCloseIcon
          onChange={event => props.locationInputChanged(event, "filters", null)}
          filters={props.filters}
          onLocationChange={event => {
            props.onLocationChange(event, "filters", null);
          }}
          currentAddress={props.currentAddress}
          googlelocation={true}
          value={props.currentAddress}
          resetSearch={props.resetSearch}
        />
        <SearchIconButtonWrapper>
          <IconButton
            className={props.classes.iconButtonStyle}
            onClick={props.onSearchIconClick}
          >
            <Icon>search</Icon>
          </IconButton>
        </SearchIconButtonWrapper>
      </InputWrapper>
    </InputsWrapper> */}

    {/* UPDATING ...............*/}
    <SkillInputWrapper background="white" marginSmallScreen>
      <div className="my-multi-select-filter no-border">
          <MyMultiSelect
              textField={"name"}
              valueField={"_id"}
              data={props.skillCategoryData}
              placeholder="Choose your skill category"
              value={get(props, "filters.defaultSkillCategories", [])}
              onChange={(event)=> props.collectSelectedSkillCategories(event, "filters", null)}
              onNoOfFiltersClick={props.handleNoOfFiltersClick}
          />
      </div>
    </SkillInputWrapper>

    <SkillInputWrapper background="white" marginSmallScreen>
      <div className="my-multi-select-filter no-border">
          <MyMultiSelect
              textField={"name"}
              valueField={"_id"}
              data={props.skillSubjectData}
              placeholder="Choose your skill subject"
              value={get(props, "filters.defaultSkillSubject", [])}
              onSearch={props.inputFromUser}
              onChange={props.collectSelectedSkillSubject}
              onNoOfFiltersClick={props.handleNoOfFiltersClick}
          />
      </div>
    </SkillInputWrapper>

    <InputsWrapper noPadding>
      <InputWrapper locationInput>
          <MySearchBar
            placeholder="Location"
            defaultValue={props.currentDefaultAddress}
            defaultBorderRadius={true}
            searchIcon={<MyLocation style={{ color: grey[500] }} />}
            onSearchIconClick={props.onSearchIconClick}
            noCloseIcon
            onChange={(event) => props.locationInputChanged(event, "filters", null)}
            filters={props.filters}
            onLocationChange={(event)=> {props.onLocationChange(event, "filters", null)}}
            currentAddress={props.currentAddress}
            googlelocation={true}
            value={props.currentAddress}
            resetSearch={props.resetSearch}
          />
      </InputWrapper>

      <SearchIconButtonWrapper>
        <IconButton className={props.classes.iconButtonStyle} onClick={props.onSearchIconClick}>
        <Icon>search</Icon>
        </IconButton>
      </SearchIconButtonWrapper>
    </InputsWrapper>

    <ButtonsWrapper smallScreenRow>
      <FilterButtonWrapper>
        <PrimaryButton
          darkGreyColor
          fullWidth
          icon
          iconName="tune"
          label="Filters"
          boxShadow
          noMarginBottom
          onClick={props.onFiltersButtonClick}
        />
      </FilterButtonWrapper>

      <MapViewButtonWrapper>
        {props.mapView ? (
          <PrimaryButton
            darkGreyColor
            fullWidth
            noMarginBottom
            icon
            iconName="grid_on"
            label="List View"
            boxShadow
            noMarginBottom
            onClick={props.onMapViewButtonClick}
          />
        ) : (
          <PrimaryButton
            darkGreyColor
            fullWidth
            noMarginBottom
            icon
            iconName="map"
            label="Map View"
            boxShadow
            noMarginBottom
            onClick={props.onMapViewButtonClick}
          />
        )}
      </MapViewButtonWrapper>
    </ButtonsWrapper>
  </SearchInputsSectionWrapper>
);

const TaglineWrapper = () => (
  <TaglineArea>
    <Tagline>Find Your Ideal Class</Tagline>
  </TaglineArea>
);

const BottomSectionContent = props => (
  <div>
    <TaglineText>
      SkillShape helps you find and attend{" "}
      <span itemProp="object">classes</span> on your subject of interest, in
      your location, and at your price
    </TaglineText>
    <ButtonsWrapper>
      <GenericButtonWrapper>
        <PrimaryButton
          onClick={props.onMapViewButtonClick}
          icon
          boxShadow
          iconName="room"
          label="Browse classes near you"
          itemScope
          itemType="http://schema.org/DiscoverAction"
        />
      </GenericButtonWrapper>
      <GenericButtonWrapper>
        <SecondaryButton
          icon
          iconName="domain"
          label="Add your school"
          boxShadow
          itemScope
          itemType="http://schema.org/AddAction"
          onClick={props.handleAddSchool}
        />
      </GenericButtonWrapper>
    </ButtonsWrapper>
  </div>
);

class SearchArea extends Component {
  state = {
    location: "",
    skillType: ""
  };

  componentWillMount() {
    const dataSourceCategories = Meteor.call(
      "getAllSkillCategories",
      (err, result) => {
        this.setState({ skillCategoryData: result });
      }
    );
  }

  componentDidUpdate(prevProps) {
    const previousSkillCategoryIds = prevProps.filters.skillCategoryIds || [];
    const currentSkillCategoryIds = this.props.filters.skillCategoryIds || [];

    if(previousSkillCategoryIds.length !== currentSkillCategoryIds.length)
      this.inputFromUser("");
  }

  // This is used to get subjects on the basis of subject category.
  inputFromUser = text => {
    // Do db call on the basis of text entered by user
    let skillCategoryIds = this.props.filters.skillCategoryIds;
    Meteor.call(
      "getSkillSubjectBySkillCategory",
      { skillCategoryIds: skillCategoryIds, textSearch: text },
      (err, res) => {
        if (res) {
          // console.log("result",res)
          this.setState({ skillSubjectData: res || [] });
        }
      }
    );
  };

  componentDidMount() {
    this.props.getMyCurrentLocation({noMapView: true});
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.locationName) {
      this.setState({ location: nextProps.locationName});
    }
  }

  handleLocationInputChange = event => {
    let value = "";
    if (event) {
      event.preventDefault();
      value = event.target.value;
    }
    this.setState({
      location: value
    });

    if (this.props.onLocationInputChange) {
      this.props.onLocationInputChange(value);
    }
  };


  handleAddSchool = () => {
    if (Meteor.userId()) {
      browserHistory.push("/claimSchool");
    } else {
      Events.trigger("registerAsSchool", { userType: "School" });
    }
  };

  render() {
    // console.log("this.props in SearchArea",this.props);
    return (
      <SearchAreaPanel
        width={this.props.width}
        textAlign={this.props.textAlign}
        itemScope
        itemType="http://schema.org/SearchAction"
      >
        {this.props.topSection ? this.props.topSection : <TaglineWrapper />}
        {this.props.middleSection ? (
          this.props.middleSection
        ) : (
          <SearchInputsSection
            skillCategoryData={this.state.skillCategoryData}
            skillSubjectData={this.state.skillSubjectData}
            collectSelectedSkillCategories={this.props.collectSelectedSkillCategories}
            collectSelectedSkillSubject={this.props.collectSelectedSkillSubject}
            handleNoOfFiltersClick={this.props.handleNoOfFiltersClick}
            inputFromUser={this.inputFromUser}
            classes={this.props.classes}
            location={this.props.location}
            skillType={this.state.skillType}
            onLocationInputChange={this.handleLocationInputChange}
            onSkillTypeChange={this.handleSkillTypeChange}
            onFiltersButtonClick={this.props.onFiltersButtonClick}
            onMapViewButtonClick={this.props.onMapViewButtonClick}
            mapView={this.props.mapView}
            locationText={this.props.locationText}
            resetSearch={this.props.resetSearch}
            locationInputChanged={this.props.locationInputChanged}
            currentAddress={this.props.filters && this.props.filters.locationName&& this.props.filters.locationName||''}
            filters={this.props.filters}
            onLocationChange={this.props.onLocationChange}
            onSearchIconClick={this.props.onSearchIconClick}
            getMyCurrentLocation={this.props.getMyCurrentLocation}
          />
        )}
        {this.props.bottomSection ? (
          this.props.bottomSection
        ) : (
          <BottomSectionContent
            getMyCurrentLocation={this.props.getMyCurrentLocation}
            onMapViewButtonClick={this.props.onMapViewButtonClick}
            handleAddSchool={this.handleAddSchool}
          />
        )}
      </SearchAreaPanel>
    );
  }
}

SearchArea.propTypes = {
  topSection: PropTypes.element,
  middleSection: PropTypes.element,
  middleSectionText: PropTypes.string,
  bottomSection: PropTypes.element,
  onSearch: PropTypes.func,
  onFiltersButtonClick: PropTypes.func,
  onMapViewButtonClick: PropTypes.func,
  mapView: PropTypes.bool
};

SearchAreaPanel.defaultProps = {
  textAlign: "center"
};

SearchArea.defaultProps = {
  middleSectionText: "Or"
};

export default withStyles(styles)(SearchArea);
