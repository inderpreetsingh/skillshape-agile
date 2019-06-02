import get from 'lodash/get';
import { isEmpty } from 'lodash';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';
import DashBoardView from './dashboard';
import Preloader from '/imports/ui/components/landing/components/Preloader';
import { checkIsEmailVerified } from "/imports/util";

class SchoolMemberView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            filters: {},
        }
    }
    componentWillMount() {
        checkIsEmailVerified.call(this,true);
      }
    render() {
        let { currentUser, isUserSubsReady,  } = this.props;
        let slug = get(this.props.params, 'slug', this.props.slug);
        let view = get(this.props, 'view', 'classmates');
        let userId = get(this.props, 'userId', null);
        let filters = { ...this.state.filters };

        if (!isUserSubsReady)
            return <Preloader />

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
                <Grid container className="containerDiv" style={{ position: 'relative', backgroundColor: '#fff', margin: '0', width: '100%' }}>
                    <DashBoardView
                        filters={filters}
                        params={this.props.params}
                        location={this.props.location}
                        slug={slug}
                        view={view}
                        userId={userId}
                    />
                </Grid>
            </DocumentTitle>
        )
    }
}

export default SchoolMemberView;