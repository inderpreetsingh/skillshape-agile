import React from "react";
import Paper from 'material-ui/Paper'
import { withStyles } from "material-ui/styles";
import styled from "styled-components";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import groupBy from 'lodash/groupBy'
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import moment from "moment";
import { Scrollbars } from 'react-custom-scrollbars';
const styles = theme => ({
    root: {
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        margin: "70px",
        backgroundColor: "dodgerblue;",
        borderRadius: "20px",
        maxWidth: "400px",
        maxHeight: "507px",
    },
    singleSubscription:{
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        backgroundColor: "dimgrey;",
        borderRadius: "20px",
        margin:"8px"
    },
    subscriptionStatus:{
        backgroundColor: "#4caf50",
        borderRadius: "20px",
        width: "auto",
        padding: "10px"
    }
   
  });
const Heading = styled.div`
  font-size: larger;
  font-weight: 900;
  text-align: center;
`;
const SubscriptionName = styled.div`
  font-size: initial;
  margin-left: 12px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  text-align: center;
  margin-right: 10px;
  text-transform: uppercase;
`;
const Expiring = styled.div`
font-size: initial;
margin-left: 12px;
font-weight: 400;
margin-right: 10px;
text-transform: unset;
`;
class SubscriptionBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
       
    };
  }
 
  render() {
    const { classes,subscriptionList} = this.props;
    return (
        <div>
            <Paper className={classes.root}>
            <Heading>
                SUBSCRIPTIONS
            </Heading>
            <Scrollbars
            autoHeight
            autoHeightMin={100}
            autoHeightMax={459}
            autoHide
            autoHideTimeout={1000}
            autoHideDuration={200}
             >
            {!isEmpty(subscriptionList) && subscriptionList.map((current,index)=>{
                let status =  get(current,'packageStatus',get(current,'status','No Status'));
                let backgroundColor = status=='active' || status=='succeeded'?'#4caf50':status=='inProgress' ? 'yellow' : status == 'inActive' ? 'blue' : 'red' ;
                return <div>
                <Paper className={classes.singleSubscription}>
                 <SubscriptionName>
                 {get(current,'packageName','No Name Found')}
                <Paper className={classes.subscriptionStatus} style={{backgroundColor}}>
                 {status}
                 </Paper>   
                </SubscriptionName>
                <Expiring>
                 Expiring On {moment(current.endDate).format("Do MMMM YYYY")}
                 </Expiring>
                 {get(current,'packageType','MP')=='MP' &&  <Expiring>
                 Renewal On {moment(current.endDate).add(1, 'M').format("Do MMMM YYYY")}
                 </Expiring>}
                  </Paper>
                </div>
            })}
            </Scrollbars>
            </Paper>
        </div>
    );
  }
}
export default withStyles(styles)(SubscriptionBox);
