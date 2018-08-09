import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import isEmpty from "lodash/isEmpty";
import uniq from 'lodash/uniq'
import PrimaryButton from '../buttons/PrimaryButton';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MonthlyPricing from "/imports/api/monthlyPricing/fields.js";
import School from '/imports/api/school/fields.js'
import ClearIcon from 'material-ui-icons/Clear';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import styled from 'styled-components';
import { createContainer } from "meteor/react-meteor-data";
import { MuiThemeProvider } from 'material-ui/styles';
import IconInput from '../form/IconInput.jsx';
import * as helpers from '../jss/helpers.js';
import { normalizeMonthlyPricingData } from "/imports/util";
import muiTheme from '../jss/muitheme.jsx';
import { ContainerLoader } from '/imports/ui/loading/container';
import ClassTimeButton from "/imports/ui/components/landing/components/buttons/ClassTimeButton.jsx";
import Checkbox from "material-ui/Checkbox";
import { FormControl, FormControlLabel } from "material-ui/Form";
import Cart from "/imports/ui/components/landing/components/icons/Cart.jsx";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import { maximumClasses } from '/imports/util';
const Wrapper = styled.div`
  ${helpers.flexCenter} justify-content: space-between;

  @media screen and (max-width: ${helpers.mobile}px) {
    flex-direction: column;
  }
`;

const OuterWrapper = styled.div`
  ${props => (props.forIframes ? `box-shadow: ${helpers.inputBoxShadow}` : "")};
  padding: ${helpers.rhythmDiv * 2}px ${helpers.rhythmDiv * 3}px;
  padding-right: ${helpers.rhythmDiv * 2}px;
  width: 100%;
  color: ${helpers.textColor};
  z-index: 1;
  position: relative;
  margin: 5px 0px 13px 0px;

  @media screen and (max-width: ${helpers.mobile}px) {
    border-radius: ${helpers.rhythmDiv}px;

    max-width: 320px;
    width: 100%;
    margin: 0 auto;
  }

  &:after {
    content: "";
    position: absolute;
    z-index: -1;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: ${props => (props.forIframes ? props.bgColor : "white")};
    opacity: ${props => (props.forIframes ? 0.1 : 1)};
    border-radius: ${helpers.rhythmDiv * 6}px;
  }
`;
const MonthlyPackageBackground = styled.div`
background-color: #f5f5f5;
`;
const Title = styled.h3`
  font-size: 12px;
  font-family: ${helpers.commonFont};
  letter-spacing: 2px;
  font-weight: 700;
  text-transform: uppercase;
  margin: 0;
  color: rgba(0, 0, 0, 1);
  line-height: 1.2;

  @media screen and (max-width: ${helpers.mobile}px) {
    text-align: center;
  }
`;
const TitleForPackageType = styled.h2`
  font-family: ${helpers.specialFont};
  font-weight: 300;
  text-align: center;
  font-style: italic;
  line-height: 1;
  font-size: ${helpers.baseFontSize * 1.5}px;
  margin: 0;
  margin-bottom: ${helpers.rhythmDiv * 4}px;
  color: ${helpers.textColor};
  width: 100%;
`;
const Body = styled.section`
  padding: ${helpers.rhythmDiv}px;
`;

const ClassDetailsSection = styled.div`
  ${helpers.flexDirectionColumn} max-width: 65%;
  padding-right: ${helpers.rhythmDiv}px;

  @media screen and (max-width: ${helpers.mobile}px) {
    max-width: 100%;
  }
`;

const ClassDetailsText = styled.p`
  margin: 0;
  font-size: 14px;
  font-family: ${helpers.specialFont};
  font-weight: 400;
  line-height: 1;
  text-transform: capitalize;

  @media screen and (max-width: ${helpers.mobile}px) {
    text-align: center;
    margin-bottom: ${helpers.rhythmDiv}px;
  }
`;

const PriceSection = styled.div`
  ${helpers.flexDirectionColumn} margin: 0;
  padding-right: ${helpers.rhythmDiv}px;
  padding-bottom: ${helpers.rhythmDiv / 2}px;
  text-align: center;
`;

const Price = styled.p`
  margin: 0;
  font-family: ${helpers.specialFont};
  font-weight: 300;
  color: ${helpers.primaryColor};
  font-size: 28px;
  line-height: 1;
`;

