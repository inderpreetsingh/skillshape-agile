import { FormControl } from 'material-ui/Form';
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import React from "react";
import styled from 'styled-components';
import { MaterialDatePicker } from '/imports/startup/client/material-ui-date-picker';
import FormGhostButton from "/imports/ui/components/landing/components/buttons/FormGhostButton.jsx";
import * as helpers from '/imports/ui/components/landing/components/jss/helpers';

const FilterPanelContainer = styled.div`
    max-width:1100px;
    max-width: ${props => props.stickyPosition ? '100%' : '1100px'};
    background: ${props => props.stickyPosition ? '#ffffff' : '1100px'};
    margin: auto;
    flex-grow: 1;
    padding:16px;
`;

const FilterPanelContent = styled.div`
    margin:auto;
`;

const FilterPanelInnerContent = styled.div`
    max-width:1100px;
    overflow: hidden;
    margin:auto;
`;

const FilterPanelAction = styled.div`
    padding:${helpers.rhythmDiv * 2}px 0px;
`;

const FilterButtonArea = styled.div`
    ${helpers.flexCenter}
    max-width: 300px;
    margin: auto;
    margin-top:-24px;
`;

export default function () {
    const { stickyPosition, classes } = this.props;
    return (
        <FilterPanelContainer stickyPosition={stickyPosition}>
            <FilterPanelContent stickyPosition={stickyPosition}>
                <form noValidate autoComplete="off">
                    <Grid container>
                        <Grid item xs={12} sm={3}>
                            <FormControl fullWidth margin='dense'>
                                <TextField
                                    id="mediaName"
                                    label="Media Name"
                                    value={this.state.mediaName}
                                    onChange={(e) => this.setState({ mediaName: e.target.value })}
                                    margin="normal"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <FormControl fullWidth margin='dense'>
                                <MaterialDatePicker
                                    required={false}
                                    hintText={"From"}
                                    emptyLabel="Select a Date"
                                    value={this.state.startDate}
                                    onChange={(date) => this.setState({ startDate: date.toISOString() })}
                                    fullWidth={true}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <FormControl fullWidth margin='dense'>
                                <MaterialDatePicker
                                    required={false}
                                    hintText={"To"}
                                    emptyLabel="Select a Date"
                                    value={this.state.endDate}
                                    onChange={(date) => this.setState({ endDate: date.toISOString() })}
                                    fullWidth={true}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={1}>
                            {/* <Button className={classes.searchBtn} onClick={() => this.props.onSearch({...this.state})}>
                                Search
                            </Button> */}
                            <FormGhostButton
                                onClick={() => this.props.onSearch({ ...this.state })}
                                label="Search"
                            />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                            {/* <Button className={classes.resetBtn} onClick={this.resetFilter}>
                                Reset
                            </Button> */}

                            <FormGhostButton
                                darkGreyColor
                                onClick={this.resetFilter}
                                label="Reset"
                            />
                        </Grid>
                    </Grid>
                </form>
            </FilterPanelContent>
        </FilterPanelContainer>
    )
}