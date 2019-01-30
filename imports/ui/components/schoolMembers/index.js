import get from 'lodash/get';
import { isEmpty } from 'lodash';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';
import DashBoardView from './dashboard';
import Preloader from '/imports/ui/components/landing/components/Preloader.jsx';

class SchoolMemberView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            filters: {},
        }
    }

    render() {
        let { currentUser, isUserSubsReady, admin } = this.props;
        let slug = get(this.props.params, 'slug', this.props.slug);
        let filters = { ...this.state.filters };

        if (!isUserSubsReady)
            return <Preloader />

        console.log(isUserSubsReady, isEmpty(currentUser));
        if (isUserSubsReady && isEmpty(currentUser)) {
            return <Typography type="display2" gutterBottom align="center">
                To access this page you need to signin to skillshape.
            </Typography>
        }

        if (!slug) {
            filters.activeUserId = currentUser._id;
        }

        return (
            <DocumentTitle title={get(this.props.route, 'name', 'Member Listing')}>
                <Grid container className="containerDiv" style={{ position: 'relative', backgroundColor: '#fff' }}>
                    <DashBoardView
                        filters={filters}
                        params={this.props.params}
                        location={this.props.location}
                        slug={slug}
                        admin={admin}
                    />
                </Grid>
            </DocumentTitle>
        )
    }
}

export default SchoolMemberView;