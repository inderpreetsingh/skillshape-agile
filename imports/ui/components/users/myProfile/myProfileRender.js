import React from 'react';
import get from 'lodash/get';
import styled from 'styled-components';
import Card, { CardHeader, CardMedia, CardContent, CardActions } from 'material-ui/Card';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import IconButton from 'material-ui/IconButton';
import classnames from 'classnames';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Input, { InputLabel } from 'material-ui/Input';
import Select from 'material-ui/Select';
import Collapse from 'material-ui/transitions/Collapse';
import { FormControl } from 'material-ui/Form';
import { MenuItem } from 'material-ui/Menu';
import Button from 'material-ui/Button';
import Edit from 'material-ui-icons/Edit';
import { MaterialDatePicker } from '/imports/startup/client/material-ui-date-picker';
import { validateImage } from '/imports/util';
import { Loading } from '/imports/ui/loading';
import config from '/imports/config';
import { ContainerLoader } from '/imports/ui/loading/container';

import MediaUpload from  '/imports/ui/componentHelpers/mediaUpload';
import IconInput from '/imports/ui/components/landing/components/form/IconInput';

const SaveBtnWrapper = styled.div`
    margin: 10px;
    float: right;
`;

const ErrorWrapper = styled.span`
    color: red;
    float: right;
`;

