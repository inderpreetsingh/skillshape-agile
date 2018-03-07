import React ,{ Component, Fragment } from 'react';
import get from 'lodash/get';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Input from 'material-ui/Input';
import isEmpty from "lodash/isEmpty";
import { withStyles } from "material-ui/styles";
const styles = theme => ({
  avatarCss: {
    width: '150px',
    height: '150px',
    backgroundSize: 'cover',
    backgroundPosition: 'top center',
    borderRadius: '50%'
  }
});

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
    		<Fragment>
              	<Grid container className="userInfoPanel" style={{display: 'flex',borderTop: 'solid 3px #ddd'}}>
	                <Grid item sm={4} xs={12} md={4}>
	                    <div className="avtar">
	                    	<img className={classes.avatarCss} src="/images/avatar.jpg"/>
	                  	</div>
	                  	<Typography>{ memberInfo.name }</Typography>
	                  	<Typography>{ memberInfo.phone }</Typography>
	                  	<Typography>{ memberInfo.email }</Typography>
	                </Grid>
                	<Grid item sm={4} xs={12} md={4}>
    					<div className="notes">
                    		{ view === "admin" ? "Admin Notes" : "My Private Notes" }
                  		</div>
                  		<Input
		                    onBlur={this.saveMyNotesInMembers}
		                    value={this.state.notes}
		                    onChange={(e) => this.setState({ notes: e.target.value })}
		                    fullWidth
		                    style={{border: '1px solid',backgroundColor: '#fff'}}
		                    multiline
		                    rows={4}
		                />
                	</Grid>
                </Grid>
            	{
            		view === "admin" && (
              			<Grid container style={{backgroundColor: 'darkgray'}}>
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
            		)
            	}
            </Fragment>
    	)
    }
}

export default withStyles(styles, { withTheme: true })(SchoolMemberInfo);