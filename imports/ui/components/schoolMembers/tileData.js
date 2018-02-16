import React from 'react';
import Avatar from 'material-ui/Avatar';
import List, { ListItem, ListItemText } from 'material-ui/List';

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

    </div>)
  }
}

export default withSubscriptionAndPagination(SchoolMemberListItems, {collection: SchoolMemberDetails, subscriptionName: "membersBySchool", recordLimit: 10});
