/* eslint-disable react/no-this-in-sfc */
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import Button from 'material-ui/Button';
import ExpansionPanel, { ExpansionPanelDetails, ExpansionPanelSummary } from 'material-ui/ExpansionPanel';
import Grid from 'material-ui/Grid';
import Icon from 'material-ui/Icon';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import FormGhostButton from '/imports/ui/components/landing/components/buttons/FormGhostButton';
import SkillShapeDialogBox from '/imports/ui/components/landing/components/dialogs/SkillShapeDialogBox';
import { rhythmDiv } from '/imports/ui/components/landing/components/jss/helpers';
import { isArray } from 'lodash';

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

export default function () {
  const {
    classes,
    childPanelHeader,
    childTable,
    childTableData,
    parentKey,
    parentData,
    schoolId,
    locationData,
    isSaved,
    handleIsSavedState,
    MainTableHandleSubmit,
    moveToNextTab,
  } = this.props;
  const { showForm, formData, deleteConfirmationModal } = this.state;
  const FormComponent = childPanelHeader.actions.component;
  return (
    <div>
      {childTable.title === 'Class Times' ? (
        <div className="panel-child-table">
          {(showForm
            || (MainTableHandleSubmit
              && MainTableHandleSubmit[
                parentKey
              ])) && (
              <FormComponent
                schoolId={schoolId}
                parentKey={parentKey}
                parentData={parentData}
                data={formData}
                open={
                  showForm
                  || (MainTableHandleSubmit
                    && MainTableHandleSubmit[
                      parentKey
                    ])
                }
                onClose={this.handleFormModal}
                moveToNextTab={moveToNextTab}
                locationData={locationData}
                isSaved={isSaved}
                handleIsSavedState={handleIsSavedState}
              />
          )}

          <ExpansionPanel expanded>
            <ExpansionPanelSummary className={classes.classtimeHeader}>
              <Grid container>
                <Grid
                  item
                  lg={9}
                  sm={9}
                  xs={12}
                  style={{
                    color: '#fff',
                    display: 'inline-flex',
                    alignItems: 'center',
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
                    onClick={() => this.setState({ showForm: true, formData: null })
                    }
                  >
                    {childPanelHeader.actions.buttonTitle}
                  </Button>

                </Grid>
              </Grid>
            </ExpansionPanelSummary>

            {isArray(childTableData)
              && childTableData.map((tableData, index) => (
                <div
                  key={index.toString()}
                  className={classes.classtimeFormOuter}
                  style={{ margin: '9px' }}
                >
                  <div className={classes.classtimeFormOuter}>
                    <div className={classes.classtypeForm}>
                      <Grid
                        container
                        className={classes.classtypeInputContainer}
                      >
                        <ExpansionPanel style={{ width: '100%' }}>
                          <ExpansionPanelSummary
                            classes={{ content: 'block' }}
                            expandIcon={<ExpandMoreIcon />}
                          >
                            <div style={{ float: 'right' }}>
                              <FormGhostButton

                                onClick={() => this.setState({
                                  showForm: true,
                                  formData: tableData,
                                })
                                  }
                                label={childTable.actions.edit.title}
                              />
                            </div>
                            {tableData.scheduleType === 'oneTime'
                                && `${tableData.name}: Single/Set`}
                            {tableData.scheduleType === 'OnGoing'
                                && `${tableData.name}: Ongoing`}
                            {tableData.scheduleType === 'recurring'
                                && `${tableData.name}: Series`}
                          </ExpansionPanelSummary>
                          <ExpansionPanelDetails style={{ flexWrap: 'wrap' }}>

                            {childTable.tableFields
                                && childTable.tableFields.map((field, index1) => (
                                  <Fragment key={index1.toString}>
                                    <Grid
                                      item
                                      xs={12}
                                      sm={field.labelSm ? field.labelSm : 3}
                                      md={field.lableMd ? field.lableMd : 3}
                                    >
                                      <div style={{ height: '20px' }}>
                                        {' '}
                                        {field.label}
                                        {' '}
                                      </div>
                                    </Grid>
                                    <Grid
                                      item
                                      xs={12}
                                      sm={field.valueSm ? field.valueSm : 9}
                                      md={field.valueMd ? field.valueMd : 9}
                                    >
                                      {field.nestedObjectOfArray ? (
                                        tableData[field.key]
                                          && Object.keys(tableData[field.key]).map(
                                            (itemkey) => {
                                              const fields = [
                                                {
                                                  label: 'Start Time',
                                                  key: 'startTime',
                                                },
                                                {
                                                  label: 'Duration',
                                                  key: 'duration',
                                                },
                                                { label: 'Room', key: 'roomId' },
                                                {
                                                  label: 'Location', Key: 'locationId',
                                                },
                                              ];
                                              if (itemkey === 'oneTime') {
                                                fields.unshift({
                                                  label: 'Date',
                                                  key: 'startDate',
                                                });
                                              } else {
                                                fields.unshift({
                                                  label: 'Day',
                                                  value: itemkey,
                                                });
                                              }
                                              return this.renderScheduleTypeData(
                                                classes,
                                                parentData,
                                                tableData,
                                                fields,
                                                locationData,
                                              );
                                            },
                                          )
                                      ) : (
                                        <div
                                          style={{
                                            minHeight: 31,
                                            marginTop: 5,
                                          }}
                                          className={classes.inputDisableBox}
                                        >
                                          <span>{tableData[field.key]}</span>
                                        </div>
                                      )}
                                    </Grid>
                                  </Fragment>
                                ))}
                          </ExpansionPanelDetails>
                        </ExpansionPanel>
                      </Grid>
                    </div>
                  </div>
                </div>
              ))}
          </ExpansionPanel>
        </div>
      ) : (
        <div className="panel-child-table">
          {(showForm
              || (MainTableHandleSubmit
                && MainTableHandleSubmit[
                  parentKey
                ])) && (
                <FormComponent
                  schoolId={schoolId}
                  parentKey={parentKey}
                  parentData={parentData}
                  data={formData}
                  open={
                    showForm
                    || (MainTableHandleSubmit
                      && MainTableHandleSubmit[
                        parentKey
                      ])
                  }
                  onClose={this.handleFormModal}
                  moveToNextTab={moveToNextTab}
                  isSaved={isSaved}
                  handleIsSavedState={handleIsSavedState}
                />
          )}
          {deleteConfirmationModal && (
          <SkillShapeDialogBox
            open={deleteConfirmationModal}
            type="alert"
            defaultButtons
            title="Are you sure?"
            content={
                  childTable.actions.del.dialogBoxContent
                  || 'This will delete your data, are you sure?'
                }
            cancelBtnText="Cancel"
            onAffirmationButtonClick={this.handleDeleteData}
            onModalClose={this.closeDeleteConfirmationModal}
            onCloseButtonClick={this.closeDeleteConfirmationModal}
          />
          )}

          <ExpansionPanel expanded>
            <ExpansionPanelSummary className={classes.classtimeHeader}>
              <Grid container>
                <Grid
                  item
                  lg={9}
                  sm={9}
                  xs={12}
                  style={{
                    color: '#fff',
                    display: 'inline-flex',
                    alignItems: 'center',
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
                    onClick={() => this.setState({ showForm: true, formData: null })
                      }
                  >
                    {childPanelHeader.actions.buttonTitle}
                  </Button>
                </Grid>
              </Grid>
            </ExpansionPanelSummary>
            {isArray(childTableData)
                && childTableData.map((tableData, index) => (
                  <ExpansionPanelDetails
                    key={index.toString}
                    className={classes.details}
                    style={{
                      boxShadow: '0px 0px 0px 3px #bdbdbd',
                      border: '0px solid #bdbdbd',
                    }}
                  >
                    <div className={classes.classtimeFormOuter}>
                      <div className={classes.classtypeForm}>
                        <Grid
                          container
                          className={classes.classtypeInputContainer}
                        >
                          {childTable.tableFields
                              && childTable.tableFields.map((field, index2) => (
                                <Fragment key={index2.toString}>
                                  <Grid
                                    item
                                    xs={12}
                                    sm={field.labelSm ? field.labelSm : 3}
                                    md={field.lableMd ? field.lableMd : 3}
                                  >
                                    <div>
                                      {' '}
                                      {field.label}
                                      {' '}
                                    </div>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={12}
                                    sm={field.valueSm ? field.valueSm : 9}
                                    md={field.valueMd ? field.valueMd : 9}
                                  >
                                    {field.nestedObjectOfArray ? (
                                      tableData[field.key]
                                        && Object.keys(tableData[field.key]).map(
                                          (itemkey) => {
                                            const itemData = tableData[field.key][itemkey];
                                            const fields = [
                                              {
                                                label: 'Start Time',
                                                key: 'startTime',
                                              },
                                              {
                                                label: 'Duration',
                                                key: 'duration',
                                              },
                                              { label: 'Room', key: 'roomId' },
                                            ];
                                            if (itemkey === 'oneTime') {
                                              fields.unshift({
                                                label: 'Date',
                                                key: 'startDate',
                                              });
                                            } else {
                                              fields.unshift({
                                                label: 'Day',
                                                value: itemkey,
                                              });
                                            }
                                            return this.renderScheduleTypeData(
                                              classes,
                                              parentData,
                                              itemData,
                                              fields,
                                            );
                                          },
                                        )
                                    ) : (
                                      <div
                                        style={{
                                          minHeight: 31,
                                          marginTop: 5,
                                        }}
                                        className={classes.inputDisableBox}
                                      >
                                        <span>{tableData[field.key]}</span>
                                      </div>
                                    )}
                                  </Grid>
                                </Fragment>
                              ))}
                        </Grid>


                        <ButtonsWrapper>
                          <ButtonWrapper>
                            <FormGhostButton
                              alertColor
                              onClick={() => {
                                this.setState(state => ({
                                  ...state,
                                  formData: tableData,
                                }));
                                this.showDeleteConfirmationModal();
                              }}
                              label={childTable.actions.del.title}
                            />
                          </ButtonWrapper>

                          <ButtonWrapper>
                            <FormGhostButton
                              onClick={() => this.setState({
                                showForm: true,
                                formData: tableData,
                              })
                                }
                              label={childTable.actions.edit.title}
                            />
                          </ButtonWrapper>
                        </ButtonsWrapper>
                      </div>
                    </div>
                  </ExpansionPanelDetails>
                ))}
          </ExpansionPanel>
        </div>
      )}
    </div>
  );
}
