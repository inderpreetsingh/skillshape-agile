import React, { Component, Fragment } from 'react';
import SkillshapePopover from '/imports/ui/components/landing/components/popovers/SkillshapePopover.jsx';

class TestPopover extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            isOpen: false
        }
        this.myDiv = null;
    }

    setDivRef = element => {
        console.log("SET DIV REF", element);
        this.myDiv = element;
    }

    handleDivToggle = (e) => {
        e.preventDefault();
        this.setState(state => {
            return {
                ...state,
                anchorEl: this.myDiv,
                isOpen: !state.isOpen
            }
        })
    }

    handlePopoverClose = (e) => {
        this.setState(state => {
            return {
                ...state,
                isOpen: false
            }
        })
    }

    render() {
        const { anchorEl, isOpen } = this.state;
        console.log(anchorEl, isOpen);
        return (<Fragment>
            <div
                className="toggle-popover"
                onClick={this.handleDivToggle}
                style={{ width: '100px', background: 'yellow', marginTop: '20px' }}
                ref={this.setDivRef} >
                Click Me to see the popover
            </div>
            {isOpen && <SkillshapePopover
                anchorEl={anchorEl}
                isOpen={isOpen}
                onClose={this.handlePopoverClose}
            >
                <div>
                    <h1>
                        Hi, I am popover here.
                    </h1>
                </div>
            </SkillshapePopover>}
        </Fragment>
        )
    }
}

export default TestPopover;