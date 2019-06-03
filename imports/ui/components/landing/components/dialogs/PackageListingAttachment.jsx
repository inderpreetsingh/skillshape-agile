import isEmpty from 'lodash/isEmpty';
import uniq from 'lodash/uniq';
import ClearIcon from 'material-ui-icons/Clear';
import Checkbox from 'material-ui/Checkbox';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import { FormControl, FormControlLabel } from 'material-ui/Form';
import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';
import { MuiThemeProvider, withStyles } from 'material-ui/styles';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import muiTheme from '../jss/muitheme';
import ClassPricing from '/imports/api/classPricing/fields';
import EnrollmentFees from '/imports/api/enrollmentFee/fields';
import MonthlyPricing from '/imports/api/monthlyPricing/fields';
import School from '/imports/api/school/fields';
import FormGhostButton from '/imports/ui/components/landing/components/buttons/FormGhostButton';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers';
import { ContainerLoader } from '/imports/ui/loading/container';
import { formatMoney, maximumClasses, normalizeMonthlyPricingData } from '/imports/util';

const ButtonWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv}px;
`;
const Wrapper = styled.div`
  ${helpers.flexCenter} justify-content: space-between;

  @media screen and (max-width: ${helpers.mobile}px) {
    flex-direction: column;
  }
`;

const OuterWrapper = styled.div`
  ${props => (props.forIframes ? `box-shadow: ${helpers.inputBoxShadow}` : '')};
  padding: ${helpers.rhythmDiv * 2}px ${helpers.rhythmDiv * 3}px;
  padding-right: ${helpers.rhythmDiv * 2}px;
  width: 100%;
  color: ${helpers.textColor};
  z-index: 1;
  position: relative;
  margin-bottom: 16px;
  background-color: '#e1e1e1';
  @media screen and (max-width: ${helpers.mobile}px) {
    border-radius: ${helpers.rhythmDiv}px;

    max-width: 320px;
    width: 100%;
    margin: 0 auto;
    margin-bottom: 16px;
  }

  &:after {
    content: '';
    position: absolute;
    z-index: -1;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: ${props => (props.forIframes ? props.bgColor : 'white')};
    opacity: ${props => (props.forIframes ? 0.1 : 1)};
    border-radius: ${helpers.rhythmDiv * 6}px;
  }
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
  margin-bottom: 5px;
  color: ${helpers.textColor};
  width: 100%;
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
  margin-top: '5px';
`;

const SinglePackage = styled.div`
  border: 2px solid black;
  border-radius: 10px;
  margin-bottom: 10px;
  padding: 5px;
