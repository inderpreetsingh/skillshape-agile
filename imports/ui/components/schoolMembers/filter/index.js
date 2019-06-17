import get from 'lodash/get';
import { MuiThemeProvider, withStyles } from 'material-ui/styles';
import React, { Component } from 'react';
import Multiselect from 'react-widgets/lib/Multiselect';
// import SchoolMemberFilterRender from "./schoolMemberFilter";
import styled from 'styled-components';
import IconInput from '/imports/ui/components/landing/components/form/IconInput';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers';
import muiTheme from '/imports/ui/components/landing/components/jss/muitheme';

// import ClassType from "/imports/api/classType/fields";

const styles = {
  widget: {
    background: 'transparent',
  },
};

const FilterPanelContainer = styled.div`
  background: ${props => (props.stickyPosition ? '#ffffff' : '1000px')};
  flex-grow: 1;
  padding: 16px;
`;

const FilterPanelContent = styled.div``;

const Inputs = styled.div`
	margin: 0 auto;
	display: flex;
	width: 100%;
	justify-content: center;
	flex-wrap: wrap;
	margin-bottom: ${helpers.rhythmDiv * 4}px;															}px;
	${props => props.cardsView === 'list' && 'margin-bottom: 0;'}
`;

const InputWrapper = styled.div`
	max-width: 300px;
	width: 100%;
	margin-right: ${helpers.rhythmDiv * 4}px;
	${props => props.cardsView === 'list' && 'max-width: none;'}
	${props => (props.noMarginRight || props.cardsView === 'list') && 'margin-right: 0;'}

	@media screen and (max-width: ${helpers.mobile}px) {
		margin-right: 0;
	}
`;

class SchoolMemberFilter extends Component {
  state = {
    classTypeData: [],
  };

  setClassTypeData = (classTypeData) => {
    this.setState({ classTypeData });
  };

  render() {
    const {
      stickyPosition, view, classes, cardsView,
    } = this.props;

    return (
      <MuiThemeProvider theme={muiTheme}>
        <FilterPanelContainer stickyPosition={stickyPosition}>
          <FilterPanelContent stickyPosition={stickyPosition}>
            <form noValidate autoComplete="off">
              <Inputs cardsView={cardsView}>
                <InputWrapper cardsView={cardsView}>
                  <IconInput
                    id="search"
                    type="text"
                    margin="normal"
                    onChange={this.props.handleMemberNameChange}
                    skillShapeInput
                    iconName="search"
                    classes={{ widgetInput: classes.widget, widgetRoot: classes.widget }}
                    placeholder={`Search ${view == 'classmates' ? 'Member' : 'Admin'} by Name`}
                    value={get(this.props, 'filters.memberName', '')}
                  />
                </InputWrapper>
                <InputWrapper cardsView={cardsView}>
                  <div className="ss-multi-select--transparent">
                    <Multiselect
                      className={classes.input}
                      textField="name"
                      valueField="_id"
                      placeholder={`Search ${
                        view == 'classmates' ? 'Member' : 'Admin'
                      } by Class Type`}
                      data={this.props.classTypeData}
                      onChange={this.props.handleClassTypeDataChange}
                    />
                  </div>
                </InputWrapper>
              </Inputs>
            </form>
          </FilterPanelContent>
        </FilterPanelContainer>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(SchoolMemberFilter);
