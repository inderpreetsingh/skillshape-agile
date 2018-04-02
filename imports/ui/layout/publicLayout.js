import React from 'react';
import styled from 'styled-components';
import {isEmpty, get} from 'lodash';
import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";

import Footer from '/imports/ui/components/landing/components/footer/index.jsx';
import BrandBar from '/imports/ui/components/landing/components/BrandBar.jsx';
import ContactUsFloatingButton from '/imports/ui/components/landing/components/buttons/ContactUsFloatingButton.jsx';
import ContactUsBar from '/imports/ui/components/landing/components/ContactUsBar.jsx';
import TopSearchBar from '/imports/ui/components/landing/components/TopSearchBar.jsx';
import { withStyles, material_ui_next_theme } from '/imports/util';
import SetPasswordDialogBox from '/imports/ui/components/landing/components/dialogs/SetPasswordDialogBox';
import { browserHistory } from 'react-router';

// const theme = createMuiTheme({...material_ui_next_theme});

import muiTheme from '/imports/ui/components/landing/components/jss/muitheme.jsx';

const styles = theme => ({
    wrapper : {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        backgroundColor: theme.palette.background.default,
        // paddingTop: theme.spacing.unit*10 - theme.spacing.unit/2,
    }
});


class PublicLayout extends React.Component {

    constructor( props ) {
        super( props );
        this.state = {
            showSetPasswordDialogBox: false,
            isBusy: false,
        }
    }

    getMainPanelRef() {
        return this.mainPanelRef
    }

    componentWillReceiveProps(nextProps) {
        // console.log("PublicLayout nextProps -->>",nextProps);
        if(nextProps.currentUser) {
          const passwordSetByUser = get(nextProps, "currentUser.profile.passwordSetByUser", true);
          this.setState({
            showSetPasswordDialogBox: !passwordSetByUser
          })
        }
    }

    setPasswordDialogBoxSubmit = (payload, event) => {
        event.preventDefault();
        let errorMessage;
        const { token } = this.props.params;
        const { password, confirmPassword } = payload;

        if(!password || !confirmPassword) {
            errorMessage = "Please enter a password";
        } else {
            if(password !== confirmPassword) {
                errorMessage = "password not match!!!";
            } else {
                this.setState({ isBusy : true })
                Meteor.call("user.setPassword",{password}, (err,res) => {
                    if (err) {
                        errorMessage = err.reason || err.message
                        this.setState({ isBusy : false })
                    } else {
                        this.setState({ showSetPasswordDialogBox : false, isBusy : false }, ()=> {
                            Events.trigger("loginAsSchoolAdmin");
                        })
                    }
                });
            }
        }

        if(errorMessage) {
            this.setState({ errorMessage : errorMessage })
        }
    }

    render( ) {
        // console.log("PublicLayout  props -->>",this.props);
        // console.log("PublicLayout  state -->>",this.state);
        const { currentUser, classes, isUserSubsReady} = this.props;
        let className = {
            mainClass: "wrapper perfectScroll main_wrapper",
            contentClass: "content",
            id: "UserMainPanel",
        }

        if(currentUser) {
            className.mainClass = "main-panel";
            className.contentClass = "content no-padding";
            className.id = "UserMainPanel";
        }

        console.info(currentUser, isUserSubsReady,"---------- main layout ----------");

        return (
          <MuiThemeProvider theme={muiTheme}>
            <div className={`${className.mainClass} ${classes.wrapper}`} id={className.id}>
                {/*<BrandBar {...this.props}/>*/}
                <div>
                  <TopSearchBar {...this.props} />
                </div>

                <SetPasswordDialogBox
                    open={this.state.showSetPasswordDialogBox}
                    onModalClose={() => this.setState({showSetPasswordDialogBox: false})}
                    onCompleteButtonClick={this.setPasswordDialogBoxSubmit}
                    errorText={this.state.errorMessage}
                    isLoading={this.state.isBusy}
                />
                <div style={{flex: 1}} ref={(ref)=> {this.mainPanelRef = ref}}>
                    <main className={classes.content}>
                        {React.cloneElement(this.props.children, { currentUser: currentUser, isUserSubsReady: isUserSubsReady })}
                    </main>
                </div>
              <Footer />
            </div>
          </MuiThemeProvider>
        )
    }
}

export default withStyles(styles)(PublicLayout);
