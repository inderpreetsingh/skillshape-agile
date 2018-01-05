import React, { Component } from 'react';

import MuiThemeProvider from '/imports/startup/client/lib/material-ui-old/styles/MuiThemeProvider';
import getMuiTheme from '/imports/startup/client/lib/material-ui-old/styles/getMuiTheme';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from '/imports/startup/client/lib/material-ui-old/Card';
import {RadioButton} from '/imports/startup/client/lib/material-ui-old/RadioButton';
import ActionFavorite from '/imports/startup/client/lib/material-ui-old/svg-icons/action/favorite';
import ActionFavoriteBorder from '/imports/startup/client/lib/material-ui-old/svg-icons/action/favorite-border';
import MoreVertIcon from '/imports/startup/client/lib/material-ui-old/svg-icons/navigation/more-vert';

import IconButton from 'material-ui/IconButton';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withMobileDialog,
} from 'material-ui/Dialog';

import { material_ui_next_theme } from '/imports/util';

const muiTheme = getMuiTheme({

    palette: {
        primary1Color: material_ui_next_theme.palette.primary[500]
    }
});

export class SkillShapeCard extends Component {
    state = {
        showMore: false,
        openDialog: false,
    }
    handleClickOpen = () => {
        this.setState({ openDialog: true });
    }

    handleClose = () => {
        this.setState({ openDialog: false });
    }

    closeDetails = (event)=> {
        console.log("showMore!!!");
        this.setState({showMore: false });
    }
    onMouseOver = (event)=> {
        console.log("showMore!!!");
        this.setState({showMore: true });
    }

    render() {
        const { showMore } = this.state;
        const { fullScreen } = this.props;
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                    <Card onMouseLeave={() => this.closeDetails()} style={{position:'relative',margin: 8}}>
                        <CardMedia>
                           <IconButton style={{position: "absolute", top: 6,textAlign:'center', right: 6, minWidth:"auto", maxWidth: "auto", width: 'auto'}}> <ActionFavorite style={{color:"#D50000",height: 24}}/> </IconButton>

                          <img src="https://s3-us-west-1.amazonaws.com/skillshape/schools/ead8018d-1504-4db3-aa52-908aaad2132a.jpg" alt="" />
                        </CardMedia>
                        <CardTitle title="Class type Name" />
                        <CardText>
                          Acrobatics, Trapeze in Hisar, Haryana
                        </CardText>
                        <CardText>
                            Reviews
                        </CardText>

                        {showMore && <div style={{position: "absolute", top:0, left:20, right: -20,zIndex:1}}>
                            <Card style={{height: "100%"}}>
                                <IconButton style={{float: "right", zIndex: 1}} color="accent" onClick={() => this.closeDetails()} ><Icon className="material-icons">cancel</Icon></IconButton>
                                <CardTitle title="Class Type Name" />
                                <CardText style={{fontSize: 13}}>
                                    Acrobatics, Trapeze in Hisar, Haryana
                                    <div>
                                      <p><b>Age Range:</b> 12-22</p>
                                      <p><b>Skill Level:</b> All</p>
                                      <p><b>Gender:</b> Female</p>
                                    </div>
                                    <div>
                                      <div><b>Class (Type) Description </b></div>
                                      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                    </div>
                                </CardText>
                                <CardActions style={{textAlign: 'center'}}>
                                    <Button style={{marginTop: 5,fontSize:13,padding:8,color: "#fff"}} raised color="primary">
                                        School Details
                                    </Button>
                                    <Button style={{marginTop: 5,fontSize:13,padding:8,color: "#fff"}} raised color="primary">
                                        Class Detials
                                    </Button>
                                    <Button onClick={this.handleClickOpen} style={{marginTop: 5,fontSize:13,padding:8,color: "#fff"}} raised color="accent">
                                        Class Times
                                    </Button>
                                </CardActions>
                            </Card>
                        </div>}

                        <CardActions>
                            <IconButton onMouseOver={() => this.onMouseOver()}><Icon className="material-icons">more_vert</Icon></IconButton>
                        </CardActions>
                    </Card>
                    <Dialog
                      onMouseOver={() => this.onMouseOver()}
                      fullScreen={fullScreen}
                      open={this.state.openDialog}
                      onClose={this.handleClose}
                      aria-labelledby="responsive-dialog-title"
                    >
                      <DialogTitle id="responsive-dialog-title"> Class Times </DialogTitle>
                      <DialogContent>
                            <Card style={{margin: 8}}>
                                <CardText>
                                    <div>
                                      <p><b>M-W-F</b> 6:00PM - 7:30PM</p>
                                      <p><b>OnGoing</b></p>
                                    </div>
                                    <div>
                                      <div><b>Class Description </b></div>
                                      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                    </div>
                                </CardText>
                                <CardActions>
                                    <Button style={{marginTop: 5,color: "#fff"}} raised color="primary">
                                        Add To My Calendar
                                    </Button>
                                </CardActions>
                            </Card>
                            <Card style={{margin: 8}}>
                                <CardText>
                                    <div>
                                      <p><b>M-W-F</b> 6:00PM - 7:30PM</p>
                                      <p><b>OnGoing</b></p>
                                    </div>
                                    <div>
                                      <div><b>Class Description </b></div>
                                      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                    </div>
                                </CardText>
                                <CardActions>
                                    <Button style={{marginTop: 5}} raised color="accent">
                                        Remove From My Calendar
                                    </Button>
                                </CardActions>
                            </Card>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                          Close
                        </Button>
                      </DialogActions>
                    </Dialog>
            </MuiThemeProvider>
        );
    }
}

export default withMobileDialog() (SkillShapeCard);