export default function() {
  console.log("My Profile Props -->>>",this.props);
  console.log("My Profile State -->>>",this.state);
	let { currentUser, classes, isUserSubsReady } = this.props;
	let {
		firstName,
		nickame,
		lastName,
		dob,
		phone,
		address,
        email,
        about,
	} = this.state;

	if(!isUserSubsReady)
		return <Loading/>

    if(!currentUser) {
        return  <Typography type="display2" gutterBottom align="center">
            User not found!!!
        </Typography>
    }

    if(this.validateUser()) {
    	return (
            <Grid container>
                { this.state.isBusy && <ContainerLoader/>}
                <Grid item xs={12} sm={8}>
                    <Card className={classes.card}>
                        <CardHeader
                            title="My Profile"
                            action={
                                <IconButton
                                  className={classnames(classes.expand, {
                                    [classes.expandOpen]: this.state.profileExpanded,
                                  })}
                                  onClick={this.handleExpandClick.bind(this, "profileExpanded")}
                                  aria-expanded={this.state.profileExpanded}
                                  aria-label="Show more"
                                >
                                  <ExpandMoreIcon />
                                </IconButton>
                            }
                        />
                        <Collapse in={this.state.profileExpanded} timeout="auto" unmountOnExit>
                            <CardContent>
                                <Grid container>
                                    <Grid item xs={12} sm={12} md={4}>
                                        <MediaUpload
                                            fullScreen={false}
                                            onChange={this.handleUserImageChange}
                                            minWidth={201}
                                            data={currentUser.profile && currentUser.profile.pic && {file: currentUser.profile.pic, isUrl: true}}
                                            showVideoOption={false}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={8}>
                                        <form onSubmit={this.submitUserDetails}>
                                            <IconInput
                                                labelText="First Name"
                                                value={firstName}
                                                onChange={this.handleTextChange.bind(this, "firstName")}
                                            />
                                            <IconInput
                                                labelText="Last Name"
                                                value={lastName}
                                                onChange={this.handleTextChange.bind(this, "lastName")}
                                            />
                                            <Typography className={classes.inputCaption} type="caption">
                                                Your public profile only shows first name. When you join
                                                a school, your instructors will see your first and last name.
                                            </Typography>
                                            <FormControl fullWidth margin='dense'>
                                                <InputLabel htmlFor="gender">I Am</InputLabel>
                                                <Select
                                                    input={<Input id="gender"/>}
                                                    value={this.state.gender}
                                                    onChange={(event) => this.setState({ gender: event.target.value })}
                                                    fullWidth
                                                >
                                                    {
                                                        config.gender.map((data, index)=> {
                                                            return <MenuItem
                                                                key={`${index}-${data.value}`}
                                                                value={data.value}>
                                                                {data.label}
                                                            </MenuItem>
                                                        })
                                                    }
                                                </Select>
                                            </FormControl>
                                            <Typography className={classes.inputCaption} type="caption">
                                                We use this data for analysis and never share it with other users.
                                            </Typography>
                                            <FormControl fullWidth margin='dense'>
                                                <MaterialDatePicker
                                                    floatingLabelText={"Birth Date"}
                                                    value={dob}
                                                    onChange={(event, date) => this.setState({ dob: date})}
                                                    fullWidth={true}
                                                />
                                            </FormControl>
                                            <Typography className={classes.inputCaption} type="caption">
                                                The wonderful day you took your first breath. We use this data to help you find classes and never share ti with other users.
                                            </Typography>
                                            <IconInput
                                                type="email"
                                                disabled={true}
                                                value={email}
                                                labelText="Email Address"
                                                iconName="email"
                                            />
                                            <Typography className={classes.inputCaption} type="caption">
                                                We won't be share your private email address with others Members.
                                            </Typography>
                                            <IconInput
                                                type="tel"
                                                labelText="Phone Number"
                                                iconName="contact_phone"
                                                value={phone}
                                                onChange={this.handleTextChange.bind(this, "phone")}
                                            />
                                            <Typography className={classes.inputCaption} type="caption">
                                                This is only shared with Administrators odf a school you have enrolled in.
                                            </Typography>
                                            <FormControl fullWidth margin='dense'>
                                                <InputLabel htmlFor="currency">Preferred Currency</InputLabel>
                                                <Select
                                                    input={<Input id="currency"/>}
                                                    value={this.state.currency}
                                                    onChange={(event) => this.setState({ currency: event.target.value })}
                                                    fullWidth
                                                >
                                                    {
                                                        config.currency.map((data, index)=> {
                                                            return <MenuItem
                                                                key={`${index}-${data.value}`}
                                                                value={data.value}>
                                                                {data.label}
                                                            </MenuItem>
                                                        })
                                                    }
                                                </Select>
                                            </FormControl>
                                            <IconInput
                                                onChange={this.locationInputChanged}
                                                iconName='location_on'
                                                googlelocation={true}
                                                labelText="Where You Live"
                                                value={address}
                                                onLocationChange={this.onLocationChange}
                                            />
                                            <IconInput
                                                type="text"
                                                multiline={true}
                                                labelText="About You"
                                                defaultValue={about}
                                                value={about}
                                                onChange={this.handleTextChange.bind(this, "about")}
                                            />
                                            <SaveBtnWrapper>
                                                <Button type="submit" color="accent" raised dense>
                                                    Save
                                                </Button>
                                            </SaveBtnWrapper>
                                            {
                                                this.state.errorText && <ErrorWrapper>{this.state.errorText}</ErrorWrapper>
                                            }
                                        </form>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Collapse>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Card className={classes.card}>
                        <CardHeader
                            title="Media Settings"
                            action={
                                <IconButton
                                  className={classnames(classes.expand, {
                                    [classes.expandOpen]: this.state.mediaExpanded,
                                  })}
                                  onClick={this.handleExpandClick.bind(this, "mediaExpanded")}
                                  aria-expanded={this.state.mediaExpanded}
                                  aria-label="Show more"
                                >
                                  <ExpandMoreIcon />
                                </IconButton>
                            }
                        />
                        <Collapse in={this.state.mediaExpanded} timeout="auto" unmountOnExit>
                            <CardContent>
                                No setting found
                            </CardContent>
                        </Collapse>
                    </Card>
                </Grid>

            </Grid>
        )
    } else {
        return  <Typography type="display2" gutterBottom align="center">
            Access Denied!!!
        </Typography>
    }
}