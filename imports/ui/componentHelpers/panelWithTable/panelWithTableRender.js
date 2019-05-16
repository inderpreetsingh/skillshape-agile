import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import Button from 'material-ui/Button';
// import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import Chip from 'material-ui/Chip';
import ExpansionPanel, { ExpansionPanelDetails, ExpansionPanelSummary } from 'material-ui/ExpansionPanel';
import Grid from 'material-ui/Grid';
import Icon from 'material-ui/Icon';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import ChildTable from './childTable';
import MapComponent from './mapComponent';
import MediaUpload from '/imports/ui/componentHelpers/mediaUpload';
import FormGhostButton from '/imports/ui/components/landing/components/buttons/FormGhostButton.jsx';
import SkillShapeDialogBox from '/imports/ui/components/landing/components/dialogs/SkillShapeDialogBox.jsx';
import { rhythmDiv, tablet } from '/imports/ui/components/landing/components/jss/helpers.js';
import { ContainerLoader } from '/imports/ui/loading/container.js';

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;

  @media screen and (max-width: ${tablet - 100}px) {
    flex-direction: column;
    justify-content: center;
  }
`;

const ButtonWrapper = styled.div`
  margin-top: ${rhythmDiv * 2}px;
  margin-right: ${rhythmDiv * 2}px;
  // ${props => (props.left ? `margin-right: ${rhythmDiv * 2}px;` : '')};
