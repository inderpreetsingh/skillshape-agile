import styled from "styled-components";
import React, { Fragment } from "react";
import ReactSelect from "react-select";
import Grid from "material-ui/Grid";
import TextField from "material-ui/TextField";

import { Text } from '/imports/ui/components/landing/components/jss/sharedStyledComponents.js';
import { rhythmDiv, commonFont } from '/imports/ui/components/landing/components/jss/helpers.js';

const Wrapper = styled.div`
    margin-bottom: ${rhythmDiv}px;
`;

const ControlsRow = styled.div`
    display: flex;
    align-items: flex-end;
    margin-bottom: ${rhythmDiv}px;
`;

const Control = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 300px;
    width: 100%;
    margin-right: ${rhythmDiv * 2}px;
`;

const ControlLabel = Text.extend`
    font-family: ${commonFont}
`;

const customStyle = {
    marginTop: rhythmDiv,
    marginBottom: rhythmDiv,
}
export const filterForTransaction = function () {
    const { selectedPackageType, packageTypeOptions,
        selectedPackageStatus, packageStatusOptions,
        packageName, selectedPaymentMethod,
        paymentMethodsOptions, selectedTransactionType, transactionTypeOptions } = this.state;
    const { classes } = this.props;
    return (
        <Wrapper>
            <ControlsRow>
                <Control>
                    <ControlLabel>Transaction Type: </ControlLabel>
                    <ReactSelect
                        name="filters"
                        placeholder={<b>Transaction Type</b>}
                        value={selectedTransactionType}
                        options={transactionTypeOptions}
                        onChange={(data) => { this.handleFilter(data, 'transactionType', 'selectedTransactionType') }}
                        closeMenuOnSelect={false}
                        clearable={false}
                    />
                </Control>

                <Control>
                    <ControlLabel>Payment Method: </ControlLabel>
                    <ReactSelect
                        name="filters"
                        placeholder={<b>Payment Method</b>}
                        value={selectedPaymentMethod}
                        options={paymentMethodsOptions}
                        onChange={(data) => { this.handleFilter(data, 'paymentMethod', 'selectedPaymentMethod') }}
                        closeMenuOnSelect={false}
                        clearable={false}
                    />
                </Control>
            </ControlsRow>

            <ControlLabel>Filter By Package: </ControlLabel>
            <ControlsRow>
                <Control>
                    <TextField
                        defaultValue={''}
                        value={packageName}
                        label="Package Name"
                        type="text"
                        onChange={(e) => { this.handleFilter(e, 'packageName', 'packageName') }}
                    />
                </Control>

                <Control>
                    <ReactSelect
                        name="filters"
                        placeholder={<b>Package Type</b>}
                        value={selectedPackageType}
                        options={packageTypeOptions}
                        onChange={(data) => { this.handleFilter(data, 'packageType', 'selectedPackageType') }}
                        closeMenuOnSelect={false}
                        clearable={false}
                    />
                </Control>

                <Control>
                    <ReactSelect
                        name="filters"
                        placeholder={<b>Package Status</b>}
                        value={selectedPackageStatus}
                        options={packageStatusOptions}
                        onChange={(data) => { this.handleFilter(data, 'packageStatus', 'selectedPackageStatus') }}
                        closeMenuOnSelect={false}
                        clearable={false}
                    />
                </Control>
            </ControlsRow>
        </Wrapper>
    );
}