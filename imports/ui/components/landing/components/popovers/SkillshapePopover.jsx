import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Popover from 'material-ui/Popover';

class SkillshapePopover extends Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     isOpen: false,
        // };
    }

    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.isOpen !== this.state.isOpen) {
    //         this.setState(state => {
    //             return {
    //                 ...state,
    //                 isOpen: nextProps.isOpen,
    //             }
    //         })
    //     }
    // }

    handleChange = key => (event, value) => {
        const { onChange } = this.props;
        this.setState(state => {
            return {
                ...state,
                [key]: value
            }
        });

        onChange && onChange(key, value);
    }

    handleClose = () => {
        const { onClose } = this.props;
        onClose && onClose();
    };

    render() {
        const {
            children,
            anchorOriginVertical,
            anchorOriginHorizontal,
            transformOriginVertical,
            transformOriginHorizontal,
            positionLeft,
            positionTop,
            anchorReference,
            anchorEl,
            isOpen
        } = this.props;

        console.log(anchorEl, isOpen, children, "anchorElm");

        return (
            <Popover
                open={isOpen}
                anchorEl={anchorEl}
                anchorReference={anchorReference}
                anchorPosition={{ top: positionTop, left: positionLeft }}
                onClose={this.handleClose}
                anchorOrigin={{
                    vertical: anchorOriginVertical,
                    horizontal: anchorOriginHorizontal,
                }}
                transformOrigin={{
                    vertical: transformOriginVertical,
                    horizontal: transformOriginHorizontal,
                }}
            >
                {children}
            </Popover>
        )
    }
}

SkillshapePopover.propTypes = {
    isOpen: PropTypes.bool,
    anchorOriginVertical: PropTypes.string,
    anchorOriginHorizontal: PropTypes.string,
    transformOriginVertical: PropTypes.string,
    transformOriginHorizontal: PropTypes.string,
    positionTop: PropTypes.number,
    positionLeft: PropTypes.number
}

SkillshapePopover.defaultProps = {
    isOpen: false,
    anchorOriginVertical: 'top',
    anchorOriginHorizontal: 'left',
    transformOriginVertical: 'top',
    transformOriginHorizontal: 'left',
    positionTop: 500,
    positionLeft: 200
}

export default SkillshapePopover;