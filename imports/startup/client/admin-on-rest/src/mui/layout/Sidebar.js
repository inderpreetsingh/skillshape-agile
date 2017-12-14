import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Drawer from 'material-ui/Drawer';
import Paper from 'material-ui/Paper';
import muiThemeable from 'material-ui/styles/muiThemeable';

import Responsive from './Responsive';

const getWidth = width => (typeof width === 'number' ? `${width}px` : width);

const getStyles = ({ drawer }) => {
    const width = drawer && drawer.width ? getWidth(drawer.width) : '16em';

    return {
        sidebarOpen: {
            flex: `0 0 ${width}`,
            marginLeft: 0,
            order: -1,
            transition: 'margin 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
        },
        sidebarClosed: {
            flex: `0 0 ${width}`,
            marginLeft: `-${width}`,
            order: -1,
            transition: 'margin 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
        },
    };
};

// We shouldn't need PureComponent here as it's connected
// but for some reason it keeps rendering even though mapStateToProps returns the same object
class Sidebar extends PureComponent {

    render() {
        const { open, setSidebarVisibility, children, muiTheme,toggleSideBar } = this.props;
        const styles = getStyles(muiTheme);
        console.log("sidebarOpen",open)
        return (
            <Responsive
                small={
                    <Drawer
                        docked={false}
                        open={open}
                        onRequestChange={toggleSideBar}
                    >
                        {React.cloneElement(children, {
                            onMenuTap: this.handleClose,
                        })}
                    </Drawer>
                }
                medium={
                    <Paper
                        style={open ? styles.sidebarOpen : styles.sidebarClosed}
                    >
                        {React.cloneElement(children, {
                            onMenuTap: () => null,
                        })}
                    </Paper>
                }
            />
        );
    }
}

export default muiThemeable()(Sidebar);
