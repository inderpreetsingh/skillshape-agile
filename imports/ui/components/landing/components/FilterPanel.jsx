import React ,{Component, Fragment} from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import get from 'lodash/get';

import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import Menu, { MenuItem } from 'material-ui/Menu';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
// import ChipInput from 'material-ui-chip-input';
import Multiselect from 'react-widgets/lib/Multiselect';
import { withStyles } from 'material-ui/styles';
import styled from 'styled-components';
//import './jss/reactWidgets.scss';

import IconInput from './form/IconInput.jsx';
import IconSelect from './form/IconSelect.jsx';
import SliderControl from './form/SliderControl.jsx';
import MyMultiSelect from './form/multiSelect/MyMultiSelect.jsx';
import FloatingChangeViewButton from './buttons/FloatingChangeViewButton.jsx';

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
    transform: translateY(${helpers.rhythmDiv}px);
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

const SwitchViewWrapper = styled.div`
  @media screen and (max-width: ${helpers.tablet + 100}px) {
    display: ${props => props.mapView ? 'none' : 'block'};
  }
`;

const GridContainerWrapper = styled.div`
  ${helpers.flexCenter}

`;

const MapChangeButtonWrapper = styled.div`
  width: 130px;

  @media screen and (max-width: ${helpers.mobile}px) {
    margin-right: ${helpers.rhythmDiv * 2}px;
    width: 80px;
  }
`;

const ContainerWrapper = styled.div`
  width: calc(100% - 130px);

  @media screen and (max-width: ${helpers.mobile}px) {
    width: calc(100% - 80px);
  }
`;

class FilterPanel extends Component {
    state = {
        showMoreFilters: false,
        skillCategoryData:[],
        skillSubjectData:[],
        locationName: '',
        mobile: false,
        filter: {
            skillSubjectIds: null,
            perClassPrice: [],
            pricePerMonth: [],
            gender: null,
            schoolName: null,
            age: null
        }
    }


      handleChangeInScreenSize = () => {
        if(window.innerWidth < 500) {
          if(!this.state.mobile) {
            this.setState({
              ...this.state,
              mobile: true,
              ...this.state.filter
            })
          }
        }else {
          if(this.state.mobile) {
            this.setState({
              ...this.state,
              mobile: false,
              ...this.state.filter
            })
          }
        }
      }

      componentDidMount = () => {
        window.addEventListener("resize",this.handleChangeInScreenSize);
      }
      componentWillUnMount = () => {
        window.removeEventListener("resize",this.handleChangeInScreenSize);
      }


