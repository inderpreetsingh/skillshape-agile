import React, { Fragment } from "react";
import isEmpty from "lodash/isEmpty";
import styled from "styled-components";
import PropTypes from "prop-types";
import Package from "./Package";

import PackageStructure from "../../../constants/structure/package.js";

import * as helpers from "../../jss/helpers.js";

const Wrapper = styled.div`
  width: 100%;
  ${helpers.flexCenter} align-items: stretch;

  @media screen and (max-width: ${helpers.tablet}px) {
    ${helpers.flexDirectionColumn};
  }
`;

const PackagesListWrapper = styled.section`
  ${helpers.flexDirectionColumn} width: 50%;
  position: relative;
  z-index: 1;
  align-items: ${props => (props.classPackages ? "flex-end" : "flex-start")};
  padding: ${helpers.rhythmDiv * 4}px 0;
  ${props => props.fullScreen && `width: 100%; align-items: center`};

  &:after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    z-index: 0;
    background-color: ${props =>
      props.classPackages ? helpers.primaryColor : helpers.panelColor};
    ${props => (props.forIframes ? "background-color: transparent" : "")};
    opacity: ${props => (props.classPackages ? 0.1 : 1)};
  }

  @media screen and (max-width: ${helpers.tablet}px) {
    width: 100%;
    align-items: center;
  }
`;

const EnrollMentListWrapper = PackagesListWrapper.extend`
  width: 100%;
  align-items: center;
  ${props => (props.onPriceEdit && 'flex-direction: row;flex-wrap: wrap;justify-content: space-around;')}
  &:after {
    background-color: #dddd;
    ${props => (props.forIframes ? "background-color: transparent" : "")};
    opacity: 1;
  }
`;

const PackageWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv * 2}px;
  min-width: 500px;
  max-width: 500px;
`;

const PackagesWrapper = styled.div`
  max-width: 500px
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: ${props => (props.classPackages ? "flex-end" : "flex-start")};
  padding: 0 ${helpers.rhythmDiv * 2}px;
  position: relative;
  z-index: 1;
  ${props => (props.onPriceEdit && 'flex-direction: row;flex-wrap: wrap;justify-content: space-around;')}

  @media screen and (max-width: ${helpers.tablet + 100}px) {
  max-width: 500px
    padding: ${helpers.rhythmDiv}px;
    align-items: space-around;
    
  }
`;

const Title = styled.h2`
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

const PackageList = props => (
  <PackagesListWrapper
    forIframes={props.forIframes}
    fullScreen={props.fullScreen}
    classPackages={props.classPackages}
  >
    <PackagesWrapper classPackages={props.classPackages} onPriceEdit={props.onPriceEdit}>
      <Title>{props.packageListName}</Title>
      {props.packagesData.map(packageData => (
        <PackageWrapper key={packageData._id}>
          <Package
            {...packageData}
            {...props.packageProps}
            classPackages={props.classPackages}
            schoolCurrency={props.schoolCurrency}
            onSchoolEdit={props.onSchoolEdit}
            onEditClick={()=>{props.onEditClick()}}
            setFormData={()=>{props.setFormData(packageData)}}
          />
        </PackageWrapper>
      ))}
    </PackagesWrapper>
  </PackagesListWrapper>
);

const EnrollmentPackagesList = props => (
  <EnrollMentListWrapper forIframes={props.forIframes}>
    <PackagesWrapper onPriceEdit={props.onPriceEdit}>

      <Title>{props.packageListName}</Title>
      {props.packagesData.map(packageData => (
        <PackageWrapper key={packageData._id}>
          <Package
            {...packageData}
            {...props.packageProps}
            classPackages={props.classPackages}
            schoolCurrency={props.schoolCurrency}
            onSchoolEdit={props.onSchoolEdit}
            onEditClick={()=>{props.onEditClick()}}
            setFormData={()=>{props.setFormData(packageData)}}

          />
        </PackageWrapper>
      ))}
    </PackagesWrapper>
  </EnrollMentListWrapper>
);

const PackagesList = props => {
  const classPackagesEmpty = isEmpty(props.perClassPackagesData);
  const monthlyPackagesEmpty = isEmpty(props.monthlyPackagesData);
  const enrollMentPackagesEmpty = isEmpty(props.enrollMentPackagesData);
  const schoolCurrency=props.currency;
  return (
    <Fragment>
      {props.enrollMentPackages &&
        !enrollMentPackagesEmpty && (
          <Wrapper>
            <EnrollmentPackagesList
              forIframes={props.forIframes}
              packageProps={{
                bgColor: "#dddd",
                forIframes: props.forIframes,
                packageType: "EP",
                onAddToCartIconButtonClick: props.onAddToCartIconButtonClick,
                schoolId: props.schoolId
              }}
              packageListName="Enrollment Packages"
              packagesData={props.enrollMentPackagesData}
              schoolCurrency={schoolCurrency}
              onSchoolEdit={props.onSchoolEdit}
              onEditClick={()=>{props.onEditClick()}}
              setFormData={(packageData)=>{props.setFormData(packageData)}}
              onPriceEdit={props.onPriceEdit}
            />
          </Wrapper>
        )}
      <Wrapper>
        {!classPackagesEmpty && (
          <PackageList
            forIframes={props.forIframes}
            packageProps={{
              bgColor: helpers.primaryColor,
              forIframes: props.forIframes,
              packageType: "CP",
              onAddToCartIconButtonClick: props.onAddToCartIconButtonClick,
              schoolId: props.schoolId
            }}
            onAddToCartIconButtonClick={props.onAddToCartIconButtonClick}
            classPackages
            fullScreen={monthlyPackagesEmpty}
            packageListName="Class Packages"
            packagesData={props.perClassPackagesData}
            schoolCurrency={schoolCurrency}
            onSchoolEdit={props.onSchoolEdit}
            onEditClick={()=>{props.onEditClick()}}
            setFormData={(packageData)=>{props.setFormData(packageData)}}
            onPriceEdit={props.onPriceEdit}
          />
        )}

        {!monthlyPackagesEmpty && (
          <PackageList
            forIframes={props.forIframes}
            packageProps={{
              bgColor: helpers.primaryColor,
              forIframes: props.forIframes,
              packageType: "MP",
              onAddToCartIconButtonClick: props.onAddToCartIconButtonClick,
              schoolId: props.schoolId
            }}
            packageListName="Monthly Packages"
            fullScreen={classPackagesEmpty}
            packagesData={props.monthlyPackagesData}
            schoolCurrency={schoolCurrency}
            onSchoolEdit={props.onSchoolEdit}
            onEditClick={()=>{props.onEditClick()}}
            setFormData={(packageData)=>{props.setFormData(packageData)}}
            onPriceEdit={props.onPriceEdit}
          />
        )}
      </Wrapper>
    </Fragment>
  );
};

PackagesList.propTypes = {
  perClassPackagesData: PropTypes.arrayOf(PackageStructure),
  monthlyPackagesData: PropTypes.arrayOf(PackageStructure),
  enrollMentPackages: PropTypes.bool,
  forIframes: PropTypes.bool,
  schoolId: PropTypes.string
};

PackagesList.defaultProps = {
  enrollMentPackages: false,
  forIframes: false
};

export default PackagesList;
