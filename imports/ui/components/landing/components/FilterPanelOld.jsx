import React ,{Component, Fragment} from 'react';
import { CSSTransitionGroup } from 'react-transition-group';

import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import Menu, { MenuItem } from 'material-ui/Menu';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
// import ChipInput from 'material-ui-chip-input';
import Multiselect from 'react-widgets/lib/Multiselect'
import { withStyles } from 'material-ui/styles';
import styled from 'styled-components';
//import './jss/reactWidgets.scss';

import IconInput from './form/IconInput.jsx';
import IconSelect from './form/IconSelect.jsx';
import SliderControl from './form/SliderControl.jsx';
import IconButton from 'material-ui/IconButton';
import {FormHelperText } from 'material-ui/Form';

import {coverSrc} from '../site-settings.js';

import { MuiThemeProvider} from 'material-ui/styles';
import * as helpers from './jss/helpers.js';
import muiTheme from './jss/muitheme.jsx';
import PrimaryButton from './buttons/PrimaryButton.jsx';
import Hidden from 'material-ui/Hidden';

import {dataSourceSkills} from '../constants/filtersData.js';

const FilterPanelContainer = styled.div`
    max-width:1000px;
    max-width: ${props => (props.stickyPosition || props.mapView) ? '100%' : '1000px'};
    background: ${props => (props.stickyPosition || props.mapView) ? '#ffffff' : 'transparent'};
    margin: auto;
    flex-grow: 1;
    position: ${props => props.mapView ? 'fixed' : 'initial'};
    z-index: 100;
`;

const FilterPanelContent = styled.div`
    padding: ${props => (props.stickyPosition || props.mapView) ? '16px' : '24px'};
    margin:auto;
`;

const FilterPanelInnerContent = styled.div`
    max-width:1000px;
    overflow: hidden;
    margin:auto;
`;

