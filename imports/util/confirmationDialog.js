import React from "react";
import styled from "styled-components";
import FormGhostButton from '/imports/ui/components/landing/components/buttons/FormGhostButton.jsx';
import { rhythmDiv, } from '/imports/ui/components/landing/components/jss/helpers.js';

const ButtonsWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    margin-bottom: ${rhythmDiv}px;
`;

export function confirmationDialog(data) {
    const { title, content, buttons, type, popUp ,defaultDialog,errDialog } = data;
    if(defaultDialog || errDialog){
        popUp.appear(defaultDialog ? "success" : 'alert', {
            title:'Success',
            content:errDialog? "Something went Wrong !" :'Operation Completed Successfully.',
            RenderActions: (
                <ButtonsWrapper>
                            <FormGhostButton
                                applyClose
                                label= {'Ok'}
                                onClick= {()=>{}}
                            />
                </ButtonsWrapper>)
        }, true);
    }
    else{
        popUp.appear(type, {
            title,
            content,
            RenderActions: (
                <ButtonsWrapper>
                    {buttons.map((obj) => {
                        return (
                            <FormGhostButton
                                applyClose
                                {...obj}
                            />
                        )
                    })}
                </ButtonsWrapper>)
        }, true);
    }
}