`;

export default function () {
  const {
    classes,
    className,
    settings,
    mainTableData,
    schoolId,
    fullScreen,
  } = this.props;
  const FormComponent = settings.mainPanelHeader.actions.component;
  // const EditForm = settings.mainTable.actions.edit.component;

  // console.log("Panel with table props -->>",this.state);
  const { currentTableData } = this.state;
  // console.log("Panel with table -->>",this);
  return (
    <div className={`${className} panel-table`}>
      {this.state.isBusy && <ContainerLoader />}
      {/* this.state.showConfirmationModal && (
        <ConfirmationModal
          open={this.state.showConfirmationModal}
          submitBtnLabel="Yes"
          cancelBtnLabel="Cancel"
          message="This will email all attending and interested students of the time change. Are you sure?"
          onSubmit={() => {
            this.handleExpansionPanelRightBtn(currentTableData);
          }}
          onClose={this.cancelConfirmationModal}
        />
      ) */}
      {this.state.showConfirmationModal && (
        <SkillShapeDialogBox
          open={this.state.showConfirmationModal}
          type="alert"
          defaultButtons
          title="Are you sure?"
          content="This will email all attending and interested students of the time change. Are you sure?"
          cancelBtnText="Cancel"
          onAffirmationButtonClick={() => {
            this.handleExpansionPanelRightBtn(currentTableData);
          }}
          onModalClose={this.cancelConfirmationModal}
          onCloseButtonClick={this.cancelConfirmationModal}
        />
      )}
      {this.state.deleteConfirmationModal && (
        <SkillShapeDialogBox
          open={this.state.deleteConfirmationModal}
          type="alert"
          defaultButtons
          title="Are you sure?"
          content={
            settings.mainTable.actions.del.dialogBoxContent
            || 'This will delete your data, are you sure?'
          }
          cancelBtnText="Cancel"
          onAffirmationButtonClick={this.handleDeleteData}
          onModalClose={this.closeDeleteConfirmationModal}
          onCloseButtonClick={this.closeDeleteConfirmationModal}
        />
      )}
      {this.state.showForm && (
        <FormComponent
          schoolId={schoolId}
          data={this.state.formData}
          open={this.state.showForm}
          onClose={this.handleFormModal}
          enableParentPanelToDefaultOpen={this.enableParentPanelToDefaultOpen}
          settings={settings}
          {...this.props}
        />
      )}

      <Paper elevation={1}>
        <Grid container className={classes.classtypeHeader}>
          <Grid
            style={{ display: 'inline-flex', alignItems: 'center', padding: 0 }}
            item
            md={2}
            sm={3}
            xs={12}
          >
            <div style={{ display: 'inline-flex' }}>
              <Icon
                className="material-icons"
                style={{ marginRight: 5, lineHeight: '45px' }}
              >
                {settings.mainPanelHeader.leftIcon}
              </Icon>
              <Typography
                style={{ lineHeight: '45px' }}
                className={classes.headerText}
              >
                {settings.mainPanelHeader.title || 'teeeeeee'}
              </Typography>
            </div>
          </Grid>
          <Grid style={{ margin: '10px 0' }} item sm={6} md={8} xs={12}>
            <Typography className={classes.headerText} type="caption">
              {settings.mainPanelHeader.notes || ''}
            </Typography>
          </Grid>
          <Grid
            style={{ display: 'inline-flex', alignItems: 'center' }}
            item
            sm={3}
            md={2}
            xs={12}
          >
            <Button
              className={classes.headerBtn}
              onClick={() => this.setState({ showForm: true, formData: null })}
            >
              {settings.mainPanelHeader.actions.buttonTitle}
            </Button>

          </Grid>
        </Grid>
      </Paper>
      <div className={classes.expansionPanelContainer}>
        {_.isArray(mainTableData)
          && mainTableData.map((tableData, index) => {
            // console.log("tableData -->>",tableData);
            const childTableData = this.props.getChildTableData
              && this.props.getChildTableData(tableData);
            // console.log("childTableData -->>",childTableData);
            return (
              <ExpansionPanel
                className={classes.expansionPanel}
                key={index}
                defaultExpanded={
                  index == 0
                  || this.state.expansionPanelDefaultOpen
                  || (this.state.showClassTimeFormModal
                    && this.state.showClassTimeFormModal[tableData._id])
                }
              >
                <ExpansionPanelSummary
                  style={{ boxShadow: '0 1px 0 rgba(0,0,0,.1)' }}
                  expandIcon={<ExpandMoreIcon />}
                >
                  <div style={{ marginLeft: 15 }}>
                    <Typography className={classes.secondaryHeading}>
                      {this.getExpansionPanelTitle(
                        tableData,
                        settings.mainPanelHeader.titleKey,
                      )}
                    </Typography>
                  </div>
                </ExpansionPanelSummary>
                {settings.mainPanelHeader.expansionPanelRightBtnTitle && (
                  <Fragment>
                    <div className={classes.notifyExplanation}>
                      <Typography type="caption">
                        Pressing this button will inform students who are
                        enrolled or interested in this class of any schedule
                        changes. Please do not abuse this button.
                      </Typography>
                      <Button
                        onClick={() => this.handleNotifyClassTypeUpdate(
                          tableData,
                          'classType.notifyToStudentForClassTimes',
                        )
                        }
                        color="accent"
                        raised
                        dense
                      >
                        Notify Students of Time Change
                      </Button>
                    </div>
                    <div className={classes.notifyExplanation}>
                      <Typography type="caption">
                        Pressing this button will inform students who are
                        enrolled or interested in this class of any location
                        changes. Please do not abuse this button.
                      </Typography>
                      <Button
                        onClick={() => this.handleNotifyClassTypeUpdate(
                          tableData,
                          'classType.notifyToStudentForLocation',
                        )
                        }
                        color="accent"
                        raised
                        dense
                      >
                        Notify Students of Location Change
                      </Button>
                    </div>
                  </Fragment>
                )}

                <ExpansionPanelDetails className={classes.details}>
                  <Grid container>
                    <Grid
                      item
                      md={
                        settings.mainPanelHeader.showImageUpload
                          || settings.mainPanelHeader.showAddressOnMap
                          ? 8
                          : 12
                      }
                      sm={
                        settings.mainPanelHeader.showImageUpload
                          || settings.mainPanelHeader.showAddressOnMap
                          ? 6
                          : 12
                      }
                      xs={12}
                    >
                      <div className={classes.classtypeForm}>
                        <Grid
                          container
                          className={classes.classtypeInputContainer}
                        >
                          {settings.mainTable
                            && settings.mainTable.tableFields.map(
                              (field, index) =>
                                // console.log("test1 Name -->>",test1);
                                (
                                  <Fragment key={index}>
                                    <Grid
                                      item
                                      xs={12}
                                      sm={field.labelSm ? field.labelSm : 12}
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
                                      sm={field.valueSm ? field.valueSm : 12}
                                      md={field.valueMd ? field.valueMd : 9}
                                    >
                                      <div
                                        style={{
                                          minHeight: 31,
                                          marginTop: 5,
                                        }}
                                        className={classes.inputDisableBox}
                                      >
                                        {field.chipInput ? (
                                          <div
                                            style={{
                                              display: 'inline-flex',
                                              flexWrap: 'wrap',
                                            }}
                                          >
                                            {tableData[field.key]
                                              && tableData[field.key].map(
                                                (chipData, index) => (
                                                  <Chip
                                                    key={index}
                                                    style={{ marginRight: 5 }}
                                                    label={
                                                        chipData[field.childKey]
                                                      }
                                                    className={classes.chip}
                                                  />
                                                ),
                                              )}
                                          </div>
                                        ) : (
                                          <span>
                                            {this.displayFieldValue(
                                              field,
                                              tableData,
                                            )}
                                          </span>
                                        )}
                                      </div>
                                    </Grid>
                                  </Fragment>
                                )
                              ,
                            )}
                        </Grid>
                        <ButtonsWrapper>
                          {settings.mainTable.actions.del && (
                            <ButtonWrapper left>
                              {/* <Button
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
                                {settings.mainTable.actions.del.title}
                              </Button> */}
                              <FormGhostButton
                                alertColor
                                onClick={() => {
                                  this.setState(state => ({
                                    ...state,
                                    formData: tableData,
                                  }));
                                  this.showDeleteConfirmationModal();
                                }}
                                label={settings.mainTable.actions.del.title}

                              />
                            </ButtonWrapper>
                          )}
                          <ButtonWrapper right>
                            {/* <Button
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
                              {settings.mainTable.actions.edit.title}
                            </Button> */}
                            <FormGhostButton
                              onClick={() => this.setState({
                                showForm: true,
                                formData: tableData,
                              })
                              }
                              label={settings.mainTable.actions.edit.title}

                            />
                          </ButtonWrapper>
                        </ButtonsWrapper>
                      </div>
                    </Grid>
                    {settings.mainPanelHeader.showAddressOnMap && (
                      <Grid
                        className={classes.classtypeInputContainer}
                        item
                        md={4}
                        sm={6}
                        xs={12}
                      >
                        <MapComponent mapData={tableData} />
                      </Grid>
                    )}
                    {settings.mainPanelHeader.showImageUpload && (
                      <Grid
                        className={classes.classtypeInputContainer}
                        item
                        md={4}
                        sm={6}
                        xs={12}
                      >
                        <MediaUpload
                          fullScreen={fullScreen}
                          width={300}
                          onChange={this.props.handleImageChange}
                          data={
                            tableData && {
                              file: tableData.classTypeImg,
                              isUrl: true,
                            }
                          }
                          showVideoOption={false}
                        />

                        {/* <Button
                          onClick={() =>
                            this.props.handleImageSave(
                              tableData.schoolId,
                              tableData._id
                            )
                          }
                          color="accent"
                          style={{ width: 300 }}
                          dense
                          raised
                        >
                          Save
                        </Button> */}
                        <div style={{ marginLeft: '28%' }}>
                          <FormGhostButton
                            onClick={() => this.props.handleImageSave(
                              tableData.schoolId,
                              tableData._id,
                            )
                          }
                            label="Save"
                          />
                        </div>
                      </Grid>
                    )}
                    {(settings.childTable
                      || this.state.MainTableHandleSubmit) && (
                        <Grid
                          className={classes.classtypeInputContainer}
                          item
                          md={8}
                          sm={12}
                          xs={12}
                        >
                          <ChildTable
                            schoolId={schoolId}
                            childPanelHeader={settings.childPanelHeader}
                            childTable={settings.childTable}
                            childTableData={childTableData}
                            parentKey={tableData._id}
                            showClassTimeFormModal={
                              this.state.showClassTimeFormModal
                              && this.state.showClassTimeFormModal[tableData._id]
                            }
                            parentData={tableData}
                            updateParentProps={this.updateParentProps}
                            handleMainTableState={this.handleMainTableState}
                            MainTableHandleSubmit={
                              this.state.MainTableHandleSubmit
                            }
                            moveToNextTab={this.props.moveToNextTab}
                            locationData={this.props.locationData}
                            isSaved={this.props.isSaved}
                            handleIsSavedState={this.props.handleIsSavedState}
                          />
                        </Grid>
                    )}
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            );
          })}

        {settings.childTable.title == 'Class Times' && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              onClick={() => {
                this.props.moveToPreviousTab();
              }}
              color="accent"
              raised
              dense
            >
              Back To Location Details
            </Button>
            <Button
              onClick={() => {
                this.props.moveToNextTab();
              }}
              color="accent"
              raised
              dense
            >
              Continue To prices
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
