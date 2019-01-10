import styled from "styled-components";
import React, { Fragment } from "react";
import ReactSelect from "react-select";
import Grid from "material-ui/Grid";
import TextField from "material-ui/TextField";
const Wrapper = styled.div`

`;
const customStyle = {
    marginTop: "10px",
    marginBottom: '10px',
}
export const filterForTransaction = function () {
    const { selectedPackageType, packageTypeOptions,
         selectedPackageStatus, packageStatusOptions,
         packageName ,selectedPaymentMethod,
         paymentMethodsOptions,selectedTransactionType,transactionTypeOptions} = this.state;
    const {classes} = this.props;
    return (
        <Wrapper>
            <center>
                <Grid container spacing={24} className={classes.rootGrid}>
                <Grid item xs={6} sm={3}>
                <TextField
                    defaultValue={''}
                    value={packageName}
                    margin="dense"
                    label="Package Name"
                    type="text"
                    onChange={(e)=>{this.handleFilter(e, 'packageName', 'packageName')}}
                  />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                        <ReactSelect
                            name="filters"
                            style={customStyle}
                            placeholder={<b>Transaction Type</b>}
                            value={selectedTransactionType}
                            options={transactionTypeOptions}
                            onChange={(data) => { this.handleFilter(data, 'transactionType', 'selectedTransactionType') }}
                            closeMenuOnSelect={false}
                            clearable={false}
                        />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <ReactSelect
                            name="filters"
                            style={customStyle}
                            placeholder={<b>Package Type</b>}
                            value={selectedPackageType}
                            options={packageTypeOptions}
                            onChange={(data) => { this.handleFilter(data, 'packageType', 'selectedPackageType') }}
                            closeMenuOnSelect={false}
                            clearable={false}
                        />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <ReactSelect
                            name="filters"
                            style={customStyle}
                            placeholder={<b>Package Status</b>}
                            value={selectedPackageStatus}
                            options={packageStatusOptions}
                            onChange={(data) => { this.handleFilter(data, 'packageStatus', 'selectedPackageStatus') }}
                            closeMenuOnSelect={false}
                            clearable={false}
                        />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <ReactSelect
                            name="filters"
                            style={customStyle}
                            placeholder={<b>Payment Method</b>}
                            value={selectedPaymentMethod}
                            options={paymentMethodsOptions}
                            onChange={(data) => { this.handleFilter(data, 'paymentMethod', 'selectedPaymentMethod') }}
                            closeMenuOnSelect={false}
                            clearable={false}
                        />
                    </Grid>
                </Grid>
            </center>
        </Wrapper>

    );
}