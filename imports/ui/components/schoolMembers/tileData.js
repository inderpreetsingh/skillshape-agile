import React from 'react';
import Avatar from 'material-ui/Avatar';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import studentsData from './studentsData.js';

class MailFolderListItems extends React.Component {

  constructor(props) {
        super(props);
  }

  render() {
    console.log("mailFolderListItems",this.props)
    const {schoolMemberDetails} = this.props;
    return (<div>
      <List>
          {schoolMemberDetails && schoolMemberDetails.map(value => (
            <ListItem key={value} dense button>
              <Avatar alt="Remy Sharp" src="/images/avatar.jpg"/>
              <ListItemText primary={`${value.firstName}`} />
            </ListItem>
          ))}
      </List>

    </div>)
  }
}

export default MailFolderListItems;
