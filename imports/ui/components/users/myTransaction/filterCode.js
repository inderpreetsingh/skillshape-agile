import styled from "styled-components";
import React, { Fragment} from "react";
import ReactSelect from "react-select";
import Grid from "material-ui/Grid";
const Wrapper = styled.div`

`;
const customStyle = {
    marginTop: "10px",
    marginBottom: '10px',
  }
export const filterForTransaction = function () {
    const {selectedPackageType,packageTypeOptions,selectedPackageStatus,packageStatusOptions} = this.state;
    return (
        <Wrapper>
            <Grid container spacing={24}>
        <Grid item xs={6} sm={3}>
        <ReactSelect
                    name="filters"
                    style={customStyle}
                    placeholder={<b>Package Type</b>}
                    value={selectedPackageType}
                    options={packageTypeOptions}
                    onChange={(data)=>{this.handleFilter(data,'packageType','selectedPackageType')}}
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
                    onChange={(data)=>{this.handleFilter(data,'packageStatus','selectedPackageStatus')}}
                    closeMenuOnSelect={false}
                    clearable={false}
                  />
        </Grid>
        </Grid>
           
        </Wrapper>

    );
}