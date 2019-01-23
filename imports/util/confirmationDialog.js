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
    const { title, content, buttons, type, popUp } = data;
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