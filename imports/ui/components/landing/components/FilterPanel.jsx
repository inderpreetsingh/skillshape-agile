import React ,{Component, Fragment} from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import get from 'lodash/get';

import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import Menu, { MenuItem } from 'material-ui/Menu';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
// import ChipInput from 'material-ui-chip-input';
import Multiselect from 'react-widgets/lib/Multiselect';
import { withStyles } from 'material-ui/styles';
import styled from 'styled-components';
//import './jss/reactWidgets.scss';

import IconInput from './form/IconInput.jsx';
import IconSelect from './form/IconSelect.jsx';
import SliderControl from './form/SliderControl.jsx';
import MyMultiSelect from './form/multiSelect/MyMultiSelect.jsx';
import IconButton from 'material-ui/IconButton';
import {FormHelperText } from 'material-ui/Form';

import {coverSrc} from '../site-settings.js';

import { MuiThemeProvider} from 'material-ui/styles';
import * as helpers from './jss/helpers.js';
import muiTheme from './jss/muitheme.jsx';
import PrimaryButton from './buttons/PrimaryButton.jsx';
import Hidden from 'material-ui/Hidden';

import {dataSourceSkills} from '../constants/filtersData.js';

const FilterPanelOuterContainer = styled.div`
  width: 100%;
  border-bottom: ${props => props.mapView ? 'none' : `2px solid ${helpers.panelColor}`};
`;

const FilterPanelContainer = styled.div`
    max-width: ${props => props.filtersInDialogBox || (props.stickyPosition || props.mapView) ? '100%' : '1000px'};
    width: ${props => props.mapView ? '100%' : 'auto'};
    background: ${props => props.filtersInDialogBox || (props.stickyPosition || props.mapView) ? '#ffffff' : 'transparent'};
    margin: auto;
    position: ${props => props.mapView ? 'fixed' : 'initial'};
    border-bottom: ${props => props.mapView ? `2px solid ${helpers.panelColor}`: 'none' };
    z-index: 100;
`;

const FilterPanelContent = styled.div`
    padding: ${props => (props.stickyPosition || props.mapView || props.filtersInDialogBox) ? (helpers.rhythmDiv * 2) : (helpers.rhythmDiv * 3)}px;
    margin:auto;
`;

const FilterPanelAction = styled.div`
    padding:${helpers.rhythmDiv*2}px 0px;
`;

const FilterPanelActionText = styled.p`
  margin: 0;
  margin-top: ${helpers.rhythmDiv}px;
`;

const FilterButtonArea = styled.div`
    ${helpers.flexCenter}
    max-width: 300px;
    margin: auto;
    margin-top:-24px;
`;

const MaterialInputWrapper = styled.div`
  transform: translateY(-${props => props.select ? (helpers.rhythmDiv + 2) : helpers.rhythmDiv}px);
`;

