import ClearIcon from 'material-ui-icons/Clear';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import { MuiThemeProvider, withStyles } from 'material-ui/styles';
import { createContainer } from "meteor/react-meteor-data";
import React from 'react';
import styled from "styled-components";
import muiTheme from '../jss/muitheme';
import School from '/imports/api/school/fields';
import FormGhostButton from "/imports/ui/components/landing/components/buttons/FormGhostButton";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers";
import { mobile } from "/imports/ui/components/landing/components/jss/helpers";
import ClassPackageForm from '/imports/ui/components/schoolView/editSchool/priceDetails/classPrice/classPriceForm';
import EnrollmentFeeForm from '/imports/ui/components/schoolView/editSchool/priceDetails/enrollmentFee/enrollmentFeeForm';
import MonthlyPackageForm from '/imports/ui/components/schoolView/editSchool/priceDetails/monthlyPrice/monthlyPriceForm';
import { ContainerLoader } from '/imports/ui/loading/container';
const ButtonWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv}px;
`;
const DialogTitleWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  width: 100%;
  
`;


const InputWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv * 2}px;
`;

const styles = {
    dialogAction: {
        width: '100%'
    },
    dialogActionsRoot: {
      [`@media screen and (max-width: ${mobile}px)`]: {
        flexWrap: "wrap",
        justifyContent: "center"
      }
    }
}

const ErrorWrapper = styled.span`
    color: red;
    float: right;
`;

class PackageAddNew extends React.Component {
    constructor(props) {
        super(props);
        this.state = { classPackageForm:false,enrollmentFeeForm:false,monthlyPackageForm:false}
    }
   
    render() {
        const { schoolId, data,currency ,classTypeData} = this.props;
        const {enrollmentFeeForm,classPackageForm,monthlyPackageForm,}= this.state;
        return (
            <MuiThemeProvider theme={muiTheme}>
                <Dialog
                    title="Add New Package"
                    open={this.props.open}
                    onClose={this.props.onModalClose}
                    onRequestClose={this.props.onModalClose}
                    aria-labelledby="Add New Package"
                >
                    {this.props.isLoading && <ContainerLoader />}
                    <DialogTitle>
                        <DialogTitleWrapper>
                        Add New Package

                            <IconButton color="primary" onClick={() => { this.props.onClose() }}>
                                <ClearIcon />
                            </IconButton >
                        </DialogTitleWrapper>
                    </DialogTitle>
                    <DialogContent>
                        What kind of package you want to create? Please Select
                         the package that you want to add to this class time.
                        </DialogContent>
                    <DialogActions classes={{ root: this.props.classes.dialogActionsRoot }}>
                            <ButtonWrapper>
                                <FormGhostButton
                                    onClick={() => { this.setState({enrollmentFeeForm:true})}}
                                label="Enrollment Package"
                            />
                        </ButtonWrapper>
                        <ButtonWrapper>
                            <FormGhostButton
                                onClick={() => { this.setState({classPackageForm:true}) }}
                                label="Class Package"
                            />
                        </ButtonWrapper>
                        <ButtonWrapper>
                            <FormGhostButton
                                onClick={() => { this.setState({monthlyPackageForm:true})  }}
                                label="Monthly Package"
                            />
                        </ButtonWrapper>
                    </DialogActions>

                </Dialog>
                {enrollmentFeeForm && <EnrollmentFeeForm 
                open={enrollmentFeeForm}
                currency={currency}
                data={data}
                classTypeData={classTypeData}
                schoolId={schoolId}
                onClose={()=>{this.props.classTimeFormOnClose()}}
                />}
                {classPackageForm && <ClassPackageForm 
                open={classPackageForm}
                currency={currency}
                data={data}
                classTypeData={classTypeData}
                schoolId={schoolId}
                onClose={()=>{this.props.classTimeFormOnClose()}}
                />}
                {monthlyPackageForm && <MonthlyPackageForm 
                open={monthlyPackageForm}
                currency={currency}
                data={data}
                classTypeData={classTypeData}
                schoolId={schoolId}
                onClose={()=>{this.props.classTimeFormOnClose()}}
                />}
            </MuiThemeProvider>
        )
    }
}


export default createContainer(props => {
    const { schoolId ,classTypeId,classTypeName,parentData} = props;
    let currency,schoolDataSubscription,data={},classTypeData;
    schoolDataSubscription = Meteor.subscribe("school.getSchoolBySchoolId", schoolId)
  
    if (schoolDataSubscription && schoolDataSubscription.ready()) 
    {
        schoolData = School.findOne();
        currency = schoolData && schoolData.currency ? schoolData.currency : config.defaultCurrency;
   
    }
    console.log('classTypeName in the packageaddnew',classTypeName)
    data.selectedClassType=[classTypeName];
    data.from='classTime'
    classTypeData=[parentData]
    return {
      ...props,
     currency,
     data,
     classTypeData
    };
  }, withStyles(styles)(PackageAddNew));