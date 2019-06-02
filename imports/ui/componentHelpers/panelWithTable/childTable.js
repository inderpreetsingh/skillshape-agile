import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import ChildTableRender from './childTableRender';
import { withPopUp } from '/imports/util';

const styles = theme => ({
  input: {
    display: 'none',
  },
  classtimeHeader: {
    backgroundColor: theme.palette.grey[400],
    padding: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 2,
    color: '#fff',
  },
  headerBtn: {
    color: 'black',
    fontSize: 13,
    border: 'solid 1px #fff',
    whiteSpace: 'nowrap',
  },
  headerText: {
    color: '#fff',
  },
  classtimeFormOuter: {
    // backgroundColor: theme.palette.secondary[500],
    borderRadius: 5,
    width: '100%',
  },
  classtimeFormContainer: {
    backgroundColor: '#fff',
    padding: theme.spacing.unit,
    borderRadius: 5,
    marginBottom: 12,
  },
  inputDisableBox: {
    textAlign: 'left',
    border: '1px solid #ccc',
    boxShadow: 'inset 0 1px 1px rgba(0,0,0,.075)',
    marginRight: 6,
    padding: theme.spacing.unit,
    borderRadius: 2,
    backgroundColor: '#fff',
    minHeight: 15,
  },
  classtypeInputContainer: {
    alignItems: 'center',
    textAlign: 'left',
  },
  childTableSubData: {
    marginBottom: theme.spacing.unit,
    backgroundColor: theme.palette.grey[100],
    borderRadius: 5,

    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 4}px`,
  },
  details: {
    margin: 5,
    border: '2px solid #bdbdbd',
    boxShadow: '5px 5px 5px 1px #bdbdbd',
  },
});

class ChildTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      expanded: false,
      value: '',
      showForm: props.showClassTimeFormModal,
      classTimeModalOpen: false,
    };
  }

  handleFormModal = (value) => {
    if (!value) {
      this.props.handleMainTableState(this.props.parentKey);
      this.setState({ showForm: false, formData: null });
    } else {
      this.handleFormModal();
      this.setState({ showForm: true, formData: null });
    }
  };

  handleChange = (event, value) => {
    if (value == 0) {
      this.uploadInput.click();
    }
    this.setState({ value });
  };

  handleExpandClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  handleClick = () => {
    this.setState({
      open: true,
    });
  };

  classTimeModalHandleClose = () => {
    this.setState({
      classTimeModalOpen: false,
    });
  };

  showDeleteConfirmationModal = () => {
    this.setState(state => ({
      ...state,
      deleteConfirmationModal: true,
    }));
  };

  closeDeleteConfirmationModal = () => {
    this.setState(state => ({
      ...state,
      deleteConfirmationModal: false,
    }));
  };

  handleDeleteData = () => {
    const { formData } = this.state;
    const { parentKey, childTable, popUp } = this.props;
    const methodToCall = childTable.actions.del.onSubmit;

    // NOTE: we are only covering case for location.roomRemove
    // need to somehow cover it for other panel methods as well.
    Meteor.call(methodToCall, { locationId: parentKey, data: formData }, (err, res) => {
      this.closeDeleteConfirmationModal();
      if (err) {
        popUp.appear('alert', { content: err.reason || err.message });
      } else {
        popUp.appear('success', { title: 'success', content: res.message });
      }
    });
  };

  handleAddClassTime = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({
      classTimeModalOpen: true,
    });
  };

  getRoomName = (roomId, data) => {
    let roomName = 'Not Selected';
    data.map((current) => {
      current.rooms
        && current.rooms.map((current1) => {
          if (current1.id == roomId) {
            roomName = current1.name;
          }
        });
    });

    return roomName;
  };

  getLocationName = (locationId, data) => {
    let locationName = 'No Location Selected';
    data.map((current, index) => {
      if (current._id == locationId) {
        locationName = `${current.address && current.address} ${current.state
          && current.state} ${current.country && current.country}`;
      }
    });
    return locationName;
  };

  renderScheduleTypeData = (classes, parentData, tableData, field, locationData) => {
    itemData = tableData.scheduleDetails;
    let first = true;
    if (_.isArray(itemData)) {
      return itemData.map((x, index) => (
        <div style={{ marginTop: 5 }} key={index} className={classes.childTableSubData}>
          <Grid className={classes.classtypeInputContainer} container>
            <Grid item xs={12} sm={3} md={2}>
              <div>{field[0].label}</div>
            </Grid>
            <Grid item xs={12} sm={9} md={4}>
              <div className={classes.inputDisableBox}>
                <span>
                  {x.key
                    ? x.key.map((current) => {
                      if (current.label) {
                        const result = `${first ? '' : ', '}${current.label}`;
                        first = false;
                        return result;
                      }
                    })
                    : x.startDate && moment(x.startDate).format('dddd')}
                </span>
              </div>
            </Grid>
            <Grid item xs={12} sm={3} md={2}>
              <div>{field[1].label}</div>
            </Grid>
            <Grid item xs={12} sm={9} md={4}>
              <div className={classes.inputDisableBox}>
                <span>
                  {x[field[1].key] && moment(new Date(x[field[1].key])).format('LT')}
                </span>
              </div>
            </Grid>
          </Grid>

          <Grid className={classes.classtypeInputContainer} container>
            <Grid item xs={12} sm={3} md={2}>
              <div>{field[2].label}</div>
            </Grid>
            <Grid item xs={12} sm={9} md={4}>
              <div
                style={{
                  minHeight: 31,
                  marginTop: 5,
                }}
                className={classes.inputDisableBox}
              >
                <span>{x[field[2].key]}</span>
              </div>
            </Grid>
            <Grid item xs={12} sm={3} md={2}>
              <div>{field[3].label}</div>
            </Grid>
            <Grid item xs={12} sm={9} md={4}>
              <div
                style={{
                  minHeight: 31,
                  marginTop: 5,
                }}
                className={classes.inputDisableBox}
              >
                <span>
                  {tableData.roomId && this.getRoomName(tableData.roomId, locationData)}
                </span>
              </div>
            </Grid>
            <Grid item xs={12} sm={3} md={2}>
              <div>{field[4].label}</div>
            </Grid>
            <Grid item xs={12} sm={9} md={4}>
              <div
                style={{
                  minHeight: 31,
                  marginTop: 5,
                }}
                className={classes.inputDisableBox}
              >
                <span>
                  {tableData.locationId
                      && this.getLocationName(tableData.locationId, locationData)}
                </span>
              </div>
            </Grid>
          </Grid>
        </div>
      ));
    }
  };

  render() {
    return ChildTableRender.call(this, this.props, this.state);
  }
}

ChildTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withPopUp(ChildTable));
