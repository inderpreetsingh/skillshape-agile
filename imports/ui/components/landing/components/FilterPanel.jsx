import React, { Component, Fragment } from "react";
import { CSSTransitionGroup } from "react-transition-group";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

import PropTypes from "prop-types";
import Grid from "material-ui/Grid";
import { MuiThemeProvider } from "material-ui/styles";
import Menu, { MenuItem } from "material-ui/Menu";
import Button from "material-ui/Button";
import Icon from "material-ui/Icon";
import IconButton from "material-ui/IconButton";
import Multiselect from "react-widgets/lib/Multiselect";
import { withStyles } from "material-ui/styles";
import Hidden from "material-ui/Hidden";
import styled from "styled-components";

import IconInput from "./form/IconInput.jsx";
import IconSelect from "./form/IconSelect.jsx";
import SliderControl from "./form/SliderControl.jsx";
import MyMultiSelect from "./form/multiSelect/MyMultiSelect.jsx";
import AttachedAlert from "/imports/ui/components/landing/components/helpers/AttachedAlert.jsx";

import { FormHelperText } from "material-ui/Form";
import { coverSrc } from "../site-settings.js";

import muiTheme from "./jss/muitheme.jsx";
import SkillShapeButton from "/imports/ui/components/landing/components/buttons/SkillShapeButton.jsx";
import PrimaryButton from "/imports/ui/components/landing/components/buttons/PrimaryButton.jsx";
import * as helpers from "./jss/helpers.js";

import { dataSourceSkills } from "../constants/filtersData.js";

const FilterPanelOuterContainer = styled.div`
  width: 100%;
  border-bottom: ${props =>
    props.mapView ? "none" : `2px solid ${helpers.panelColor}`};
`;

const FilterPanelContainer = styled.div`
  width: ${props => (props.mapView || props.stickyPosition ? "100%" : "auto")};
  max-width: ${props =>
    props.filtersInDialogBox ||
    (props.stickyPosition || props.mapView || props.fullWidth)
      ? "100%"
      : "1000px"};
  background: ${props =>
    props.filtersInDialogBox || (props.stickyPosition || props.mapView)
      ? "#ffffff"
      : "transparent"};
  margin: auto;
  position: ${props => (props.mapView ? "fixed" : "initial")};
  border-bottom: ${props =>
    props.mapView ? `2px solid ${helpers.panelColor}` : "none"};
  z-index: 100;
`;

const FilterPanelContent = styled.div`
  padding: ${props =>
    props.stickyPosition || props.mapView || props.filtersInDialogBox
      ? helpers.rhythmDiv * 2
      : helpers.rhythmDiv * 3}px;
  margin: auto;
`;

const FilterPanelAction = styled.div`
  padding: ${helpers.rhythmDiv * 2}px 0px;
  transform: translateY(${helpers.rhythmDiv}px);
`;

const FilterPanelActionText = styled.p`
  margin: 0;
  margin-top: ${helpers.rhythmDiv}px;
`;

const FilterButtonArea = styled.div`
  ${helpers.flexCenter} max-width: 300px;
  margin: auto;
  margin-top: -24px;
`;

const MaterialInputWrapper = styled.div`
  transform: translateY(
    -${props => (props.select ? helpers.rhythmDiv + 2 : helpers.rhythmDiv)}px
  );
`;

const SwitchViewWrapper = styled.div`
  @media screen and (max-width: ${helpers.tablet + 100}px) {
    display: ${props => (props.mapView ? "none" : "block")};
  }
`;

const GridContainerWrapper = styled.div`
  ${helpers.flexCenter};
`;

const MapChangeButtonWrapper = styled.div`
  width: 130px;

  @media screen and (max-width: ${helpers.mobile + 20}px) {
    margin-right: ${helpers.rhythmDiv * 2}px;
    width: 80px;
  }
`;

