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
    const {membersByName , src} = this.props;
    /*membersByName && Object.keys(membersByName).map((key) => {
      console.log("key===>",key);
    })
    membersByName = _.sortBy(membersByName, key);*/
    return (<div>
      <List>
          {
            membersByName && Object.keys(membersByName).sort().map((key) => {
              return (
                [
                <ListItem style={{borderBottom: 'solid 1px #dddd'}} key={key} dense button><b>{key}</b><hr/></ListItem>,
                membersByName[key] && membersByName[key].map((data) => {
                  // console.log("data>>>>>>>>>>", members.people, data)
                   return (<ListItem key={data._id} dense button>
                              <Avatar alt="Remy Sharp" src={src ? src : ''}>{key}</Avatar>
                              <ListItemText primary={data.firstName} />
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