`;

const styles = {
  dialogAction: {
    width: '100%',
  },
};

class PackageListingAttachment extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initializeFields();
  }

  initializeFields = () => {
    const state = {
      packageSelect: { MP: {}, EP: {}, CP: {} },
      showConfirmationModal: false,
    };
    return { ...state };
  };

  confirmation = () => {
    const { popUp } = this.props;
    popUp.appear(
      'inform',
      {
        title: 'Confirmation',
        content: 'This will save Class Time and Package details. Are you sure ?',
        onAffirmationButtonClick: this.onConnect,
        defaultButtons: true,
      },
      true,
    );
  };

  packageListing = (monthlyPackageData) => {
    if (!isEmpty(monthlyPackageData)) {
      return monthlyPackageData.map((current, index) => (
        <Fragment>
          <SinglePackage>
            <FormControl fullWidth margin="dense">
              <FormControlLabel
                control={(
                  <Checkbox
                    checked={this.state.packageSelect[current._id].checked}
                    onChange={() => {
                      const { packageSelect } = this.state;

                      this.setState({ packageSelect });
                    }}
                    value="closed"
                  />
)}
                label={current.packageName}
              />
            </FormControl>
          </SinglePackage>
        </Fragment>
      ));
    }
  };

  getPaymentType = (payment) => {
    let paymentType = '';
    if (payment) {
      if (payment.autoWithDraw && payment.payAsYouGo) {
        paymentType += 'Automatic Withdrawal and Pay As You Go';
      } else if (payment.autoWithDraw) {
        paymentType += 'Automatic Withdrawal';
      } else if (payment.payAsYouGo) {
        paymentType += 'Pay As You Go';
      } else if (payment.payUpFront) {
        paymentType += 'Pay Up Front';
      }
    }
    return paymentType;
  };

  getCovers = (data) => {
    let str = '';
    if (!isEmpty(data)) {
      str = data.map(classType => classType.name);
      str = str.join(', ');
    }
    return str.toLowerCase();
  };

  onConnect = () => {
    // get selectedPackages in object form
    const selectedMonthlyPackages = [];
    const unSelectedMonthlyPackages = [];
    const selectedEnrollementPackages = [];
    const unSelectedEnrollmentPackages = [];
    const selectedClassPackages = [];
    const unSelectedClassPackages = [];
    const { packageSelect } = this.state;
    const { classTypeId } = this.props;
    Object.keys(packageSelect).length
      ? Object.keys(packageSelect).forEach((key, id) => {
        if (key == 'MP') {
          Object.keys(packageSelect[key]).length
            ? Object.keys(packageSelect[key]).forEach((key1, id) => {
              if (packageSelect[key][key1]) {
                selectedMonthlyPackages.push(key1);
              } else {
                unSelectedMonthlyPackages.push(key1);
              }
            })
            : '';
        } else if (key == 'EP') {
          Object.keys(packageSelect[key]).length
            ? Object.keys(packageSelect[key]).forEach((key1, id) => {
              if (packageSelect[key][key1]) {
                selectedEnrollementPackages.push(key1);
              } else {
                unSelectedEnrollmentPackages.push(key1);
              }
            })
            : '';
        } else {
          Object.keys(packageSelect[key]).length
            ? Object.keys(packageSelect[key]).forEach((key1, id) => {
              if (packageSelect[key][key1]) {
                selectedClassPackages.push(key1);
              } else {
                unSelectedClassPackages.push(key1);
              }
            })
            : '';
        }
      })
      : '';

    let selectedIds = uniq(selectedMonthlyPackages);
    let diselectedIds = uniq(unSelectedMonthlyPackages);
    if (!isEmpty(selectedIds) || !isEmpty(diselectedIds)) {
      Meteor.call(
        'monthlyPricing.handleClassTypes',
        { classTypeId, selectedIds, diselectedIds },
        (err, res) => {
          if (res) {
          } else {
            console.log('err in monthlyPricing.handleClassTypes client side----->', err);
          }
        },
      );
    }
    selectedIds = uniq(selectedEnrollementPackages);
    diselectedIds = uniq(unSelectedEnrollmentPackages);
    if (!isEmpty(selectedIds) || !isEmpty(diselectedIds)) {
      Meteor.call(
        'enrollmentFee.handleClassTypes',
        { classTypeId, selectedIds, diselectedIds },
        (err, res) => {
          if (res) {
          } else {
            console.log('enrollmentFee.handleClassTypes client side----->', err);
          }
        },
      );
    }
    selectedIds = uniq(selectedClassPackages);
    diselectedIds = uniq(unSelectedClassPackages);
    if (!isEmpty(selectedIds) || !isEmpty(diselectedIds)) {
      Meteor.call(
        'classPricing.handleClassTypes',
        { classTypeId, selectedIds, diselectedIds },
        (err, res) => {
          if (res) {
          } else {
            console.log('classPricing.handleClassTypes client side----->', err);
          }
        },
      );
    }
    const { popUp } = this.props;
    popUp.appear(
      'success',
      {
        title: 'Package Connected Successfully',
        content: 'Packages Successfully connected to this class type.',
        RenderActions: (
          <ButtonWrapper>
            <FormGhostButton onClick={this.props.classTimeFormOnClose} label="Ok" />
          </ButtonWrapper>
        ),
      },
      true,
    );
  };

  checkboxChecker = (value, props) => {
    if (value == undefined) {
      if (props.classTypeId.includes(this.props.classTypeId)) {
        const { packageSelect } = this.state;
        packageSelect[`${props.packageType}`][`${props._id}`] = true;
        this.setState({ packageSelect });
        return true;
      }
      const { packageSelect } = this.state;
      packageSelect[`${props.packageType}`][`${props._id}`] = false;
      this.setState({ packageSelect });
      return false;
    }
    return value;
  };

  Package = (props, index) => (
    <OuterWrapper forIframes={props.forIframes} bgColor={props.bgColor} key={index}>
      <Wrapper>
        <ClassDetailsSection>
          <Title>{props.packageName || props.name}</Title>
          {props.packageType !== 'EP' && (
            <Fragment>
              {props.classPackages ? (
                <ClassDetailsText>
                  Expiration:
                  {' '}
                  {props.expDuration && props.expPeriod
                    ? `${props.expDuration} ${props.expPeriod}`
                    : 'None'}
                </ClassDetailsText>
              ) : (
                <Fragment>
                  <ClassDetailsText>{props.pymtMethod || 'NA'}</ClassDetailsText>
                  <ClassDetailsText>{this.getPaymentType(props.pymtType) || 'NA'}</ClassDetailsText>
                </Fragment>
              )}
            </Fragment>
          )}
          <ClassDetailsText>
Covers:
            {this.getCovers(props.selectedClassType)}
          </ClassDetailsText>
          {props.packageType == 'MP' && (
            <ClassDetailsText>
Maximum Classes:
              {maximumClasses(props)}
            </ClassDetailsText>
          )}
        </ClassDetailsSection>

        <RightSection>
          {props.packageType !== 'EP' ? (
            <Fragment>
              {props.classPackages ? (
                <PriceSection>
                  <Price>
                    {props.cost
                      && `${formatMoney(
                        Number.parseFloat(props.cost).toFixed(2),
                        props.currency ? props.currency : props.schoolCurrency,
                      )}`}
                  </Price>
                  <NoOfClasses>{props.noClasses && `for ${props.noClasses} classes`}</NoOfClasses>
                </PriceSection>
              ) : (
                !isEmpty(props.pymtDetails)
                && props.pymtDetails.map((payment, index) => (
                  <PriceSection key={`${payment.cost}-${index}`}>
                    <Price>
                      {payment.cost
                          && `${formatMoney(
                            Number.parseFloat(payment.cost).toFixed(2),
                            payment.currency ? payment.currency : props.schoolCurrency,
                          )}`}
                    </Price>
                    <NoOfClasses>
                      {payment.month && `per month for ${payment.month} months`}
                    </NoOfClasses>
                  </PriceSection>
                ))
              )}
            </Fragment>
          ) : (
            <PriceSection>
              {' '}
              {/* used for enrollment packages */}
              <Price>
                {props.cost
                  && `${formatMoney(
                    Number.parseFloat(props.cost).toFixed(2),
                    props.currency ? props.currency : props.schoolCurrency,
                  )}`}
              </Price>
              <NoOfClasses>{props.cost && 'For Enrollment'}</NoOfClasses>
            </PriceSection>
          )}
          <FormControl margin="dense">
            <FormControlLabel
              control={(
                <Checkbox
                  checked={this.checkboxChecker(
                    this.state.packageSelect[`${props.packageType}`][`${props._id}`],
                    props,
                  )}
                  onChange={() => {
                    const { packageSelect } = this.state;
                    packageSelect[`${props.packageType}`][`${props._id}`] = !this.state
                      .packageSelect[`${props.packageType}`][props._id];
                    // packageSelect[props._id] = !this.state.packageSelect[props._id];
                    this.setState({ packageSelect });
                  }}
                  value="closed"
                />
)}
            />
          </FormControl>
        </RightSection>
      </Wrapper>
    </OuterWrapper>
  );

  render() {
    let {
      monthlyPackageData, schoolData, enrollmentFee, perClass,
    } = this.props;
    monthlyPackageData = normalizeMonthlyPricingData(monthlyPackageData);
    let noPackage = false;
    noPackage = isEmpty(monthlyPackageData) && isEmpty(enrollmentFee) && isEmpty(perClass);
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
          <DialogTitle style={{ backgroundColor: '#e1e1e1' }}>
            <DialogTitleWrapper>
              {noPackage && !isLoading ? (
                <TitleForPackageType>
                  No Packages Available Yet. Please create new Packages first.
                </TitleForPackageType>
              ) : (
                <TitleForPackageType>Connect To Packages</TitleForPackageType>
              )}
              <IconButton
                color="primary"
                onClick={() => {
                  this.props.onClose();
                }}
              >
                <ClearIcon />
              </IconButton>
            </DialogTitleWrapper>
          </DialogTitle>

          <DialogContent style={{ backgroundColor: '#e1e1e1' }}>
            {!isEmpty(monthlyPackageData) && (
              <div>
                {' '}
                <TitleForPackageType>Monthly Packages</TitleForPackageType>
                {monthlyPackageData.map((current, index) => {
                  current.schoolCurrency = schoolData && schoolData.currency
                    ? schoolData.currency
                    : config.defaultCurrency;
                  current.packageType = 'MP';
                  return this.Package(current, index);
                })}
              </div>
            )}
            {!isEmpty(enrollmentFee) && (
              <div>
                <TitleForPackageType>Enrollment Packages</TitleForPackageType>
                {enrollmentFee.map((current, index) => {
                  current.schoolCurrency = schoolData && schoolData.currency
                    ? schoolData.currency
                    : config.defaultCurrency;
                  current.packageType = 'EP';
                  return this.Package(current, index);
                })}
              </div>
            )}
            {!isEmpty(perClass) && (
              <div>
                <TitleForPackageType>Class Packages</TitleForPackageType>
                {perClass.map((current, index) => {
                  current.schoolCurrency = schoolData && schoolData.currency
                    ? schoolData.currency
                    : config.defaultCurrency;
                  current.packageType = 'CP';
                  current.classPackages = true;
                  return this.Package(current, index);
                })}
              </div>
            )}
          </DialogContent>
          <DialogActions
            classes={{ action: this.props.classes.dialogAction }}
            style={{ backgroundColor: '#e1e1e1', margin: '0px 0px' }}
          >
            <CenterConnect>
              {/* <ClassTimeButton
                noMarginBottom
                label="Connect"
                onClick={() => { this.setState({ showConfirmationModal: true }) }}
              /> */}
              {!noPackage && (
                <Grid style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <ButtonWrapper>
                    <FormGhostButton onClick={this.confirmation} label="Connect" />
                  </ButtonWrapper>
                </Grid>
              )}
            </CenterConnect>
          </DialogActions>
        </Dialog>
      </MuiThemeProvider>
    );
  }
}

export default createContainer((props) => {
  const { schoolId } = props;
  isLoading = true;
  let monthlyPackageData = [];
  let monthlySubscription;
  let schoolDataSubscription;
  let schoolData;
  const isBusy = true;
  let enrollmentFee = [];
  let enrollmentSubscription;
  let classPricingSubscription;
  let perClass = [];
  monthlySubscription = Meteor.subscribe('monthlyPricing.getMonthlyPricing', { schoolId });
  schoolDataSubscription = Meteor.subscribe('school.getSchoolBySchoolId', schoolId);
  enrollmentSubscription = Meteor.subscribe('enrollmentFee.getEnrollmentFee', { schoolId });
  classPricingSubscription = Meteor.subscribe('classPricing.getClassPricing', { schoolId });
  const subscriptionChecks = schoolDataSubscription
    && schoolDataSubscription.ready()
    && monthlySubscription
    && monthlySubscription.ready()
    && enrollmentSubscription
    && enrollmentSubscription.ready()
    && classPricingSubscription
    && classPricingSubscription.ready();
  if (subscriptionChecks) {
    schoolData = School.findOne();

    monthlyPackageData = MonthlyPricing.find().fetch();

    enrollmentFee = EnrollmentFees.find({ schoolId }).fetch();

    perClass = ClassPricing.find({ schoolId }).fetch();
    isLoading = false;
  }

  return {
    ...props,
    schoolData,
    monthlyPackageData,
    enrollmentFee,
    perClass,
    isLoading,
  };
}, withStyles(styles)(PackageListingAttachment));
