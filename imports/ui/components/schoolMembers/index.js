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
            classTypeData: [],
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

    setClassTypeData = (classTypeData) => {
        this.setState({classTypeData})
    }

    render() {
        let { currentUser, isUserSubsReady } = this.props;

        if(!isUserSubsReady)
            return <Preloader/>

        if(!currentUser) {
            return  <Typography type="display2" gutterBottom align="center">
                To access this page you need to signin to skillshape.
            </Typography>
        }

        return(
            <Grid container className="containerDiv" style={{position:'relative',backgroundColor: '#fff'}}>
                 <Grid item sm={4} xs={12} md={4} style={{border: 'solid 1px #ddd'}}>
                    <SchoolMemberFilter
                        stickyPosition={this.state.sticky}
                        ref="ClaimSchoolFilter"
                        handleClassTypeDataChange={this.handleClassTypeDataChange}
                        handleMemberNameChange={this.handleMemberNameChange}
                        filters={this.state.filters}
                        classTypeData={this.state.classTypeData}
                    />
                </Grid>
                <DashBoardView
                    filters={this.state.filters}
                    handleMemberNameChange={this.handleMemberNameChange}
                    handleClassTypeDataChange={this.handleClassTypeDataChange}
                    displayFilters={this.displayFilters}
                    params={this.props.params}
                    setClassTypeData={this.setClassTypeData}
                />
            </Grid>
        )
    }
}

export default SchoolMemberView;