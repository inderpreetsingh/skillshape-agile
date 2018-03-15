import React from "react";
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import {cutString} from '/imports/util';
import { InfiniteScroll } from '/imports/util';
import { browserHistory, Link } from 'react-router';
import Grid from 'material-ui/Grid';

import SchoolCard from "/imports/ui/components/landing/components/cards/schoolCard";
import NoResults from '/imports/ui/components/landing/components/NoResults';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

const NoResultContainer = styled.div`
  text-align: center;
  width: 100%;
  height: 100vh;
  ${helpers.flexCenter}
  flex-direction: column;
`;

export default function (props) {
    let schools = this.props.collectionData || [];

    if(isEmpty(schools)) {
        return (
            <NoResultContainer>
                <NoResults
                    removeAllFiltersButtonClick={this.props.removeAllFilters}
                />
            </NoResultContainer>
        )
    } else {
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
}