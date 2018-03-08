import React, { Component } from 'react';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import debounce from 'lodash/debounce';

import DashBoardView from './dashboard';
import SchoolMemberFilter from "./filter";
import Preloader from '/imports/ui/components/landing/components/Preloader.jsx';

class SchoolMemberView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            filters: {},
        }
    }

    render() {
        console.log("SchoolMemberView -->>",this.state);
        let { currentUser, isUserSubsReady } = this.props;
        let { slug } = this.props.params;
        let filters = {...this.state.filters};

        if(!isUserSubsReady)
            return <Preloader/>

        if(!currentUser) {
            return  <Typography type="display2" gutterBottom align="center">
                To access this page you need to signin to skillshape.
            </Typography>
        }

        if(!slug)  {
            filters.activeUserId = currentUser._id;
        }

        return(
            <Grid container className="containerDiv" style={{position:'relative',backgroundColor: '#fff'}}>
                <DashBoardView
                    filters={filters}
                    params={this.props.params}
                />
            </Grid>
        )
    }
}

export default SchoolMemberView;