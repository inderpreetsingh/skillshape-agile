import React from "react";
import Avatar from "material-ui/Avatar";
import List, { ListItem, ListItemText } from "material-ui/List";
import Typography from "material-ui/Typography";
import Grid from "material-ui/Grid";

export default function(props) {
  const { src, collectionData } = props;
  const membersByName = _.groupBy(collectionData && collectionData, function(
    item
  ) {
    return item && item.firstName && item.firstName[0].toUpperCase();
  });
  return (
    <Grid container>
      {collectionData && collectionData.length > 0 ? (
        <Grid item sm={12} xs={12} md={12}>
          <Grid item sm={12} xs={12} md={12} style={{ padding: 8 }}>
            <Typography>{collectionData.length} Students</Typography>
          </Grid>
          <Grid item sm={12} xs={12} md={12}>
            <Grid
              container
              style={{ borderTop: "solid 1px #ddd", marginTop: "auto" }}
            >
              <List>
                {membersByName &&
                  Object.keys(membersByName)
                    .sort()
                    .map(key => {
                      return [
                        <ListItem
                          style={{ borderBottom: "solid 1px #dddd" }}
                          key={key}
                          dense
                          button
                        >
                          <b>{key}</b>
                          <hr />
                        </ListItem>,
                        membersByName[key] &&
                          membersByName[key].map(data => {
                            return (
                              <ListItem
                                key={data._id}
                                dense
                                button
                                onClick={() =>
                                  this.props.handleMemberDetailsToRightPanel(
                                    data._id
                                  )
                                }
                              >
                                <Avatar alt="Remy Sharp" src={src ? src : ""}>
                                  {key}
                                </Avatar>
                                <ListItemText primary={data.firstName} />
                              </ListItem>
                            );
                          })
                      ];
                    })}
              </List>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        ""
      )}
    </Grid>
  );
}
