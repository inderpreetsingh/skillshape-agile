import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import isEmpty from "lodash/isEmpty";
import Cart from "../../icons/Cart.jsx";

import PrimaryButton from "../../buttons/PrimaryButton";

//TODO: Automatic imports depending upon variables used - intellij
import * as helpers from "../../jss/helpers.js";

const Wrapper = styled.div`
  ${helpers.flexCenter} justify-content: space-between;

  @media screen and (max-width: ${helpers.mobile}px) {
    flex-direction: column;
  }
`;

const OuterWrapper = styled.div`
  background-color: white;
  padding: ${helpers.rhythmDiv * 2}px ${helpers.rhythmDiv * 3}px;
  padding-right: ${helpers.rhythmDiv * 2}px;
  border-radius: ${helpers.rhythmDiv * 6}px;
  width: 100%;
  color: ${helpers.textColor};

  @media screen and (max-width: ${helpers.mobile}px) {
    border-radius: ${helpers.rhythmDiv}px;

    max-width: 320px;
    width: 100%;
    margin: 0 auto;
  }
`;

const Title = styled.h2`
  font-size: 12px;
  font-family: ${helpers.commonFont};
  letter-spacing: 2px;
  font-weight: 700;
  text-transform: uppercase;
  margin: 0;
  color: rgba(0, 0, 0, 1);
  line-height: 1;

  @media screen and (max-width: ${helpers.mobile}px) {
    text-align: center;
  }
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

const AddToCartSection = styled.div`
  margin-left: ${helpers.rhythmDiv * 2}px;
  cursor: pointer;
`;

const RightSection = styled.div`
  ${helpers.flexCenter};
`;

function getCovers(data) {
  let str = "";
  if (!isEmpty(data)) {
    str = data.map(classType => classType.name);
    str = str.join(", ");
  }
  return str.toLowerCase();
}

function getPaymentType(payment) {
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

const Package = props => (
  <OuterWrapper>
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
                  {getPaymentType(props.pymtType) || "NA"}
                </ClassDetailsText>
              </Fragment>
            )}
          </Fragment>
        )}
        <ClassDetailsText>
          Covers: {getCovers(props.selectedClassType)}
        </ClassDetailsText>
      </ClassDetailsSection>

      <RightSection>
        {props.packageType !== "EP" ? (
          <Fragment>
            {props.classPackages ? (
              <PriceSection>
                <Price>{props.cost && `${props.cost}$`}</Price>
                <NoOfClasses>
                  {props.noClasses && `for ${props.noClasses} classes`}
                </NoOfClasses>
              </PriceSection>
            ) : (
              !isEmpty(props.pymtDetails) &&
              props.pymtDetails.map((payment, index) => {
                return (
                  <PriceSection key={`${payment.cost}-${index}`}>
                    <Price>{payment.cost && `${payment.cost}$`}</Price>
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
            <Price>{props.cost && `${props.cost}$`}</Price>
            <NoOfClasses>${props.cost && "For Enrollment"}</NoOfClasses>
          </PriceSection>
        )}

        <AddToCartSection>
          {/* <a
            href={`https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${
              Meteor.settings.public.stripeClientId
            }&scope=read_write`}
          > */}
          {console.log("package in package", props)}
          <Cart
            onClick={() =>
              props.onAddToCartIconButtonClick(
                props.packageType,
                props._id,
                props.schoolId,
                props.packageName,
                props.cost,
                props._id,
                props.packageType,
                props.pymtDetails,
                props.expDuration,
                props.expPeriod,
                props.noClasses
              )
            }
          />
          {/* </a> */}
        </AddToCartSection>
      </RightSection>
    </Wrapper>
  </OuterWrapper>
);

Package.propTypes = {
  title: PropTypes.string,
  expiration: PropTypes.string,
  price: PropTypes.string,
  noOfClasses: PropTypes.number,
  classesCovered: PropTypes.string,
  onAddToCartIconButtonClick: PropTypes.func
};

Package.defaultProps = {
  packagePerClass: false,
  onAddToCartIconButtonClick: () => console.log("cart Icon Clicked")
};

export default Package;