const FilterBarWrapper = styled.div`
  width: calc(
    100% - ${props => (props.displayChangeViewButton ? "130px" : "0px")}
  );

  @media screen and (max-width: ${helpers.mobile + 20}px) {
    width: calc(
      100% - ${props => (props.displayChangeViewButton ? "80px" : "0px")}
    );
  }
`;

const SuggestionFormButton = styled.div`
  max-width: 250px;
  // margin: 0 auto;
  ${props => (props.right ? "margin-right: auto;" : "margin-left: auto;")};
  width: 100%;
  // padding: ${helpers.rhythmDiv * 2}px;

  @media screen and (max-width: 600px) {
    margin: 0 auto;
  }
`;

const CategoryHeader = styled.h2`
  font-size: ${helpers.baseFontSize * 1.5}px;
  font-weight: 400;
  font-family: ${helpers.specialFont};
  text-align: left;
  margin: 0;

  color: ${helpers.primaryColor};
`;

class FilterPanel extends Component {
  state = {
    showMoreFilters: false,
    skillCategoryData: [],
    skillSubjectData: [],
    locationName: "",
    mobile: false,
    filter: {
      skillSubjectIds: null,
      perClassPrice: [],
      pricePerMonth: [],
      gender: null,
      schoolName: null,
      age: null
    },
    skillTypeText: get(this.props, "filters.skillTypeText", "")
  };

  handleChangeInScreenSize = () => {
    // +20 is to counter the size of scrollbars
    if (window.innerWidth <= helpers.mobile + 20) {
      if (!this.state.mobile) {
        this.setState({
          ...this.state,
          mobile: true,
          ...this.state.filter
        });
      }
    } else {
      if (this.state.mobile) {
        this.setState({
          ...this.state,
          mobile: false,
          ...this.state.filter
        });
      }
    }
  };

  componentWillReceiveProps = (nextProps, nextState) => {
    if (this.props.skillTypeText !== nextProps.skillTypeText) {
      this.setState({ skillTypeText: nextProps.skillTypeText });
    }
    if (
      isEmpty(this.state.skillSubjectData) &&
      nextProps.filters.skillCategoryIds
    )
      this.inputFromUser("");
  };

  componentDidMount = () => {
    window.addEventListener("resize", this.handleChangeInScreenSize);
  };
  componentWillUnMount = () => {
    window.removeEventListener("resize", this.handleChangeInScreenSize);
  };

  componentWillMount() {
    const dataSourceCategories = Meteor.call(
      "getAllSkillCategories",
      (err, result) => {
        this.setState({ skillCategoryData: result });
      }
    );
  }