const FilterPanelAction = styled.div`
    padding:${helpers.rhythmDiv*2}px 0px;
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
        filter: {
            skillSubjectIds:null,
            perClassPrice:[],
            pricePerMonth:[],
            gender:null,
            schoolName:null,
            age:null
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
        // It's Needed since sticky position is adding
        // a min-height to the div.
        if(!this.props.stickyPosition && this.state.showMoreFilters && !state)
          window.scrollBy(0,1);
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
        this.state.filter.schoolName = event.target.value;
    }
    // Run filter method
    applyFilters = (event) => {
        let filters = {...this.props.filters,...this.state.filter};
        console.log("filters",filters);
        this.props.applyFilters(filters, this.state.locationName);
    }
    onLocationChange = (location) => {
        console.log("location",location);
        this.state.filter['coords'] = location.coords;
        this.state.locationName = location.name;
        this.state.defaultLocation = null;
        this.props.clearDefaultLocation();
    }
    locationInputChanged = (event) => {
        console.log("locationInputChanged", event.target.value);
         if(!event.target.value) {
            this.state.filter['coords'] = null;
            this.state.locationName = null;
            this.props.clearDefaultLocation();
        }
    }
    conditionalRender = () => {
        const { showMoreFilters }  = this.state;
        // console.log("currentAddress", this.props.currentAddress)
        if(showMoreFilters) {
          return (
            <Grid container spacing={24}>

                <Hidden smUp>
                  <Grid item xs={11} sm = {3}>
                    <MaterialInputWrapper>
                      <IconInput iconName='school' onChange={this.fliterSchoolName} labelText="School Name"  />
                    </MaterialInputWrapper>
                  </Grid>

                  <Grid item xs={11} sm = {5}>
                    <Multiselect
                    textField={"name"}
                    valueField={"_id"}
                    data={this.state.skillCategoryData}
                    placeholder="Skill category"
                    onChange={this.collectSelectedSkillCategories}
                    />

                  </Grid>
                </Hidden>

                <Grid item xs={11} sm = {11}>
                   <Multiselect
                        data={this.state.skillSubjectData}
                        placeholder="Type to search skills"
                        textField={"name"}
                        onSearch={this.inputFromUser}
                        onChange ={this.selectSkillSubject}
                    />
                </Grid>


                <Grid item xs={11} sm={6}>
                    <Multiselect onChange={this.skillLevelFilter} data={["All","Beginner", "Intermediate", "Advanced", "Expert"]}  placeholder="Skill Level" />
                </Grid>

                <Grid item xs={6} sm={3}>
                    <MaterialInputWrapper select>
                      <IconSelect labelText="Gender" inputId="gender" iconName="people" value={this.state.filter.gender} onChange={this.filterGender}>
                        <MenuItem value=""> Gender</MenuItem>
                        <MenuItem value={"Male"}> Male </MenuItem>
                        <MenuItem value={"Female"}> Female </MenuItem>
                        <MenuItem value={"Any"}> Any </MenuItem>
                      </IconSelect>
                    </MaterialInputWrapper>
                </Grid>

                  <Grid item xs={5} sm={2}>
                    <MaterialInputWrapper>
                      <IconInput onChange={this.filterAge} iconName='star' labelText="Age"  />
                    </MaterialInputWrapper>
                </Grid>

                <Grid item xs={11} sm={6} >
                  <SliderControl labelText={"Price Per Class"} onChange={this.perClassPriceFilter} max={100} min={1} defaultValue={[0,45]}/>
                </Grid>


                <Grid item xs={11} sm={5} >
                  <SliderControl labelText={"Price Per Month"} onChange={this.pricePerMonthFilter} max={100} min={1} defaultValue={[1,30]} />
                </Grid>


                <Grid item xs={11} sm={6} hidden={{smDown: true}}>

                </Grid>

                <Grid item xs={11} sm={5} >
                 <FilterPanelAction>
                    <PrimaryButton fullWidth label="Apply filters & Search" icon={true} iconName="search" onClick={this.applyFilters}/>
                  </FilterPanelAction>
                </Grid>
            </Grid>
            )
        }
    }
    render() {
      const { showMoreFilters } = this.state;
        // console.log(this.state);
      const { stickyPosition, mapView } = this.props;

      return (
          <MuiThemeProvider theme={muiTheme}>
            <FilterPanelContainer stickyPosition={stickyPosition} mapView={mapView}>
                <FilterPanelContent stickyPosition={stickyPosition} mapView={mapView}>
                 <form noValidate autoComplete="off">

                    <Grid container spacing={24}>

                      <Grid item xs={9} sm = {3}>
                        <MaterialInputWrapper>
                          <IconInput onChange={this.locationInputChanged} iconName='location_on' defaultValue={this.props.currentAddress} googlelocation={true} labelText="Location" onLocationChange={this.onLocationChange} />
                        </MaterialInputWrapper>
                      </Grid>

                      <Hidden xsDown>
                        <Grid item xs={1} sm = {3}>
                          <MaterialInputWrapper>
                            <IconInput iconName='school' onChange={this.fliterSchoolName} labelText="School Name"  />
                          </MaterialInputWrapper>
                        </Grid>

                        <Grid item xs={1} sm = {5}>
                          <Multiselect
                          textField={"name"}
                          valueField={"_id"}
                          data={this.state.skillCategoryData}
                          placeholder="Skill category"
                          onChange={this.collectSelectedSkillCategories}
                          />

                        </Grid>
                      </Hidden>

                    	<Grid item xs={3} sm={1}>
                    	   <FilterButtonArea>
                	           	    <FilterPanelAction>
                    	       { showMoreFilters ?
                        	    <Button fab  mini className="show-more-filter-button" zDepth={0} onClick={() => this.handleShowFilterState(false)} >
                                <Icon>close</Icon>
                              </Button>
                        	    :
                        	    <Button fab mini onClick={() => this.handleShowFilterState(true)}>
                        	     <Icon>tune </Icon>
                        	   </Button>

                    	       }
                    	         </FilterPanelAction>
                	       </FilterButtonArea>
                    	</Grid>
                    </Grid>


                    {this.conditionalRender()}

                    </form>
                </FilterPanelContent>
            </FilterPanelContainer>
          </MuiThemeProvider>
        )
    }
}

const CssTransitionGroupWrapperGrid = (props) => (
    <Grid container spacing="24">
        {props.children}
    </Grid>
);

export default FilterPanel;
