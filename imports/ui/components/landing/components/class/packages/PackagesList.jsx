import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Package from './Package';

import PackageStructure from '../../../constants/structure/package.js';

import * as helpers from '../../jss/helpers.js';

const Wrapper = styled.div`
  width: 100%;
  ${helpers.flexCenter}
  align-items: stretch;

  @media screen and (max-width: ${helpers.tablet}px) {
    ${helpers.flexDirectionColumn}
  }
`;

const PackagesListWrapper = styled.section`
  ${helpers.flexDirectionColumn}
  width: 50%;
  position: relative;
  align-items: ${props => props.classPackages ? 'flex-end' : 'flex-start'};
  padding: ${helpers.rhythmDiv * 4}px 0;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    z-index: -1;
    background-color: ${props => props.classPackages ? helpers.primaryColor : helpers.panelColor};
    opacity: ${props => props.classPackages ? 0.1 : 1};
  }

  @media screen and (max-width: ${helpers.tablet}px) {
    width: 100%;
    align-items: center;
  }
`;


const PackageWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv * 2}px;
  width: 100%;
`;

const PackagesWrapper = styled.div`
  max-width: 500px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: ${props => props.classPackages ? 'flex-end' : 'flex-start'};
  padding: 0 ${helpers.rhythmDiv * 2}px;

  @media screen and (max-width: ${helpers.tablet + 100}px) {
    max-width: 100%;
    padding: ${helpers.rhythmDiv}px;
    align-items: center;
  }

  @media screen and (max-width: ${helpers.tablet}px) {
    max-width: 500px;
    width: 100%;
  }

  @media screen and (max-width: ${helpers.mobile}px) {
  }

`;

const Title = styled.h1`
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

const PackageList = (props) => (
  <PackagesListWrapper classPackages={props.classPackages}>
    <PackagesWrapper classPackages={props.classPackages}>
      <Title>{props.packageListName}</Title>
      {console.log(props,"packages list....")}
      {props.packagesData && props.packagesData.map(packageData => (
        <PackageWrapper key={packageData._id}>
          <Package {...packageData} />
        </PackageWrapper>
      ))}
    </PackagesWrapper>
  </PackagesListWrapper>
);

const PackagesList = (props) => {
  return (
    <Wrapper>

      <PackageList
        classPackages
        packageListName='Class Packages'
        packagesData={props.perClassPackagesData} />

      <PackageList
        packageListName='Monthly Packages'
        packagesData={props.monthlyPackagesData} />
    </Wrapper>
  )
}

PackagesList.propTypes = {
  perClassPackagesData: PropTypes.arrayOf(PackageStructure),
  monthlyPackagesData: PropTypes.arrayOf(PackageStructure),
}

export default PackagesList;