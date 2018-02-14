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
    const {membersByName} = this.props;
    return (<div>
      <List>
          {
            membersByName && membersByName.map((members) => {
              return (
                [
                <ListItem style={{borderBottom: 'solid 1px #dddd'}} key={members._id} dense button><b>{members._id}</b><hr/></ListItem>,
                members && members.people.map((data) => {
                  // console.log("data>>>>>>>>>>", members.people, data)
                   return (<ListItem key={members._id} dense button>
                              <Avatar alt="Remy Sharp" src="/images/avatar.jpg"/>
                              <ListItemText primary={data.name} />
                          </ListItem>)
                 })
                ]
             )
            })
          }
      </List>

    </div>)
  }
}

export default MailFolderListItems;