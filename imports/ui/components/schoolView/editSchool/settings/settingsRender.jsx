import React, { Fragment } from "react";
import styled from "styled-components";
import FormGhostButton from "/imports/ui/components/landing/components/buttons/FormGhostButton.jsx";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 30px;
  box-shadow: 4px 6px 2px 1px rgba(0, 0, 255, 0.2);
  background-color: lavender;
  align-items: center;
  padding: 4px 12px 4px 1px;
`;
const Text = styled.div`
  font-size: x-large;
  font-style: italic;
  font-weight: 400;
  margin-right: 20px;
  padding: 1px 1px 1px 12px;
`;
const ButtonWrapper= styled.div`
    min-width: 166px
`;


export const settingsRender = function () {
    const { status } = this.state;
    return (
        <Fragment>
            <Container>
                <Text>
                    {status ? `Already Connected to Stripe.` : `Connect your Stripe Account to SkillShape.`}
                </Text>
                <ButtonWrapper>
                <FormGhostButton
                    fullWidth
                    alertColor={status}
                    onClick={this.handleStripeButtonClick}
                    label={status ? 'Disconnect Stripe' : 'Connect Stripe'}
                />
                </ButtonWrapper>
            </Container>
            <Container>
                <Text>
                This will delete all Location, Class, Packages, and Member data and cannot be undone.
                </Text>
                <ButtonWrapper>
                <FormGhostButton
                    alertColor
                    fullWidth
                    onClick={this.handleDeleteButtonClick}
                    label={"Delete School"}
                />
                </ButtonWrapper>
            </Container>
        </Fragment>
    );
}