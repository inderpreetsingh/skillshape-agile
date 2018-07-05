import React from 'react';

import {withStyles} from 'material-ui/styles';
import Table ,{TableBody, TableCell, TableHead, TableRow} from 'material-ui/Table';
import Paper from 'material-ui/Paper';

import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

const CustomTableCell = withStyles({
  head: {
    backgroundColor: helpers.headingColor,
    color: "white",
    fontFamily: helpers.specialFont,
    fontSize: helpers.baseFontSize * 1.25
  },
  body: {
    fontFamily: helpers.specialFont,
    fontSize: helpers.baseFontSize,
  },
})(TableCell);

const SuggestionTable = (props) => {
  return(<Paper><Table>
       <TableHead>
         <TableRow>
          <CustomTableCell>School Name</CustomTableCell>
          <CustomTableCell>Location Name</CustomTableCell>
          <CustomTableCell>Skill Categories</CustomTableCell>
          <CustomTableCell>Skill Subjects</CustomTableCell>
          <CustomTableCell>Experience Level</CustomTableCell>
          <CustomTableCell>Month Price ( min - max)</CustomTableCell>
          <CustomTableCell>Class Price (min - max)</CustomTableCell>
          <CustomTableCell>Gender</CustomTableCell>
          <CustomTableCell>Age</CustomTableCell>
         </TableRow>
       </TableHead>
       <TableBody>
         {props.data.map(n => {
           return (<TableRow key={n._id}>
               <CustomTableCell component="th" scope="row">
                 {n.schoolName}
               </CustomTableCell>
               <CustomTableCell numeric>{n.locationName}</CustomTableCell>
               <CustomTableCell numeric>{n.skillCategories.map(cat => cat.name).join(',')}</CustomTableCell>
               <CustomTableCell numeric>{n.skillSubjects.map(sub => sub.name).join(',')}</CustomTableCell>
               <CustomTableCell numeric>{n.monthPrice.min} - {n.monthPrice.max}</CustomTableCell>
               <CustomTableCell numeric>{n.classPrice.min} - {n.classPrice.max}</CustomTableCell>
               <CustomTableCell numeric>{n.gender}</CustomTableCell>
               <CustomTableCell numeric>{n.age}</CustomTableCell>
             </TableRow>);
         })}
       </TableBody>
     </Table>
  </Paper>);
}

export default SuggestionTable;