    componentWillMount() {
        const dataSourceCategories = Meteor.call('getAllSkillCategories', (err,result) => {
            console.log(result,'result');
            this.setState({skillCategoryData:result})
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

    renderFilterBar = () => {
      return (<GridContainerWrapper>
        <MapChangeButtonWrapper>
        {this.props.mapView ?
          <PrimaryButton noMarginBottom icon iconName="grid_on" label={this.state.mobile ? "List" : "List View"} onClick={this.props.handleToggleMapView} />
          :
          <PrimaryButton noMarginBottom icon iconName="map" label={this.state.mobile ? "Map" : "Map View"} onClick={this.props.handleToggleMapView} />}
        </MapChangeButtonWrapper>
      <ContainerWrapper>
      <Grid container spacing={24}>
        <Grid item xs={9} sm={3}>
            <MaterialInputWrapper>
                <IconInput
                    value={get(this.props, "filters.locationName", "")}
                    onChange={(event)=> this.props.locationInputChanged(event, "filters", "tempFilters")}
                    iconName='location_on'
                    defaultValue={this.props.currentAddress}
                    googlelocation={true}
                    labelText="Location"
                    onLocationChange={(event) => this.props.onLocationChange(event, "filters", "tempFilters")}
                />
            </MaterialInputWrapper>
        </Grid>
        <Hidden xsDown>
            <Grid item xs={1} sm={4}>
                <MaterialInputWrapper>
                    <IconInput
                        value={get(this.props, "filters.schoolName", "")}
                        iconName='school'
                        onChange={(event)=> this.props.fliterSchoolName(event, "filters", "tempFilters")}
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
                        defaultValue={get(this.props, "filters.defaultSkillCategories", [])}
                        onChange={(event)=> this.props.collectSelectedSkillCategories(event, "filters", "tempFilters")}
                        onNoOfFiltersClick={this.props.handleNoOfFiltersClick}
                    />
                </div>
            </Grid>
        </Hidden>

        <Grid item xs={3} sm={1}>
           <FilterButtonArea>
              <FilterPanelAction>
                <Button fab mini onClick={this.props.handleShowMoreFiltersButtonClick}>
                   <Icon>tune </Icon>
                </Button>
              </FilterPanelAction>
           </FilterButtonArea>
        </Grid>
      </Grid>
      </ContainerWrapper>
      </GridContainerWrapper>
    );
    }

    renderFiltersForDialogBox = () => {
      console.log("------ renderFiltersForDialogBox -----",this.props)
      return (
        <Grid container spacing={24}>
            {/* 1rst Row */}
            <Grid item xs={12} sm={6}>
            <MaterialInputWrapper>
                <IconInput
                    value={get(this.props, "tempFilters.locationName", "")}
                    onChange={(event)=> this.props.locationInputChanged(event, "tempFilters")}
                    iconName='location_on'
                    defaultValue={this.props.currentAddress}
                    googlelocation={true}
                    labelText="Location"
                    onLocationChange={(event) => this.props.onLocationChange(event, "tempFilters")}
               />
            </MaterialInputWrapper>
            </Grid>


            <Grid item xs={12} sm={6}>
                <MaterialInputWrapper>
                    <IconInput
                        value={get(this.props, "tempFilters.schoolName", "")}
                        iconName='school'
                        onChange={(event)=> this.props.fliterSchoolName(event, "tempFilters")}
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
                        defaultValue={get(this.props, "tempFilters.defaultSkillCategories", [])}
                        placeholder="Skill category"
                        onChange={(event)=> this.props.collectSelectedSkillCategories(event, "tempFilters")}
                    />
                </div>
            </Grid>

            <Grid item xs={12} sm={12}>
              <div className="filters-dialog">
                 <Multiselect
                    data={this.state.skillSubjectData}
                    defaultValue={get(this.props, "tempFilters.defaultSkillSubject", [])}
                    placeholder="Type to search skills"
                    textField={"name"}
                    onSearch={this.inputFromUser}
                    onChange ={this.props.collectSelectedSkillSubject}
                  />
                </div>
            </Grid>
            <Grid item xs={12} sm={12}>
              <div className="filters-dialog">
                <Multiselect
                  onChange={this.props.skillLevelFilter}
                  defaultValue={get(this.props, "tempFilters.experienceLevel", [])}
                  data={["All","Beginner", "Intermediate", "Advanced", "Expert"]}
                  placeholder="Skill Level" />
              </div>
            </Grid>

            {/* 3rd Row */}

            <Grid item xs={12} sm={6}>
                <MaterialInputWrapper select>
                  <IconSelect labelText="Gender" inputId="gender" iconName="people" value={get(this.props, "tempFilters.gender", "")} onChange={this.props.filterGender}>
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
                    value={get(this.props, "tempFilters.age", "")}
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
                defaultRange={get(this.props, "tempFilters._classPrice", [10,50])}
                value={get(this.props, "tempFilters._classPrice", [10,50])}
                onChange={this.props.perClassPriceFilter}
                max={100}
                min={0}
              />
            </Grid>


            <Grid item xs={12} sm={6} >
              <SliderControl
                labelText={"Price Per Month"}
                defaultRange={get(this.props, "tempFilters._monthPrice", [10,50])}
                value={get(this.props, "tempFilters._monthPrice", [10,50])}
                onChange={this.props.pricePerMonthFilter}
                max={100}
                min={0}
              />
            </Grid>

            <Grid item xs={12} sm={12} >
             <FilterPanelAction>
                <PrimaryButton
                    fullWidth
                    label="Apply filters & Search"
                    icon={true}
                    iconName="search"
                    onClick={() => {this.props.onModalClose();this.props.applyFilters();}}/>
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