class FilterPanel extends Component {
    state = {
        showMoreFilters: false,
        skillCategoryData:[],
        skillSubjectData:[],
        locationName: '',
        filter: {
            skillSubjectIds: null,
            perClassPrice: [],
            pricePerMonth: [],
            gender: null,
            schoolName: null,
            age: null
        }
    }
    componentWillMount() {
        const dataSourceCategories = Meteor.call('getAllSkillCategories', (err,result) => {
            console.log(result,'result');
            this.setState({skillCategoryData:result})
        });
    }
    handleShowFilterState = (state) => {
        this.setState({
            showMoreFilters: state
        });
    }
    // This is used to get subjects on the basis of subject category.
    inputFromUser = (text) => {
        // Do db call on the basis of text entered by user
        let skillCategoryIds = this.props.filters.skillCategoryIds;
            Meteor.call("getSkillSubjectBySkillCategory",{skillCategoryIds: skillCategoryIds, textSearch: text}, (err,res) => {
                if(res) {
                    console.log("result",res)
                    this.setState({skillSubjectData: res || []});
                }
            })
    }
    // This is used to collect selected skill categories
    collectSelectedSkillCategories = (text) => {
        let oldFilter = {...this.props.filters}
        let skillCategoryIds = text.map((ele) => ele._id);
        oldFilter.skillCategoryIds = skillCategoryIds;
        this.props.applyFilters(oldFilter);
    }
    // This is used to filter on the basis of skill subject
    selectSkillSubject = (text) => {
        let oldFilter = {...this.props.filters}
        let skillSubjectIds = text.map((ele) => ele._id);
        oldFilter.skillSubjectIds = skillSubjectIds;
        this.state.filter = oldFilter;
    }
    // Filter on the basis of skill level
    skillLevelFilter = (text) => {
        let oldFilter = {...this.props.filters}
        oldFilter.experienceLevel = text;
        this.props.applyFilters(oldFilter);
    }
    // Per class price filtering
    perClassPriceFilter = (text) => {
        console.log("change price per class",text);
        this.state.filter.pricePerMonth = text;
    }
    // Filter on the basis of price per month
    pricePerMonthFilter = (text) => {
        console.log("change price per class",text);
        this.state.filter.perClassPrice = text;
    }
    // This is used to filter gender.
    filterGender = (event) => {
        let oldFilter = {...this.state.filter};
        oldFilter.gender = event.target.value;
        this.setState({filter:oldFilter})
    }
    // Append age into state for filtering purpose.
    filterAge =(event) => {
        this.state.filter.age = event.target.value;
    }
    // Append School Name into state for filtering purpose
    fliterSchoolName =(event) => {
        console.log("filterGender",event.target.value);

        // This was causing issue when the filter dialog box is opened.
        //this.state.filter.schoolName = event.target.value;

        let oldFilter = {...this.state.filter};
        oldFilter.name = event.target.value;
        this.setState({ filter : oldFilter});
    }
    // Run filter method
    applyFilters = (event) => {
        // let filters = {...this.props.filters,...this.state.filter};
        // console.log("filters",filters);
        // this.props.applyFilters(filters, this.state.locationName);
        this.props.onModalClose()
    }
    onLocationChange = (location) => {
        console.log("location",location);
        this.state.filter['coords'] = location.coords;
        this.state.locationName = location.name;
        this.state.defaultLocation = null;
        this.props.clearDefaultLocation();
    }
    locationInputChanged = (event) => {
        console.log("----- locationInputChanged ----", event.target.value);

        // the location input seems blocked, otherwise.
        this.setState({
          locationName: event.target.value
        })

        if(!event.target.value) {
            this.state.filter['coords'] = null;
            this.state.locationName = null;
            this.props.clearDefaultLocation();
        }
    }
    renderFilterBar = () => {
      return (<Grid container spacing={24}>
        <Grid item xs={11} sm = {3}>
          <MaterialInputWrapper>
            <IconInput
            value={this.props.locationName}
            onChange={this.props.locationInputChanged}
            iconName='location_on'
            defaultValue={this.props.currentAddress}
            googlelocation={true}
            labelText="Location"
            onLocationChange={this.props.onLocationChange} />
          </MaterialInputWrapper>
        </Grid>

        <Hidden xsDown>
          <Grid item xs={1} sm = {3}>
            <MaterialInputWrapper>
              <IconInput
                value={get(this.props, "filters.schoolName", "")}
                iconName='school'
                onChange={this.props.fliterSchoolName}
                labelText="School Name"
              />
            </MaterialInputWrapper>
          </Grid>

          <Grid item xs={1} sm = {5}>
            <div className="homepage-filter">
              <MyMultiSelect
                textField={"name"}
                valueField={"_id"}
                data={this.state.skillCategoryData}
                placeholder="Skill category"
                onChange={this.collectSelectedSkillCategories}
                onNoOfFiltersClick={this.props.handleNoOfFiltersClick}
              />
            </div>
          </Grid>
        </Hidden>

        <Grid item xs={1} sm={1}>
           <FilterButtonArea>
              <FilterPanelAction>
                <Button fab mini onClick={this.props.handleShowMoreFiltersButtonClick}>
                   <Icon>tune </Icon>
                </Button>
              </FilterPanelAction>
           </FilterButtonArea>
        </Grid>
      </Grid>);
    }

