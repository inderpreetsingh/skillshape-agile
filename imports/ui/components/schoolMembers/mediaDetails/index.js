import React from "react";

import SchoolMemberMediaRender from "./schoolMemberMediaRender";
import MediaDetails from "/imports/ui/components/schoolView/editSchool/mediaDetails";

import SchoolMemberDetails from "/imports/api/schoolMemberDetails/fields";

class SchoolMemberMedia extends MediaDetails {

    constructor(props) {
        super(props);
        this.state = {
            memberInfo: this.props.schoolMemberDetailsFilters && SchoolMemberDetails.findOne(this.props.schoolMemberDetailsFilters),
        }
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.schoolMemberDetailsFilters) {
            this.setState({
                memberInfo: nextProps.schoolMemberDetailsFilters && SchoolMemberDetails.findOne(nextProps.schoolMemberDetailsFilters)
            })
        }
    }
    handleDialogState = (dBoxName, dBoxState) => (e) => {
        this.setState(state => {
            return {
                ...state,
                [dBoxName]: dBoxState
            }
        });
    }

    render() {
        return SchoolMemberMediaRender.call(this, this.props, this.state);
    }
}

export default SchoolMemberMedia;