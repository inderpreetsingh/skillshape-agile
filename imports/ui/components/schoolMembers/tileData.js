import React from 'react';
import Avatar from 'material-ui/Avatar';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';


import { withSubscriptionAndPagination } from '/imports/util';
import SchoolMemberDetails from "/imports/api/schoolMemberDetails/fields";


class SchoolMemberListItems extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    console.log("mailFolderListItems",this)
    const {src, collectionData} = this.props;
    const membersByName = _.groupBy(collectionData, function(item){ return item.firstName[0].toUpperCase() });
    return (<div>
      {(collectionData && collectionData.length > 0 ) ?
        <Grid container style={{marginTop:'10px'}}>
          <Grid item sm={12} xs={12} md={12} style={{borderBottom: '1px solid #ddd'}}>
            <Typography>{collectionData.length} Students</Typography>
          </Grid>
          <Grid item sm={12} xs={12} md={12} style={{minWidth: '230px',fontSize: '12px',overflowY: 'scroll',height: '350px'}}>
            <List>
                {
                  membersByName && Object.keys(membersByName).sort().map((key) => {
                    return (
                      [
                      <ListItem style={{borderBottom: 'solid 1px #dddd'}} key={key} dense button><b>{key}</b><hr/></ListItem>,
                      membersByName[key] && membersByName[key].map((data) => {
                       return (
                        <ListItem
                          key={data._id}
                          dense
                          button
                          onClick={()=> this.props.handleMemberDetailsToRightPanel(data._id)}
                        >
                          <Avatar alt="Remy Sharp" src={src ? src : ''}>{key}</Avatar>
                          <ListItemText primary={data.firstName} />
                        </ListItem>
                        )
                       })
                      ]
                   )
                  })
                }
            </List>
          </Grid>
        </Grid>
        : ''
      }

    </div>)
  }
}

export default withSubscriptionAndPagination(SchoolMemberListItems, {collection: SchoolMemberDetails, subscriptionName: "membersBySchool", recordLimit: 10});