  componentDidUpdate() {
    this.handleChangeInScreenSize();
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

  handleSkillTypeText = event => {
    // console.log("handleSkillTypeText", event.target.value);

    this.setState({ skillTypeText: event.target.value });
    this.props.handleSkillTypeSearch(event.target.value);
  };

  renderFilterBar = () => {
    // console.log("------ renderFilterBar -----",this.props.filters)
    return (
      <GridContainerWrapper>
        {this.props.displayChangeViewButton && (
          <MapChangeButtonWrapper>
            {this.props.mapView ? (
              <PrimaryButton
                noMarginBottom
                icon
                iconName="grid_on"
                label={this.state.mobile ? "List" : "List View"}
                onClick={this.props.handleToggleMapView}
              />
            ) : (
              <PrimaryButton
                noMarginBottom
                icon
                iconName="map"
                label={this.state.mobile ? "Map" : "Map View"}
                onClick={this.props.handleToggleMapView}
              />
            )}
          </MapChangeButtonWrapper>
        )}
        <FilterBarWrapper
          displayChangeViewButton={this.props.displayChangeViewButton}
        >
          <Grid container spacing={24}>
            <Grid item xs={9} sm={3}>
              <MaterialInputWrapper>
                <IconInput
                  value={get(this.props, "filters.locationName", "")}
                  onChange={event =>
                    this.props.locationInputChanged(event, "filters", null)
                  }
                  iconName="location_on"
                  defaultValue={this.props.currentAddress}
                  googlelocation={true}
                  labelText="Location"
                  onLocationChange={event =>
                    this.props.onLocationChange(event, "filters", null)
                  }
                />
              </MaterialInputWrapper>
            </Grid>
            <Hidden xsDown>
              <Grid item xs={1} sm={4}>
                <MaterialInputWrapper>
                  <IconInput
                    value={get(this.props, "filters.schoolName", "")}
                    iconName="school"
                    onChange={event =>
                      this.props.fliterSchoolName(event, "filters", null)
                    }
                    labelText="School Name"
                  />
                </MaterialInputWrapper>
              </Grid>

              <Grid item xs={1} sm={4}>
                <div className="my-multi-select-filter">
                  <MyMultiSelect
                    textField={"name"}
                    valueField={"_id"}
                    data={this.state.skillCategoryData}
                    placeholder="Skill category"
                    value={get(
                      this.props,
                      "filters.defaultSkillCategories",
                      []
                    )}
                    onChange={event =>
                      this.props.collectSelectedSkillCategories(
                        event,
                        "filters",
                        null
                      )
                    }
                    onNoOfFiltersClick={this.props.handleNoOfFiltersClick}
                  />
                </div>
              </Grid>
            </Hidden>

            <Grid item xs={3} sm={1}>
              <FilterButtonArea>
                <FilterPanelAction>
                  <Button
                    fab
                    mini
                    onClick={this.props.handleShowMoreFiltersButtonClick}
                  >
                    <Icon>tune </Icon>
                  </Button>
                </FilterPanelAction>
              </FilterButtonArea>
            </Grid>
          </Grid>
        </FilterBarWrapper>
      </GridContainerWrapper>
    );
  };

  renderFiltersForDialogBox = () => {
    // console.log("------ renderFiltersForDialogBox -----",this.props)
    const { filtersForSuggestion, errors } = this.props;
    return (
      <Grid container spacing={24}>
        {/* 1rst Row */}
        {filtersForSuggestion && (
          <Grid item xs={12} sm={12}>
            <CategoryHeader>School Details</CategoryHeader>
          </Grid>
        )}

        {/* <Grid item xs={12} sm={12} md={12}>
            <MaterialInputWrapper>
              <IconInput
                labelText="Skill type text filter"
                value={this.state.skillTypeText}
                onChange={event => {
                  this.handleSkillTypeText(event);
                }}
              />
            </MaterialInputWrapper>
          </Grid> */}

        {filtersForSuggestion ? (
          <Fragment>
            <Grid item xs={12} sm={6}>
              <MaterialInputWrapper>
                <IconInput
                  value={get(this.props, "filters.schoolName", "")}
                  iconName="school"
                  onChange={event =>
                    this.props.fliterSchoolName(event, "filters", null)
                  }
                  labelText="School Name"
                />
              </MaterialInputWrapper>
            </Grid>

            <Grid item xs={12} sm={6}>
              <MaterialInputWrapper>
                <IconInput
                  value={get(this.props, "filters.locationName", "")}
                  onChange={event =>
                    this.props.locationInputChanged(event, "filters", null)
                  }
                  iconName="location_on"
                  defaultValue={this.props.currentAddress}
                  googlelocation={true}
                  labelText="Location"
                  onLocationChange={event =>
                    this.props.onLocationChange(event, "filters", null)
                  }
                />
              </MaterialInputWrapper>
            </Grid>
          </Fragment>
        ) : (
          <Fragment>
            <Grid item xs={12} sm={12}>
              <MaterialInputWrapper>
                <IconInput
                  value={get(this.props, "filters.schoolName", "")}
                  iconName="school"
                  onChange={event =>
                    this.props.fliterSchoolName(event, "filters", null)
                  }
                  labelText="School Name"
                />
              </MaterialInputWrapper>
            </Grid>
            <Grid item xs={12} sm={12}>
              <MaterialInputWrapper>
                <IconInput
                  value={get(this.props, "filters.locationName", "")}
                  onChange={event =>
                    this.props.locationInputChanged(event, "filters", null)
                  }
                  iconName="location_on"
                  defaultValue={this.props.currentAddress}
                  googlelocation={true}
                  labelText="Location"
                  onLocationChange={event =>
                    this.props.onLocationChange(event, "filters", null)
                  }
                />
              </MaterialInputWrapper>
            </Grid>
          </Fragment>
        )}

        {/* console.log(get(
          this.props,
          "filters.defaultSkillCategories",
          []
        ),"................") */}

        {/* school details */}
        {filtersForSuggestion && (
          <Fragment>
            <Grid item xs={12} sm={6}>
              <MaterialInputWrapper>
                <IconInput
                  value={get(this.props, "filters.schoolWebsite", "")}
                  iconName="web"
                  onChange={this.props.onSchoolWebsiteChange}
                  labelText="Website"
                />
              </MaterialInputWrapper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <MaterialInputWrapper>
                <IconInput
                  type="email"
                  value={get(this.props, "filters.schoolEmail", "")}
                  iconName="email"
                  onChange={this.props.onSchoolEmailChange}
                  labelText="Email"
                  error={errors.schoolEmail}
                  errorText={errors.schoolEmail}
                />
              </MaterialInputWrapper>
            </Grid>
          </Fragment>
        )}

        {/* 2nd Row */}
        {filtersForSuggestion && (
          <Grid item xs={12} sm={12}>
            <CategoryHeader>Skill Details</CategoryHeader>
          </Grid>
        )}

        <Grid item xs={12} sm={12}>
          <div className="filters-dialog">
            <Multiselect
              textField={"name"}
              valueField={"_id"}
              data={this.state.skillCategoryData}
              value={get(this.props, "filters.defaultSkillCategories", [])}
              placeholder="Skill category"
              onChange={event =>
                this.props.collectSelectedSkillCategories(
                  event,
                  "filters",
                  null
                )
              }
            />
          </div>
        </Grid>

        <Grid item xs={12} sm={12}>
          <div className="filters-dialog">
            <Multiselect
              data={this.state.skillSubjectData}
              defaultValue={get(this.props, "filters.defaultSkillSubject", [])}
              placeholder="Type to search skills"
              textField={"name"}
              onSearch={this.inputFromUser}
              onChange={this.props.collectSelectedSkillSubject}
            />
          </div>
        </Grid>
        <Grid item xs={12} sm={12}>
          <div className="filters-dialog">
            <Multiselect
              onChange={this.props.skillLevelFilter}
              defaultValue={get(this.props, "filters.experienceLevel", [])}
              data={["All", "Beginner", "Intermediate", "Advanced", "Expert"]}
              placeholder="Skill Level"
            />
          </div>
        </Grid>

        {/* 3rd Row */}

        <Grid item xs={12} sm={6}>
          <MaterialInputWrapper select>
            <IconSelect
              labelText="Gender"
              inputId="gender"
              iconName="people"
              value={get(this.props, "filters.gender", "")}
              onChange={this.props.filterGender}
            >
              <MenuItem value=""> Gender</MenuItem>
              <MenuItem value={"Male Only"}> Male </MenuItem>
              <MenuItem value={"Female Only"}> Female </MenuItem>
              <MenuItem value={"All"}> All </MenuItem>
            </IconSelect>
          </MaterialInputWrapper>
        </Grid>

        <Grid item xs={12} sm={6}>
          <MaterialInputWrapper>
            <IconInput
              type="number"
              min={5}
              max={60}
              value={get(this.props, "filters.age", "")}
              onChange={this.props.filterAge}
              iconName="star"
              labelText="Ages"
            />
          </MaterialInputWrapper>
        </Grid>

        {/* Price Per Class And Per Month Section */}
        <Grid item xs={12} sm={6}>
          <SliderControl
            labelText={"Price Per Class"}
            defaultRange={get(this.props, "filters._classPrice", [10, 50])}
            value={get(this.props, "filters._classPrice", [10, 50])}
            onChange={this.props.perClassPriceFilter}
            max={100}
            min={0}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <SliderControl
            labelText={"Price Per Month"}
            defaultRange={get(this.props, "filters._monthPrice", [10, 50])}
            value={get(this.props, "filters._monthPrice", [10, 50])}
            onChange={this.props.pricePerMonthFilter}
            max={100}
            min={0}
          />
        </Grid>

        {!filtersForSuggestion && (
          <Grid item xs={12} sm={6}>
            <FilterPanelAction>
              <PrimaryButton
                fullWidth
                label="Clear Filters"
                icon={true}
                iconName="refresh"
                onClick={() => {
                  this.props.removeAllFilters();
                  this.props.onModalClose();
                }}
              />
            </FilterPanelAction>
          </Grid>
        )}

        {filtersForSuggestion ? (
          <Fragment>
            <Grid item xs={12} sm={6}>
              <SuggestionFormButton>
                <FilterPanelAction>
                  <PrimaryButton
                    fullWidth
                    label="Suggest School"
                    icon={true}
                    iconName="sentiment_satisfied"
                    onClick={this.props.onGiveSuggestion}
                  />
                </FilterPanelAction>
              </SuggestionFormButton>
            </Grid>

            <Grid item xs={12} sm={6}>
              <SuggestionFormButton right>
                <FilterPanelAction>
                  <PrimaryButton
                    fullWidth
                    label="Search Again"
                    onClick={this.props.removeAllFilters}
                  />
                </FilterPanelAction>
              </SuggestionFormButton>
            </Grid>
          </Fragment>
        ) : (
          <Grid item xs={12} sm={6}>
            <FilterPanelAction>
              {this.props.isCardsBeingSearched ? (
                <PrimaryButton
                  fullWidth
                  disabled
                  withLoader
                  label="Searching"
                />
              ) : (
                <PrimaryButton
                  fullWidth
                  label="Close"
                  onClick={() => this.props.onModalClose()}
                />
              )}
            </FilterPanelAction>
          </Grid>
        )}
      </Grid>
    );
  };
  render() {
    const { showMoreFilters } = this.state;
    const {
      stickyPosition,
      mapView,
      filtersInDialogBox,
      fullWidth
    } = this.props;
    // console.log("FilterPanel props  -->>",this.props);
    // console.log("FilterPanel state  -->>",this.state);
    return (
      <MuiThemeProvider theme={muiTheme}>
        <FilterPanelOuterContainer mapView={mapView}>
          <FilterPanelContainer
            fullWidth={fullWidth}
            mapView={mapView}
            stickyPosition={stickyPosition}
            filtersInDialogBox={filtersInDialogBox}
          >
            <FilterPanelContent
              mapView={mapView}
              stickyPosition={stickyPosition}
              filtersInDialogBox={filtersInDialogBox}
            >
              <form noValidate autoComplete="off">
                {filtersInDialogBox
                  ? this.renderFiltersForDialogBox()
                  : this.renderFilterBar()}
              </form>
            </FilterPanelContent>
          </FilterPanelContainer>
        </FilterPanelOuterContainer>
      </MuiThemeProvider>
    );
  }
}

FilterPanel.propTypes = {
  handleShowMoreFiltersButtonClick: PropTypes.func,
  filtersInDialogBox: PropTypes.bool,
  filtersForSuggestion: PropTypes.bool,
  displayChangeViewButton: PropTypes.bool,
  giveSchoolSuggestion: PropTypes.func,
  fullWidth: PropTypes.bool,
  stickyPosition: PropTypes.bool,
  mapView: PropTypes.bool,
  onGiveSuggestion: PropTypes.func
};

FilterPanel.defaultProps = {
  filtersInDialogBox: false,
  filtersForSuggestion: false,
  displayChangeViewButton: true,
  fullWidth: false,
  onGiveSuggestion: () => {}
};

export default FilterPanel;
