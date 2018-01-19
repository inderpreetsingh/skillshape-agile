import React from "react";
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import Multiselect from 'react-widgets/lib/Multiselect'
import Hidden from 'material-ui/Hidden';
import { MuiThemeProvider} from 'material-ui/styles';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import TextField from 'material-ui/TextField';


import * as helpers from '/imports/ui/components/landing/components/jss/helpers';
import muiTheme from '/imports/ui/components/landing/components/jss/muitheme';
import IconInput from '/imports/ui/components/landing/components/form/IconInput';

const FilterPanelContainer = styled.div`
    max-width:1000px;
    max-width: ${props => props.stickyPosition ? '100%' : '1000px'};
    background: ${props => props.stickyPosition ? '#ffffff' : '1000px'};
    margin: auto;
    flex-grow: 1;
`;

const FilterPanelContent = styled.div`
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
export default function (props) {
  console.log("props and this===>",props,this)
  const { stickyPosition } = props;

  return (
    <MuiThemeProvider theme={muiTheme}>
      <FilterPanelContainer stickyPosition={stickyPosition}>
        <FilterPanelContent stickyPosition={stickyPosition}>
         <form noValidate autoComplete="off">
            <Grid container>
              <Grid item xs={9} sm={4}>
                <TextField
                  id="search"
                  label="School Name"
                  type="search"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={9} sm={4}>
                <IconInput onChange={this.locationInputChanged} iconName='location_on'  googlelocation={true} labelText="Location" onLocationChange={this.onLocationChange} />
              </Grid>
              <Grid item xs={9} sm = {4}>
                 <Multiselect
                    textField={"name"}
                    valueField={"_id"}
                    placeholder="Skill category"
                    data = {this.props && this.props.dataForSkillTypes}
                    onChange={props.onSearch}
                  />
              </Grid>
            </Grid>
          </form>
        </FilterPanelContent>
      </FilterPanelContainer>
    </MuiThemeProvider>
  )
}
      /*<div className='container-fluid' >
        <div className="card" id="scr_affix">
          <div className="col-sm-2">
            <div className="form-group label-floating is-empty has-warning">
              <input
                  className="form-control"
                  type="text"
                  aria-required="true"
                  placeholder="School name"
                  name="schoolName"
                  ref= { (ref) => {this.schoolName = ref} }
              />
              <span className="material-input"/>
              <span className="material-input"/>
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group label-floating is-empty has-warning">
              <select
                  className="form-control"
                  style={{width: '100%'}}
                  name="typeOfSchool"
                  ref= { (ref) => {this.typeOfSkill = ref}}
              >
                <option disabled selected>Type Of Skills</option>
                <option >Any</option>
                <option value="AIKI-YOUTH AIKIDO">AIKI-YOUTH AIKIDO</option>
                { this.props.dataForSkillTypes.map((skill, i) => {
                  return (<option key={i} value={`${skill.name}`}>{skill.name}</option>)
                }) }
              </select>
              <span className="material-input"/>
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group label-floating is-empty has-warning">
              <input
                  className="form-control"
                  type="text"
                  aria-required="true"
                  placeholder="Address"
                  name="address"
                  ref= { (ref) => {this.address = ref} }
                  autoComplete="off"
              />
              <span className="material-input"/>
              <span className="material-input"/>
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group label-floating is-empty has-warning">
              <input
                  className="form-control"
                  type="text"
                  aria-required="true"
                  placeholder="Website"
                  name="website"
                  ref= { (ref) => {this.website = ref} }
                  id="web"
              />
              <span className="material-input"/>
              <span className="material-input"/>
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group label-floating is-empty has-warning">
              <input
                  className="form-control"
                  type="text"
                  aria-required="true"
                  placeholder="Phone Number"
                  name="phoneNumber"
                  ref= { (ref) => {this.phoneNumber = ref} }
                  id="phone"
              />
              <span className="material-input"/>
              <span className="material-input"/>
            </div>
          </div>
          <div className="col-sm-2" style={{paddingTop: 10}}>
            <a onClick={() => this.props.onSearch(this) } style={{marginRight: '4px'}} id="search" title="Search"
               className="btn btn-warning btn-sm search"><i className="material-icons md-18">search</i></a>
            <a onClick={() => this.props.resetFilter(this) } id="view_list" title="reset filter" className="btn btn-warning btn-sm clear_filter"><i
                className="material-icons md-18">autorenew</i></a>
          </div>
        </div>
      </div>*/