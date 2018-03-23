import React ,{ Component, Fragment } from 'react';
import get from 'lodash/get';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Input from 'material-ui/Input';
import isEmpty from "lodash/isEmpty";
import { withStyles } from "material-ui/styles";
import styled from 'styled-components';

import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

const styles = theme => ({
  avatarCss: {
    width: '150px',
    height: '150px',
    backgroundSize: 'cover',
    backgroundPosition: 'top center',
    borderRadius: '50%'
  },
   btnBackGround:{
    background:`${helpers.action}`
  }
});

import MemberActionButton from '/imports/ui/components/landing/components/buttons/MemberActionButton.jsx';


const ActionButtonsWrapper = styled.div`
  left: ${helpers.rhythmDiv * 2}px;
  bottom: ${helpers.rhythmDiv * 2}px;
  right: auto;
  padding: 5px;
  ${helpers.flexCenter}

  @media screen and (max-width: ${helpers.tablet + 100}px) {
    justify-content: flex-start;
    align-items: flex-start;
    bottom: 0;
  }

  @media screen and (max-width: ${helpers.tablet}px) {
    position: initial;
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

const ActionButton = styled.div`
  margin-right: ${helpers.rhythmDiv}px;

  @media screen and (max-width: ${helpers.tablet + 100}px) {
    margin-right: 0;
    margin-bottom: ${helpers.rhythmDiv * 2}px;
  }

  @media screen and (max-width: ${helpers.tablet}px) {
    margin-right: ${helpers.rhythmDiv}px;
  }
`;

const ActionButtons = (props) => (
  <ActionButtonsWrapper>
    <ActionButton>
      <MemberActionButton icon iconName='phone' label="Call"/>
    </ActionButton>

    <ActionButton>
      <MemberActionButton secondary noMarginBottom label="Email" icon iconName="email"/>
    </ActionButton>

    <ActionButton>
      <MemberActionButton  noMarginBottom label="Edit" icon iconName="edit"/>
    </ActionButton>
  </ActionButtonsWrapper>
);

class SchoolMemberInfo extends Component {

	constructor(props) {
        super(props)
        this.state = this.initializeState(this.props)
    }

    componentWillReceiveProps(nextProps) {
    	if(nextProps.memberInfo) {
    		this.setState(this.initializeState(nextProps))
    	}
    }

    initializeState = ({ memberInfo, view }) => {
    	let state = {};
    	if(view === "admin") {
    		state.notes = get(memberInfo, "adminNotes", "");
    	} else {
    		state.notes = get(memberInfo, `classmatesNotes[${Meteor.userId()}].notes`, "");
    	}
    	return state;
    }

  	saveMyNotesInMembers = (event) => {
        console.log("saveMyNotesInMembers memberInfo -->>",memberInfo);
        const { memberInfo, view } = this.props;
        let payload = {};

        if(view === "admin" && Meteor.userId()) {
        	payload.adminNotes = this.state.notes;
        } else if(view === "classmates" && Meteor.userId()) {
        	payload.classmatesNotes = {
        		[Meteor.userId()]: {
                    notes: this.state.notes,
                }
        	}
        }
        console.log("Final payload -->>", payload)
        Meteor.call('schoolMemberDetails.editSchoolMemberDetails', {doc_id: memberInfo._id, doc: payload }, (err,res) => {
            if(res) {
                console.log("Upadted School Notes",res);
            }
            if(err) {
                console.error("err",err);
            }
        });
    }

  	render() {
  		const { memberInfo, view, classes } = this.props;
    	console.log("SchoolMemberInfo notes -->>",this.state);
    	console.log("SchoolMemberInfo props -->>",this.props);
    	return (
    		<Grid container>
              	<Grid container className="userInfoPanel" style={{borderTop: 'solid 3px #ddd',display: 'flex'}}>
	                <Grid item sm={8} xs={12} md={8} style={{display: 'flex',justifyContent: 'space-evenly',padding: '24px'}}>
	                    <Grid item sm={4} xs={4} md={4}>
	                    	<img className={classes.avatarCss} src="/images/avatar.jpg"/>
	                  	</Grid>
                        <Grid item sm={4} xs={4} md={4}>
                            <Typography>{ memberInfo.name }</Typography>
                            <Typography>{ memberInfo.phone }</Typography>
                            <Typography>{ memberInfo.email }</Typography>
                        </Grid>
                    </Grid>
                	<Grid item sm={3} xs={12} md={3} style={{padding: '28px'}}>
    					<div className="notes">
                    		{ view === "admin" ? "Admin Notes" : "My Private Notes" }
                  		</div>
                  		<Input
		                    onBlur={this.saveMyNotesInMembers}
		                    value={this.state.notes}
		                    onChange={(e) => this.setState({ notes: e.target.value })}
		                    style={{border: '1px solid',backgroundColor: '#fff'}}
		                    multiline
		                    rows={4}
                            fullWidth
		                />
                	</Grid>
                </Grid>
            	{
            		view === "admin" && (
              			<Grid container style={{backgroundColor: 'darkgray'}}>
		                	<Grid item>
		                  		<ActionButtons/>
		                	</Grid>
              			</Grid>
            		)
            	}
            </Grid>
    	)
    }
}

export default withStyles(styles, { withTheme: true })(SchoolMemberInfo);