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
    margin:auto;
    flex-grow: 1;
`;

const FilterPanelContent = styled.div`
    padding:24px;
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

const CenterCapsule = styled.div`
    font-size:12px;
    line-height:${helpers.baseFontSize}px;
    background:white;
    border-radius:400px;
    max-width:200px;
    color:${helpers.textColor};
    background:${helpers.panelColor};
    margin:auto;
    transform: translateY(-50%);
    text-transform:uppercase;
    letter-spacing:1px;
    box-shadow:2px 2px 3px rgba(0,0,0,0.1);
    text-align:center;
    padding:4px;
`;

class FilterPanel extends Component {
    state = {
        showMoreFilters: false,
        skillCategoryData:[],
        skillSubjectData:[],
        filter: {
            skillCategoryIds:[],
            skillSubjectIds:null
        }
    }
    componentWillMount() {
        const dataSourceCategories = Meteor.call('getAllSkillCategories', (err,result) => {
            console.log(result,'result');
            this.setState({skillCategoryData:result})
        });
    }
    componentWillRecieveProps() {
        console.log("componentWillRecieveProps",componentWillRecieveProps)
    }
    handleShowFilterState = (state) => {
        this.setState({
            showMoreFilters: state
        });
    }

    inputFromUser = (text) => {
        // Do db call on the basis of text entered by user
        console.log("text -->>",this.state.filter.skillCategoryIds);
        let skillCategoryIds = this.state.filter.skillCategoryIds && this.state.filter.skillCategoryIds.map((data) => data._id)
            Meteor.call("getSkillSubjectBySkillCategory",{skillCategoryIds: skillCategoryIds, textSearch: text}, (err,res) => {
                if(res) {
                    console.log("result",res)
                    this.setState({skillSubjectData: res || []});
                }
            })
    }

    collectSelectedSkillCategories = (text) => {
        // Get selected categories first
        let oldFilter = {...this.state.filter}
        oldFilter.skillCategoryIds = text;
        this.setState({filter:oldFilter});
    }
    selectSkillSubject = (text) => {
        console.log("this",this)
        let oldFilter = {...this.state.filter}
        oldFilter.skillSubjectIds = text;
        this.setState({filter:oldFilter});
    }
    conditionalRender = () => {
        const { showMoreFilters}  = this.state;

        if(showMoreFilters) {
          return (
            <Grid container spacing={24}>

                <Hidden xsUp>
                    <Grid item xs={11} sm = {5}>
                       <Multiselect data={["All","Beginner", "Intermediate", "Advance", "Expert"]}  placeholder="Skill Level" />
                    </Grid>
                </Hidden>

                <Grid item xs={11} sm = {11}>
                   <Multiselect
                        data={this.state.skillSubjectData}
                        placeholder="Choose Skills"
                        textField={"name"}
                        onSearch={this.inputFromUser}
                        onChange ={this.selectSkillSubject}
                    />
                </Grid>

                 <Grid item xs={11} sm={6} >
                   <SliderControl labelText={"Price Per Class"} onChange={() => console.log('changing')} max={100} min={1} defaultValue={[0,45]}/>
                </Grid>


                <Grid item xs={11} sm={5} >
                   <SliderControl labelText={"Price Per Month"} max={100} min={1} defaultValue={[1,30]} />
                </Grid>

                <Grid item xs={11} sm={3}>
                    <IconInput iconName='location_on' labelText="Location"  />
                </Grid>


                <Grid item xs={11} sm={3}>
                    <IconInput iconName='school' labelText="School Name"  />
                </Grid>

                <Grid item xs={6} sm={3}>
                    <IconSelect labelText="Gender" inputId="gender" iconName="people">
                      <MenuItem value=""> Gender</MenuItem>
                      <MenuItem value={"male"}> Male </MenuItem>
                      <MenuItem value={"female"}> Female </MenuItem>
                      <MenuItem value={"others"}> Others </MenuItem>
                    </IconSelect>
                </Grid>

                  <Grid item xs={5} sm={2}>
                    <IconInput iconName='star' labelText="Age"  />
                </Grid>

                <Grid item xs={11} sm={6} >
                 <FilterPanelAction>
                    <PrimaryButton fullWidth label="Apply filters & Search" icon={true} iconName="search"/>
                </FilterPanelAction>
              </Grid>
            </Grid>
            )
        }
    }
    render() {
        const { showMoreFilters } = this.state;
        console.log("this.state",this.state)

        return (<MuiThemeProvider theme={muiTheme}>
            <FilterPanelContainer>
                <CenterCapsule> Browse using Filters ⤵ </CenterCapsule>

                <FilterPanelContent>
                 <form noValidate autoComplete="off">

                    <Grid container spacing="24">

                        <Grid item xs={9} sm = {6}>
            	           <Multiselect
                                textField={"name"}
                                valueField={"_id"}
                                data={this.state.skillCategoryData}
                                placeholder="Skill category"
                                onChange={this.collectSelectedSkillCategories}
                            />

                        </Grid>
                        <Hidden xsDown>
                        <Grid item xs={11} sm = {5}>
            	            <Multiselect data={["All","Beginner", "Intermediate", "Advance", "Expert"]}  placeholder="Skill Level" />

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
