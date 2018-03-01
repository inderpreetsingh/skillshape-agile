import React ,{Component} from 'react';
import Typography from 'material-ui/Typography';
import {Fragment} from 'react';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Input from 'material-ui/Input';
import isEmpty from "lodash/isEmpty";

export default function (argument) {
    const { memberInfo } = this.props;
    console.log("this===>",this)
    // body...
    return (
            <Fragment>
              <Grid container className="userInfoPanel" style={{display: 'flex',background: '#ddd'}}>
                <Grid item sm={4} xs={12} md={4}>
                  <div className="avtar">
                    <img src="/images/avatar.jpg"/>
                  </div>
                  <Typography>{ memberInfo.name }</Typography>
                  <Typography>{ memberInfo.phone }</Typography>
                  <Typography>{ memberInfo.email }</Typography>
                </Grid>
                <Grid item sm={4} xs={12} md={4} >
                  <div className="notes">
                    Admin Notes:
                  </div>
                  <Input
                    onBlur={this.props.saveAdminNotesInMembers}
                    value={memberInfo.adminNotes || ""}
                    onChange={this.props.handleInput}
                    fullWidth
                    style={{border: '1px solid',backgroundColor: '#fff'}}
                    multiline
                    rows={4}
                  />
                </Grid>
              </Grid>
              <Grid container style={{backgroundColor: '#ddd'}}>
                <Grid item>
                  <Fragment>
                    <Button raised color="primary" style={{margin: '5px'}}>
                      Call
                    </Button>
                    <Button style={{margin: '5px'}} raised color="accent">
                      Email
                    </Button>
                    <Button raised color="primary" style={{margin: '5px'}}>
                      Edit
                    </Button>
                  </Fragment>
                </Grid>
              </Grid>
            </Fragment>
    )
}