    renderFiltersForDialogBox = () => {
      console.log("------ renderFiltersForDialogBox -----",this.props)
      return (
        <Grid container spacing={24}>
            {/* 1rst Row */}
            <Grid item xs={12} sm={6}>
            <MaterialInputWrapper>
              <IconInput
              value={this.props.locationName}
              onChange={this.props.locationInputChanged}
              iconName='location_on'
              defaultValue={this.props.currentAddress}
              googlelocation={true}
              labelText="Location"
              onLocationChange={this.props.onLocationChange} />
            </MaterialInputWrapper>
            </Grid>


            <Grid item xs={12} sm={6}>
              <MaterialInputWrapper>
                <IconInput
                  value={get(this.props, "filters.schoolName", "")}
                  iconName='school'
                  onChange={this.props.fliterSchoolName}
                  labelText="School Name"
                />
              </MaterialInputWrapper>
            </Grid>

            {/* 2nd Row */}
            <Grid item xs={12} sm = {12}>
              <div className="filters-dialog">
                <Multiselect
                  textField={"name"}
                  valueField={"_id"}
                  data={this.state.skillCategoryData}
                  placeholder="Skill category"
                  onChange={this.collectSelectedSkillCategories}
                />
              </div>
            </Grid>

            <Grid item xs={12} sm={12}>
              <div className="filters-dialog">
                 <Multiselect
                    data={this.state.skillSubjectData}
                    defaultValue={this.state.skillSubjectData}
                    placeholder="Type to search skills"
                    textField={"name"}
                    onSearch={this.inputFromUser}
                    onChange ={this.selectSkillSubject}
                  />
                </div>
            </Grid>
            <Grid item xs={12} sm={12}>
              <div className="filters-dialog">
                <Multiselect
                  onChange={this.skillLevelFilter}
                  data={["All","Beginner", "Intermediate", "Advanced", "Expert"]}
                  placeholder="Skill Level" />
              </div>
            </Grid>

            {/* 3rd Row */}

            <Grid item xs={12} sm={6}>
                <MaterialInputWrapper select>
                  <IconSelect labelText="Gender" inputId="gender" iconName="people" value={this.props.filters.gender} onChange={this.props.filterGender}>
                    <MenuItem value=""> Gender</MenuItem>
                    <MenuItem value={"Male"}> Male </MenuItem>
                    <MenuItem value={"Female"}> Female </MenuItem>
                    <MenuItem value={"Any"}> Any </MenuItem>
                  </IconSelect>
                </MaterialInputWrapper>
            </Grid>

            <Grid item xs={12} sm={6}>
                <MaterialInputWrapper>
                  <IconInput
                    type="number"
                    min={5}
                    max={60}
                    value={this.props.filters.age || ""}
                    onChange={this.props.filterAge}
                    iconName='star'
                    labelText="Ages"
                  />
                </MaterialInputWrapper>
            </Grid>

            {/* Price Per Class And Per Month Section */}
            <Grid item xs={12} sm={6} >
              <SliderControl
                labelText={"Price Per Class"}
                onChange={this.props.perClassPriceFilter}
                max={100}
                min={1}
                defaultValue={[0,45]}
              />
            </Grid>


            <Grid item xs={12} sm={6} >
              <SliderControl
                labelText={"Price Per Month"}
                onChange={this.props.pricePerMonthFilter}
                max={100}
                min={1}
                defaultValue={[1,30]}
              />
            </Grid>

            <Grid item xs={12} sm={12} >
             <FilterPanelAction>
                <PrimaryButton fullWidth label="Apply filters & Search" icon={true} iconName="search" onClick={this.applyFilters}/>
              </FilterPanelAction>
            </Grid>
          </Grid>
      )
    }
    render() {
      const { showMoreFilters } = this.state;
      const { stickyPosition, mapView, filtersInDialogBox } = this.props;
      console.log("FilterPanel props  -->>",this.props);
      console.log("FilterPanel state  -->>",this.state);
      return (
          <MuiThemeProvider theme={muiTheme}>
            <FilterPanelOuterContainer mapView={mapView}>
              <FilterPanelContainer mapView={mapView} stickyPosition={stickyPosition} filtersInDialogBox={filtersInDialogBox}>
                  <FilterPanelContent mapView={mapView} stickyPosition={stickyPosition} filtersInDialogBox={filtersInDialogBox}>
                   <form noValidate autoComplete="off">
                      {filtersInDialogBox ? this.renderFiltersForDialogBox() : this.renderFilterBar()}
                    </form>
                  </FilterPanelContent>
              </FilterPanelContainer>
            </FilterPanelOuterContainer>
          </MuiThemeProvider>
        )
    }
}

const CssTransitionGroupWrapperGrid = (props) => (
    <Grid container spacing="24">
        {props.children}
    </Grid>
);

FilterPanel.propTypes = {
  handleShowMoreFiltersButtonClick: PropTypes.func,
  filtersInDialogBox: PropTypes.bool
}

FilterPanel.defaultProps = {
  filtersInDialogBox: false
}

export default FilterPanel;
