import React, { Fragment } from "react";
import styled from "styled-components";
import moment from "moment";
import Button from "material-ui/Button";
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "material-ui/Dialog";
import ExpandMoreIcon from "material-ui-icons/ExpandMore";
import MoreVertIcon from "material-ui-icons/MoreVert";
import Typography from "material-ui/Typography";
import Grid from "material-ui/Grid";
import Icon from "material-ui/Icon";
import Add from "material-ui-icons/Add";
import Edit from "material-ui-icons/Edit";
import Delete from "material-ui-icons/Delete";
import ExpansionPanel, {
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  ExpansionPanelActions
} from "material-ui/ExpansionPanel";
import Divider from "material-ui/Divider";

import SkillShapeDialogBox from "/imports/ui/components/landing/components/dialogs/SkillShapeDialogBox.jsx";

import {
  rhythmDiv,
  mobile
} from "/imports/ui/components/landing/components/jss/helpers.js";

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;

  @media screen and (max-width: 400px) {
    flex-direction: column;
    justify-content: center;
  }
`;

const ButtonWrapper = styled.div`
  margin-top: ${rhythmDiv * 2}px;
  margin-right: ${rhythmDiv * 2}px;
`;

export default function(props) {
  const {
    classes,
    childPanelHeader,
    childTable,
    childTableData,
    parentKey,
    parentData,
    schoolId
  } = this.props;
  const FormComponent = childPanelHeader.actions.component;
  return (
    <div>
      {this.props.childTable.title == "Class Times" ? (
        <div className="panel-child-table">
          {(this.state.showForm ||
            (this.props &&
              this.props.MainTableHandleSubmit &&
              this.props.MainTableHandleSubmit[
                this.props && this.props.parentKey
              ])) && (
            <FormComponent
              schoolId={schoolId}
              parentKey={parentKey}
              parentData={parentData}
              data={this.state.formData}
              open={
                this.state.showForm ||
                (this.props.MainTableHandleSubmit &&
                  this.props.MainTableHandleSubmit[
                    this.props && this.props.parentKey
                  ])
              }
              onClose={this.handleFormModal}
              moveToNextTab={this.props.moveToNextTab}
            />
          )}

          <ExpansionPanel expanded={true}>
            <ExpansionPanelSummary className={classes.classtimeHeader}>
              <Grid container>
                <Grid
                  item
                  lg={9}
                  sm={9}
                  xs={12}
                  style={{
                    color: "#fff",
                    display: "inline-flex",
                    alignItems: "center"
                  }}
                >
                  <span>
                    <Icon className="material-icons" style={{ marginRight: 5 }}>
                      {childPanelHeader.leftIcon}
                    </Icon>
                  </span>
                  <span>{childPanelHeader.notes}</span>
                </Grid>
                <Grid item lg={1} sm={3} xs={12}>
                  <Button
                    className={classes.headerBtn}
                    onClick={() =>
                      this.setState({ showForm: true, formData: null })
                    }
                  >
                    {childPanelHeader.actions.buttonTitle}
                  </Button>
                </Grid>
              </Grid>
            </ExpansionPanelSummary>

            {_.isArray(childTableData) &&
              childTableData.map((tableData, index) => {
                return (
                  <div
                    className={classes.classtimeFormOuter}
                    style={{ margin: "9px" }}
                  >
                    <div className={classes.classtimeFormOuter}>
                      <div className={classes.classtypeForm}>
                        <Grid
                          container
                          className={classes.classtypeInputContainer}
                        >
                          <ExpansionPanel style={{ width: "100%" }}>
                            <ExpansionPanelSummary
                              classes={{ content: "block" }}
                              expandIcon={<ExpandMoreIcon />}
                            >
                              <div style={{ float: "right" }}>
                                <Button
                                  onClick={() =>
                                    this.setState({
                                      showForm: true,
                                      formData: tableData
                                    })
                                  }
                                  color="accent"
                                  raised
                                  dense
                                >
                                  <Edit style={{ marginRight: 2 }} />
                                  {childTable.actions.edit.title}
                                </Button>
                              </div>
                              {tableData.scheduleType == "oneTime" &&
                                tableData.name + ": One Time"}
                              {tableData.scheduleType == "OnGoing" &&
                                tableData.name + ": Ongoing"}
                              {tableData.scheduleType == "recurring" &&
                                tableData.name + ": Recurring"}
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{ flexWrap: "wrap" }}>
                              {childTable &&
                                childTable.tableFields.map((field, index) => {
                                  return (
                                    <Fragment key={index}>
                                      <Grid
                                        item
                                        xs={12}
                                        sm={field.labelSm ? field.labelSm : 3}
                                        md={field.lableMd ? field.lableMd : 3}
                                      >
                                        <div style={{ height: "20px" }}>
                                          {" "}
                                          {field.label}{" "}
                                        </div>
                                      </Grid>
                                      <Grid
                                        item
                                        xs={12}
                                        sm={field.valueSm ? field.valueSm : 9}
                                        md={field.valueMd ? field.valueMd : 9}
                                      >
                                        {field.nestedObjectOfArray ? (
                                          tableData[field.key] &&
                                          Object.keys(tableData[field.key]).map(
                                            (itemkey, index) => {
                                              const itemData =
                                                tableData[field.key][itemkey];
                                              let fields = [
                                                {
                                                  label: "Start Time",
                                                  key: "startTime"
                                                },
                                                {
                                                  label: "Duration",
                                                  key: "duration"
                                                },
                                                { label: "Room", key: "roomId" }
                                              ];
                                              if (itemkey === "oneTime") {
                                                fields.unshift({
                                                  label: "Date",
                                                  key: "startDate"
                                                });
                                              } else {
                                                fields.unshift({
                                                  label: "Day",
                                                  value: itemkey
                                                });
                                              }
                                              return this.renderScheduleTypeData(
                                                classes,
                                                parentData,
                                                itemData,
                                                fields
                                              );
                                            }
                                          )
                                        ) : (
                                          <div
                                            style={{
                                              minHeight: 31,
                                              marginTop: 5
                                            }}
                                            className={classes.inputDisableBox}
                                          >
                                            <span>{tableData[field.key]}</span>
                                          </div>
                                        )}
                                      </Grid>
                                    </Fragment>
                                  );
                                })}
                            </ExpansionPanelDetails>
                          </ExpansionPanel>
                        </Grid>
                      </div>
                    </div>
                  </div>
                );
              })}
          </ExpansionPanel>
        </div>
      ) : (
        <div className="panel-child-table">
          {(this.state.showForm ||
            (this.props &&
              this.props.MainTableHandleSubmit &&
              this.props.MainTableHandleSubmit[
                this.props && this.props.parentKey
              ])) && (
            <FormComponent
              schoolId={schoolId}
              parentKey={parentKey}
              parentData={parentData}
              data={this.state.formData}
              open={
                this.state.showForm ||
                (this.props.MainTableHandleSubmit &&
                  this.props.MainTableHandleSubmit[
                    this.props && this.props.parentKey
                  ])
              }
              onClose={this.handleFormModal}
              moveToNextTab={this.props.moveToNextTab}
            />
          )}
          {this.state.deleteConfirmationModal && (
            <SkillShapeDialogBox
              open={this.state.deleteConfirmationModal}
              type="alert"
              defaultButtons
              title="Are you sure?"
              content={childTable.actions.del.dialogBoxContent}
              cancelBtnText="Cancel"
              onAffirmationButtonClick={this.handleDeleteData}
              onModalClose={this.closeDeleteConfirmationModal}
              onCloseButtonClick={this.closeDeleteConfirmationModal}
            />
          )}

          <ExpansionPanel expanded={true}>
            <ExpansionPanelSummary className={classes.classtimeHeader}>
              <Grid container>
                <Grid
                  item
                  lg={9}
                  sm={9}
                  xs={12}
                  style={{
                    color: "#fff",
                    display: "inline-flex",
                    alignItems: "center"
                  }}
                >
                  <span>
                    <Icon className="material-icons" style={{ marginRight: 5 }}>
                      {childPanelHeader.leftIcon}
                    </Icon>
                  </span>
                  <span>{childPanelHeader.notes}</span>
                </Grid>
                <Grid item lg={1} sm={3} xs={12}>
                  <Button
                    className={classes.headerBtn}
                    onClick={() =>
                      this.setState({ showForm: true, formData: null })
                    }
                  >
                    {childPanelHeader.actions.buttonTitle}
                  </Button>
                </Grid>
              </Grid>
            </ExpansionPanelSummary>
            {_.isArray(childTableData) &&
              childTableData.map((tableData, index) => {
                return (
                  <ExpansionPanelDetails
                    key={index}
                    className={classes.details}
                    style={{
                      boxShadow: "0px 0px 0px 3px #bdbdbd",
                      border: "0px solid #bdbdbd"
                    }}
                  >
                    <div className={classes.classtimeFormOuter}>
                      <div className={classes.classtypeForm}>
                        <Grid
                          container
                          className={classes.classtypeInputContainer}
                        >
                          {childTable &&
                            childTable.tableFields.map((field, index) => {
                              return (
                                <Fragment key={index}>
                                  <Grid
                                    item
                                    xs={12}
                                    sm={field.labelSm ? field.labelSm : 3}
                                    md={field.lableMd ? field.lableMd : 3}
                                  >
                                    <div> {field.label} </div>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={12}
                                    sm={field.valueSm ? field.valueSm : 9}
                                    md={field.valueMd ? field.valueMd : 9}
                                  >
                                    {field.nestedObjectOfArray ? (
                                      tableData[field.key] &&
                                      Object.keys(tableData[field.key]).map(
                                        (itemkey, index) => {
                                          const itemData =
                                            tableData[field.key][itemkey];
                                          let fields = [
                                            {
                                              label: "Start Time",
                                              key: "startTime"
                                            },
                                            {
                                              label: "Duration",
                                              key: "duration"
                                            },
                                            { label: "Room", key: "roomId" }
                                          ];
                                          if (itemkey === "oneTime") {
                                            fields.unshift({
                                              label: "Date",
                                              key: "startDate"
                                            });
                                          } else {
                                            fields.unshift({
                                              label: "Day",
                                              value: itemkey
                                            });
                                          }
                                          return this.renderScheduleTypeData(
                                            classes,
                                            parentData,
                                            itemData,
                                            fields
                                          );
                                        }
                                      )
                                    ) : (
                                      <div
                                        style={{
                                          minHeight: 31,
                                          marginTop: 5
                                        }}
                                        className={classes.inputDisableBox}
                                      >
                                        <span>{tableData[field.key]}</span>
                                      </div>
                                    )}
                                  </Grid>
                                </Fragment>
                              );
                            })}
                        </Grid>
                        {/*<div style={{ float: "right", margin: 10 }}>
                          <Button
                            onClick={() =>
                              this.setState({
                                showForm: true,
                                formData: tableData
                              })
                            }
                            color="accent"
                            raised
                            dense
                          >
                            <Edit style={{ marginRight: 2 }} />
                            {childTable.actions.edit.title}
                          </Button>

                          <Button
                            onClick={() => {
                              this.setState(state => {
                                return {
                                  ...state,
                                  formData: tableData
                                };
                              });
                              this.showDeleteConfirmationModal();
                            }}
                            color="accent"
                            raised
                            dense
                          >
                            <Delete style={{ marginRight: 2 }} />
                            {childTable.actions.del.title}
                          </Button>
                        </div> */}

                        <ButtonsWrapper>
                          <ButtonWrapper>
                            <Button
                              onClick={() => {
                                this.setState(state => {
                                  return {
                                    ...state,
                                    formData: tableData
                                  };
                                });
                                this.showDeleteConfirmationModal();
                              }}
                              color="accent"
                              raised
                              dense
                            >
                              <Delete style={{ marginRight: 2 }} />
                              {childTable.actions.del.title}
                            </Button>
                          </ButtonWrapper>

                          <ButtonWrapper>
                            <Button
                              onClick={() =>
                                this.setState({
                                  showForm: true,
                                  formData: tableData
                                })
                              }
                              color="accent"
                              raised
                              dense
                            >
                              <Edit style={{ marginRight: 2 }} />
                              {childTable.actions.edit.title}
                            </Button>
                          </ButtonWrapper>
                        </ButtonsWrapper>
                      </div>
                    </div>
                  </ExpansionPanelDetails>
                );
              })}
          </ExpansionPanel>
        </div>
      )}
    </div>
  );
}
