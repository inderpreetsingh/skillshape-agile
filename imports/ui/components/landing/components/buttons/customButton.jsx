import styled from "styled-components";
import { specialFont } from "/imports/ui/components/landing/components/jss/helpers.js";
import React from "react";

const Button = styled.button`
background-color: #333;
color: #f2f2f2;
height: 48px;
min-width: 200px;
font-family: ${specialFont};
font-size: 24px;
padding: 8px 16px;
box-sizing: border-box;
border: 2px;
border-radius: 5px;
font-style: italic;
font-weight: lighter;
margin-top:10px;
cursor: ${props => (props.disabled ? "not-allowed" : "pointer")};
`;

export function CustomButton (props){
    return <Button
        {...props}
    >{props.label}</Button>
}