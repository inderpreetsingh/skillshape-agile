import React from 'react';

import {withStyles} from 'material-ui/styles';
import Table ,{TableBody, TableCell, TableHead, TableRow} from 'material-ui/Table';
import Paper from 'material-ui/Paper';

import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

const styles = {
  root: {
    width: '100%',
    padding: helpers.rhythmDiv * 2,
    overflowX: 'auto',
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: helpers.panelColor,
    },
  },
}

const CustomTableCell = withStyles({
  head: {
    backgroundColor: helpers.black,
    color: "white",
    fontFamily: helpers.specialFont,
    fontSize: helpers.baseFontSize,
    fontWeight: 600
  },
  body: {
    fontFamily: helpers.specialFont,
    fontSize: helpers.baseFontSize,
    fontWeight: 400
  },
})(TableCell);

const SuggestionTable = (props) => {
  return(<Paper className={props.classes.root}>
    <Table className={props.classes.table}>
       <TableHead>
         <TableRow>
          <CustomTableCell>School Name</CustomTableCell>
          <CustomTableCell>Location Name</CustomTableCell>
          <CustomTableCell>Skill Categories</CustomTableCell>
          <CustomTableCell>Skill Subjects</CustomTableCell>
          <CustomTableCell>Experience Level</CustomTableCell>
          <CustomTableCell>MonthPrice (min - max)</CustomTableCell>
          <CustomTableCell>ClassPrice (min - max)</CustomTableCell>
          <CustomTableCell>Gender</CustomTableCell>
          <CustomTableCell>Age</CustomTableCell>
         </TableRow>
       </TableHead>
       <TableBody>
         {props.data.map(n => {
           return (<TableRow key={n._id} className={props.classes.row}>
               <CustomTableCell>{n.schoolName}</CustomTableCell>
               <CustomTableCell>{n.locationName}</CustomTableCell>
               <CustomTableCell>{n.skillCategories.map(cat => cat.name).join(' ,')}</CustomTableCell>
               <CustomTableCell>{n.skillSubjects.map(sub => sub.name).join(' ,')}</CustomTableCell>
               <CustomTableCell>{n.experienceLevel.join(' ,')}</CustomTableCell>
               <CustomTableCell numeric>{n.monthPrice.min} - {n.monthPrice.max}</CustomTableCell>
               <CustomTableCell numeric>{n.classPrice.min} - {n.classPrice.max}</CustomTableCell>
               <CustomTableCell>{n.gender}</CustomTableCell>
               <CustomTableCell numeric>{n.age}</CustomTableCell>
             </TableRow>);
         })}
       </TableBody>
     </Table>
  </Paper>);
}

export default withStyles(styles)(SuggestionTable);
