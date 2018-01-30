import React from 'react';
import moment from 'moment';
import { get } from 'lodash';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import ChildTableRender from './childTableRender';

const styles = theme => {
    // console.log("theme", theme);
    return {
        input: {
            display: 'none',
        },
        classtimeHeader: {
            backgroundColor: theme.palette.grey[400],
            padding: theme.spacing.unit,
            paddingLeft: theme.spacing.unit * 2,
            color: "#fff"
        },
        headerBtn: {
            color: "#fff",
            fontSize: 13,
            border: "solid 1px #fff",
            whiteSpace: "nowrap"
        },
        headerText: {
            color: "#fff",
        },
        classtimeFormOuter: {
            // backgroundColor: theme.palette.secondary[500],
            borderRadius: 5,
            width: '100%'
        },
        classtimeFormContainer: {
            backgroundColor: "#fff",
            padding: theme.spacing.unit,
            borderRadius: 5,
            marginBottom: 12
        },
        inputDisableBox: {
            textAlign: 'left',
            border: '1px solid #ccc',
            boxShadow: 'inset 0 1px 1px rgba(0,0,0,.075)',
            marginRight: 6,
            padding: theme.spacing.unit,
            borderRadius: 2,
            backgroundColor: "#fff",
            minHeight: 15,
        },
        classtypeInputContainer: {
            alignItems: 'center',
            textAlign: 'left'
        },
        childTableSubData: {
            marginBottom: theme.spacing.unit,
            backgroundColor: theme.palette.grey[100],
            borderRadius: 5,
            padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 4}px`
        },
        details: {
            margin: 5,
            border: '2px solid #bdbdbd',
            boxShadow: '5px 5px 5px 1px #bdbdbd'
        }
    }
}

class ChildTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            expanded: false,
            value: '',
            showForm: false,
            classTimeModalOpen: false
        }
    }

    handleFormModal = ()=> this.setState({showForm: false, formData: null})

    handleChange = (event, value) => {
        if (value == 0) {
          this.uploadInput.click();
        }
        this.setState({ value });
    }

    handleExpandClick = () => {
        this.setState({ expanded: !this.state.expanded });
    }

    handleClose = () => {
        this.setState({
          open: false,
        });
    }

    handleClick = () => {
        this.setState({
          open: true,
        });
    }

    classTimeModalHandleClose = () => {
        this.setState({
          classTimeModalOpen: false,
        });
    }

    handleAddClassTime = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({
          classTimeModalOpen: true,
        })
    }

    getRoomName = (roomId, data) => {
        const roomData = get(data, "selectedLocation.rooms", null);
        if(roomData) {
            for(let obj of roomData) {
                if(obj.id === roomId) {
                    return obj.name;
                }
            }
        }
        return
    }

    renderScheduleTypeData = (classes, parentData, itemData, field) => {
        if(_.isArray(itemData)) {
            return itemData.map((x, index) => {
                return (
                    <div key={index} className={classes.childTableSubData}>
                        <Grid className={classes.classtypeInputContainer} container>
                            <Grid  item xs={12} sm={3} md={2}>
                                <div>{field[0].label}</div>
                            </Grid>
                            <Grid  item xs={12} sm={9} md={4}>
                                <div className={classes.inputDisableBox}>
                                    <span>
                                        {
                                            field[0].value ? field[0].value
                                            : (x[field[0]["key"]] && moment(new Date(x[field[0]["key"]])).format('L'))
                                        }
                                    </span>
                                </div>
                            </Grid>
                            <Grid  item xs={12} sm={3} md={2}>
                                <div>{field[1].label}</div>
                            </Grid>
                            <Grid  item xs={12} sm={9} md={4}>
                                <div className={classes.inputDisableBox}>
                                    <span>{x[field[1]["key"]] && moment(new Date(x[field[1]["key"]])).format('LT')}</span>
                                </div>
                            </Grid>
                        </Grid>

                        <Grid className={classes.classtypeInputContainer} container>
                            <Grid  item xs={12} sm={3} md={2}>
                                <div>{field[2].label}</div>
                            </Grid>
                            <Grid  item xs={12} sm={9} md={4}>
                                <div className={classes.inputDisableBox}>
                                    <span>{x[field[2]["key"]]}</span>
                                </div>
                            </Grid>
                            <Grid  item xs={12} sm={3} md={2}>
                                <div>{field[3].label}</div>
                            </Grid>
                            <Grid  item xs={12} sm={9} md={4}>
                                <div className={classes.inputDisableBox}>
                                    <span>{ x[field[3]["key"]] && this.getRoomName(x[field[3]["key"]], parentData)}</span>
                                </div>
                            </Grid>
                        </Grid>

                    </div>
                )
            })
        }
    }

    render() {
        return ChildTableRender.call(this, this.props, this.state)
    }
}

ChildTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChildTable);