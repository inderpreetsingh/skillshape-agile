import styled from "styled-components";
import React, { Fragment } from "react";
import ReactSelect from "react-select";
import Grid from "material-ui/Grid";
import { withStyles } from 'material-ui/styles';
import TextField from "material-ui/TextField";

import { IconSelect } from '/imports/ui/components/landing/components/form/';
import { Text } from '/imports/ui/components/landing/components/jss/sharedStyledComponents.js';
import { rhythmDiv, commonFont, mobile } from '/imports/ui/components/landing/components/jss/helpers.js';

const Wrapper = styled.div`
    margin-bottom: ${rhythmDiv * 4}px;
`;

const ControlsRow = styled.div`
    display: flex;
    align-items: flex-end;
    margin-bottom: ${rhythmDiv * 2}px;

    @media screen and (max-width: ${mobile}px) {
        flex-direction: column;
    }
`;

const Control = styled.div`
    display: flex;
    flex-direction: column;
    max-width: ${props => props.maxWidth || 300}px;
    width: 100%;
    margin-right: ${rhythmDiv * 2}px;

    @media screen and (max-width: ${mobile}px) {
        max-width: 100%;
        margin-bottom: ${rhythmDiv}px;
        margin-right: 0;
    }
`;

const ControlLabel = Text.extend`
    font-family: ${commonFont}
`;

const customStyle = {
    marginTop: rhythmDiv,
    marginBottom: rhythmDiv,
}

const textFieldStyles = {
    root: {
        height: 36,
    },
    textFieldInput: {
        transform: `translateY(-8px)`,
    },
    cssLabel: {
        transform: `translate(0, 8px)`,
    },
    cssFocused: {
        transform: `translate(0, -12.5px)`,
        transform: `scale(0.75)`
    }
}

const StyledTextField = withStyles(textFieldStyles)(props => (
    <TextField
        {...props}
        classes={{
            root: props.classes.root
        }}
        InputLabelProps={{
            classes: {
                root: props.classes.cssLabel,
                shrink: props.classes.cssFocused,
            },
        }}
        InputProps={{
            classes: {
                input: props.classes.textFieldInput
            },
        }}
    />
))

export const filterForTransaction = function () {
    const { selectedPackageType, packageTypeOptions,
        selectedPackageStatus, packageStatusOptions,
        packageName, selectedPaymentMethod,
        paymentMethodsOptions, selectedTransactionType, transactionTypeOptions } = this.state;
    const { classes } = this.props;
    return (
        <Wrapper>
            <ControlsRow>
                <Control className="ss-multi-select ss-select">
                    <ControlLabel>Transaction Type: </ControlLabel>
                    {/*<ReactSelect
                        name="filters"
                        placeholder={<b>Transaction Type</b>}
                        value={selectedTransactionType}
                        options={transactionTypeOptions}
                        onChange={(data) => { this.handleFilter(data, 'transactionType', 'selectedTransactionType') }}
                        closeMenuOnSelect={false}
                        clearable={false}
                    /> */}

                    <IconSelect
                        labelText='Transaction Type'
                        value={selectedTransactionType}
                        options={transactionTypeOptions}
                        inputProps={{
                            name: 'transactionType',
                            id: 'transactionType'
                        }}
                        onChange={(data) => {
                            //console.log(data, ".....")
                            this.handleFilter(data, 'transactionType', 'selectedTransactionType')
                        }}
                    />
                </Control>

                <Control className="ss-multi-select ss-select">
                    <IconSelect
                        labelText='Payment Method'
                        value={selectedPaymentMethod}
                        options={paymentMethodsOptions}
                        inputProps={{
                            name: 'paymentMethod',
                            id: 'paymentMethod'
                        }}
                        onChange={(data) => {
                            //console.log(data, ".....")
                            this.handleFilter(data, 'paymentMethod', 'selectedPaymentMethod')
                        }}
                    />

                    {/*<ControlLabel>Payment Method: </ControlLabel>
                    <ReactSelect
                        name="filters"
                        placeholder={<b>Payment Method</b>}
                        value={selectedPaymentMethod}
                        options={paymentMethodsOptions}
                        onChange={(data) => { this.handleFilter(data, 'paymentMethod', 'selectedPaymentMethod') }}
                        closeMenuOnSelect={false}
                        clearable={false}
                    />*/}
                </Control>
            </ControlsRow>

            <ControlLabel>Filter By Package: </ControlLabel>
            <ControlsRow >
                <Control maxWidth={250}>
                    <StyledTextField
                        defaultValue={''}
                        value={packageName}
                        label="Package Name"
                        type="text"
                        onChange={(e) => { this.handleFilter(e, 'packageName', 'packageName') }}
                    />
                </Control>

                <Control className="ss-multi-select ss-select" maxWidth={250}>
                    {/*<ReactSelect
                        name="filters"
                        placeholder={<b>Package Type</b>}
                        value={selectedPackageType}
                        options={packageTypeOptions}
                        onChange={(data) => {
                            this.handleFilter(data, 'packageType', 'selectedPackageType')
                        }}
                        closeMenuOnSelect={false}
                        clearable={false}
                    />*/}

                    <IconSelect
                        labelText='Package Type'
                        value={selectedPackageType}
                        options={packageTypeOptions}
                        inputProps={{
                            name: 'packageType',
                            id: 'packageType'
                        }}
                        onChange={(data) => {
                            //console.log(data, ".....")
                            this.handleFilter(data, 'packageType', 'selectedPackageType')
                        }}
                    />
                </Control>

                <Control className="ss-multi-select ss-select" maxWidth={250}>
                    {/*<ReactSelect
                        name="filters"
                        placeholder={<b>Package Status</b>}
                        value={selectedPackageStatus}
                        options={packageStatusOptions}
                        onChange={(data) => { this.handleFilter(data, 'packageStatus', 'selectedPackageStatus') }}
                        closeMenuOnSelect={false}
                        clearable={false}
                    />*/}

                    <IconSelect
                        labelText='Package Status'
                        value={selectedPackageStatus}
                        options={packageStatusOptions}
                        inputProps={{
                            name: 'packageStatus',
                            id: 'packageStatus'
                        }}
                        onChange={(data) => {
                            //console.log(data, ".....")
                            this.handleFilter(data, 'packageStatus', 'selectedPackageStatus')
                        }}
                    />
                </Control>
            </ControlsRow>
        </Wrapper>
    );
}