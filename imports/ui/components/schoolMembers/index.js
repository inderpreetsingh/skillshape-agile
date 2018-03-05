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
            filters: {
                classTypeIds: [],
                memberName: "",
            },
        }
    }

    handleMemberNameChange = (event) => {
        console.log("handleMemberNameChange -->",event)
        this.setState({
            filters: {
                ...this.state,
                memberName: event.target.value,
            }
        });
    }

    handleClassTypeDataChange = (data) => {
        let classTypeIds = data.map((item) => {
            return item._id;
        })
        this.setState({
            filters: {
                ...this.state,
                classTypeIds: classTypeIds,
            }
        });
    }

    setInitialClassTypeData = (data) => {
        this.refs.SchoolMemberFilter.setClassTypeData(data);
    }

    render() {
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
                 <Grid item sm={4} xs={12} md={4} style={{border: 'solid 1px #ddd'}}>
                    <SchoolMemberFilter
                        stickyPosition={this.state.sticky}
                        ref="SchoolMemberFilter"
                        handleClassTypeDataChange={this.handleClassTypeDataChange}
                        handleMemberNameChange={this.handleMemberNameChange}
                        filters={filters}
                        classTypeData={this.state.classTypeData}
                    />
                </Grid>
                <DashBoardView
                    filters={filters}
                    handleMemberNameChange={this.handleMemberNameChange}
                    handleClassTypeDataChange={this.handleClassTypeDataChange}
                    displayFilters={this.displayFilters}
                    params={this.props.params}
                    setInitialClassTypeData={this.setInitialClassTypeData}
                />
            </Grid>
        )
    }
}

export default SchoolMemberView;