const NoOfClasses = styled.p`
  font-style: italic;
  font-family: ${helpers.specialFont};
  font-weight: 400;
  font-size: 14px;
  margin: 0;
  line-height: 1;
`;
const CenterConnect = styled.div`
display: flex;
justify-content: space-around;
`;
const AddToCartSection = styled.div`
  margin-left: ${helpers.rhythmDiv * 2}px;
  cursor: pointer;
`;

const RightSection = styled.div`
  ${helpers.flexCenter};
`;
const DialogTitleWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  width: 100%;
`;


const SinglePackage = styled.div`
border: 2px solid black;
border-radius: 10px;
margin-bottom: 5px;
padding: 5px;
`;

const styles = {
  dialogAction: {
    width: '100%'
  }
}


class PackageListingAttachment extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initializeFields();
  }
  initializeFields = () => {
    let state = {
      packageSelect: {},
      isBusy: this.props.isBusy
    }
    return { ...state }
  }
  packageListing = (monthlyPackageData) => {
    if (!isEmpty(monthlyPackageData)) {
      return monthlyPackageData.map((current, index) => {
        return (<Fragment>
          <SinglePackage>
            <FormControl fullWidth margin="dense">

              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.packageSelect[current._id].checked}
                    onChange={() => {
                      let packageSelect = this.state.packageSelect;

                      this.setState({ packageSelect })
                    }}
                    value="closed"
                  />
                }
                label={current.packageName}
              />
            </FormControl>
          </SinglePackage>
        </Fragment>)
      })
    }
  }
  getPaymentType = (payment) => {
    let paymentType = "";
    if (payment) {
      if (payment["autoWithDraw"] && payment["payAsYouGo"]) {
        paymentType += "Automatic Withdrawal and Pay As You Go";
      } else if (payment["autoWithDraw"]) {
        paymentType += "Automatic Withdrawal";
      } else if (payment["payAsYouGo"]) {
        paymentType += "Pay As You Go";
      } else if (payment["payUpFront"]) {
        paymentType += "Pay Up Front";
      }
    }
    return paymentType;
  }
  getCovers = (data) => {
    let str = "";
    if (!isEmpty(data)) {
      str = data.map(classType => classType.name);
      str = str.join(", ");
    }
    return str.toLowerCase();
  }
  onConnect = () => {
    //get selectedPackages in object form
    let finalSelectedPackages = [], finalDiselectedPackages = [];
    let packageSelect = this.state.packageSelect;
    let classTypeId = this.props.classTypeId;
    Object.keys(packageSelect).length ? Object.keys(packageSelect).forEach(function (key, id) {
      if (packageSelect[key]) {

        finalSelectedPackages.push(key);
      }
      else {
        finalDiselectedPackages.push(key)
      }
    }) : "";
    let selectedIds = uniq(finalSelectedPackages);
    let diselectedIds = uniq(finalDiselectedPackages);
    this.setState({ isBusy: true })
    Meteor.call("monthlyPricing.addClasstypes", { classTypeId, selectedIds, diselectedIds }, (err, res) => {
      if (res) {
        this.setState({ isBusy: false })
        this.props.classTimeFormOnClose()
      }
    })
  }
  checkboxChecker = (value, props, index) => {
    if (value == undefined) {
      if (props.classTypeId.includes(this.props.classTypeId)) {
        let packageSelect = this.state.packageSelect;
        packageSelect[props._id] = true;
        this.setState({ packageSelect })
        return true
      }
      else {
        let packageSelect = this.state.packageSelect;
        packageSelect[props._id] = false;
        this.setState({ packageSelect })
        return false

      }
    }
    return value;
  }
  Package = (props, index) => (
    <OuterWrapper forIframes={props.forIframes} bgColor={props.bgColor} key={index}>
      <Wrapper>

        <ClassDetailsSection>
          <Title>{props.packageName || props.name}</Title>
          {props.packageType !== "EP" && (
            <Fragment>
              {props.classPackages ? (
                <ClassDetailsText>
                  Expiration:{" "}
                  {props.expDuration && props.expPeriod
                    ? `${props.expDuration} ${props.expPeriod}`
                    : "None"}
                </ClassDetailsText>
              ) : (
                  <Fragment>
                    <ClassDetailsText>{props.pymtMethod || "NA"}</ClassDetailsText>
                    <ClassDetailsText>
                      {this.getPaymentType(props.pymtType) || "NA"}
                    </ClassDetailsText>
                  </Fragment>
                )}
            </Fragment>
          )}
          <ClassDetailsText>
            Covers: {this.getCovers(props.selectedClassType)}
          </ClassDetailsText>
          {props.packageType == 'MP' && <ClassDetailsText>
            Maximum Classes: {maximumClasses(props)}
          </ClassDetailsText>
          }

        </ClassDetailsSection>

        <RightSection>
          {props.packageType !== "EP" ? (
            <Fragment>
              {props.classPackages ? (
                <PriceSection>
                  <Price>
                    {props.cost &&
                      `${props.cost}${
                      props.currency ? props.currency : props.schoolCurrency
                      }`}
                  </Price>
                  <NoOfClasses>
                    {props.noClasses && `for ${props.noClasses} classes`}
                  </NoOfClasses>
                </PriceSection>
              ) : (
                  !isEmpty(props.pymtDetails) &&
                  props.pymtDetails.map((payment, index) => {
                    return (
                      <PriceSection key={`${payment.cost}-${index}`}>
                        <Price>
                          {payment.cost &&
                            `${payment.cost}${
                            payment.currency
                              ? payment.currency
                              : props.schoolCurrency
                            }`}
                        </Price>
                        <NoOfClasses>
                          {payment.month && `per month for ${payment.month} months`}
                        </NoOfClasses>
                      </PriceSection>
                    );
                  })
                )}
            </Fragment>
          ) : (
              <PriceSection>
                {" "}
                {/* used for enrollment packages */}
                <Price>
                  {props.cost &&
                    `${props.cost}${
                    props.currency ? props.currency : props.schoolCurrency
                    }`}
                </Price>
                <NoOfClasses>{props.cost && "For Enrollment"}</NoOfClasses>
              </PriceSection>
            )}
          <FormControl margin="dense">
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.checkboxChecker(this.state.packageSelect[props._id], props, index)}
                  onChange={() => {
                    let packageSelect = this.state.packageSelect;
                    packageSelect[props._id] = !this.state.packageSelect[props._id];
                    this.setState({ packageSelect })
                  }}
                  value="closed"
                />
              }
            />
          </FormControl>

        </RightSection>
      </Wrapper>
    </OuterWrapper>
  );

  render() {
    let { monthlyPackageData, schoolData } = this.props;
    monthlyPackageData = normalizeMonthlyPricingData(monthlyPackageData);
    return (
      <MuiThemeProvider theme={muiTheme}>
        <Dialog
          title="Package Listing"
          open={this.props.open}
          onClose={this.props.onModalClose}
          onRequestClose={this.props.onModalClose}
          aria-labelledby="Package Listing"
        >
          {this.props.isLoading && <ContainerLoader />}
          <DialogTitle>
            <DialogTitleWrapper>
              Connect To Packages
           <IconButton color="primary" onClick={() => { this.props.onClose() }}>
                <ClearIcon />
              </IconButton >
            </DialogTitleWrapper>
          </DialogTitle>
          <DialogContent>
            <MonthlyPackageBackground>
              <TitleForPackageType>Monthly Packages</TitleForPackageType>
              {!isEmpty(monthlyPackageData) && monthlyPackageData.map((current, index) => {
                current.schoolCurrency = schoolData && schoolData.currency ? schoolData.currency : config.defaultCurrency;
                return this.Package(current, index)
              })}
            </MonthlyPackageBackground>
          </DialogContent>
          <DialogActions classes={{ action: this.props.classes.dialogAction }}>
            <CenterConnect>
              <ClassTimeButton
                noMarginBottom
                label="Connect"
                onClick={() => { this.onConnect() }}
              />
            </CenterConnect>
          </DialogActions>

        </Dialog>
      </MuiThemeProvider>
    )
  }
}

export default createContainer(props => {
  const { schoolId } = props;
  let monthlyPackageData = [], monthlySubscription, schoolDataSubscription, schoolData, isBusy = true;
  monthlySubscription = Meteor.subscribe("monthlyPricing.getMonthlyPricing", { schoolId });
  schoolDataSubscription = Meteor.subscribe("school.getSchoolBySchoolId", schoolId)
  if (schoolDataSubscription && schoolDataSubscription.ready()) {
    schoolData = School.findOne()

  }
  if (monthlySubscription && monthlySubscription.ready()) {
    monthlyPackageData = MonthlyPricing.find().fetch();
    isBusy = false;
  }
  return {
    ...props,
    schoolData,
    monthlyPackageData,
    isBusy
  };
}, withStyles(styles)(PackageListingAttachment));