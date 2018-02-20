import React from "react";
import styled from 'styled-components';
import Grid from 'material-ui/Grid';

import Multiselect from 'react-widgets/lib/Multiselect';
import Hidden from 'material-ui/Hidden';
import { MuiThemeProvider} from 'material-ui/styles';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import TextField from 'material-ui/TextField';


import * as helpers from '/imports/ui/components/landing/components/jss/helpers';
import muiTheme from '/imports/ui/components/landing/components/jss/muitheme';
import IconInput from '/imports/ui/components/landing/components/form/IconInput';
import MyMultiSelect from '/imports/ui/components/landing/components/form/multiSelect/MyMultiSelect.jsx';

const FilterPanelContainer = styled.div`
    max-width:1000px;
    max-width: ${props => props.stickyPosition ? '100%' : '1000px'};
    background: ${props => props.stickyPosition ? '#ffffff' : 'white'};
    margin: auto;
    flex-grow: 1;
    padding: 16px;
    overflow: visible;
`;

const FilterPanelContent = styled.div`
    margin:auto;
`;

const FilterPanelInnerContent = styled.div`
    max-width:1000px;
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
  console.log("ClaimSchoolFilter props and this===>",props)
  const { stickyPosition } = props;

  return (
    <MuiThemeProvider theme={muiTheme}>
      <FilterPanelContainer stickyPosition={stickyPosition}>
        <FilterPanelContent stickyPosition={stickyPosition}>
         <form noValidate autoComplete="off">
            <Grid container>
              <Grid item xs={9} sm={4}>
                <IconInput
                  id="search"
                  type="text"
                  margin="normal"
                  value={props.filters.schoolName || ""}
                  onChange={props.handleSchoolNameChange}
                  skillShapeInput={true}
                  iconName='school'
                  placeholder="Enter School Name"
                />
              </Grid>
              <Grid item xs={9} sm={4}>
                <IconInput
                  skillShapeInput={true}
                  onChange={props.locationInputChanged}
                  iconName='location_on'
                  googlelocation={true}
                  onLocationChange={props.onLocationChange}
                  value={props.filters.locationName || ""}
                />
              </Grid>
              <Grid item xs={9} sm = {4}>
                <div className="my-multi-select-filter">
                 <MyMultiSelect
                    textField={"name"}
                    valueField={"_id"}
                    placeholder="Skill category"
                    data = {this.props && this.props.dataForSkillTypes}
                    onChange={this.props.handleSkillCategoryChange}
                  />
                </div>
              </Grid>
            </Grid>
          </form>
        </FilterPanelContent>
      </FilterPanelContainer>
    </MuiThemeProvider>
  )
}
