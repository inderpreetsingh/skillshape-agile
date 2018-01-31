import React from "react";
import {cutString} from '/imports/util';
import { InfiniteScroll } from '/imports/util';
import { browserHistory, Link } from 'react-router';
import Grid from 'material-ui/Grid';
import SchoolCard from "/imports/ui/components/landing/components/cards/schoolCard"

export default function (props) {
  let schools = this.props.collectionData || [];
  return (
      <div>
        <Grid container style={{paddingLeft:'16px',paddingRight:'16px'}}>
          {
            schools.map((school, index) => {
              return (
                   <Grid item key={index} md={4} sm={6} lg={3} xs={12}>
                       <SchoolCard schoolCardData={school} handleClaimASchool={this.props.handleClaimASchool}/>
                   </Grid>
              )
            })
          }
        </Grid>
      </div>
  )
}