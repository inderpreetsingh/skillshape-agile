import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '/imports/util';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';;
import Icon from 'material-ui/Icon';
import Typography from 'material-ui/Typography';

const styles = theme => {
    return {
       headerContainer: {
        marginBottom: theme.spacing.unit + theme.spacing.unit/2
       },
       classtypeHeader: {
            backgroundColor: theme.palette.primary[500],
            padding: "0 20px",
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
    }
}

class PanelHeader extends Component {

    render() {
    const {classes, settings, onAddButtonClicked, title, btnText, cpation, icon } = this.props;
        return <Paper elevation={1} className={classes.headerContainer}>
                <Grid container className={classes.classtypeHeader}>
                    <Grid  style={{display: 'inline-flex',alignItems: 'center', padding: 0}} item md={2} sm={3} xs={12}>
                        <div style={{display: 'inline-flex'}} >
                            <Icon className="material-icons" style={{marginRight: 5, lineHeight: "45px"}}>{icon}</Icon>
                            <Typography style={{lineHeight: "45px"}} className={classes.headerText} >{title}</Typography>
                        </div>
                    </Grid>
                    <Grid style={{margin: '10px 0'}} item sm={6} md={8} xs={12}>
                        <Typography className={classes.headerText} type="caption" >
                            {cpation}
                        </Typography>
                    </Grid>
                    {btnText && <Grid  style={{display: 'inline-flex',alignItems: 'center'}} item sm={3} md={2} xs={12}>
                        <Button className={classes.headerBtn} onClick={onAddButtonClicked}>
                            {btnText}
                        </Button>
                    </Grid>}
                </Grid>
            </Paper>
    }
}

export default withStyles(styles)(PanelHeader);