import React, { createElement, Component } from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import autoprefixer from 'material-ui/utils/autoprefixer';
import CircularProgress from 'material-ui/CircularProgress';
import withWidth from 'material-ui/utils/withWidth';
import compose from 'recompose/compose';

import AdminRoutes from '../../AdminRoutes';
import AppBar from './AppBar';
import Sidebar from './Sidebar';
import Menu from './Menu';
import defaultTheme from '../defaultTheme';

const styles = {
    wrapper: {
        // Avoid IE bug with Flexbox, see #467
        display: 'flex',
        flexDirection: 'column',
    },
    main: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    },
    body: {
        backgroundColor: '#edecec',
        display: 'flex',
        flex: 1,
        overflowY: 'auto',
        overflowX: 'auto',
    },
    bodySmall: {
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        padding: '2em',
    },
    contentSmall: {
        flex: 1,
        paddingTop: '3em',
    },
    loader: {
        position: 'absolute',
        top: 0,
        right: 0,
        margin: 16,
        zIndex: 1200,
    },
};

const prefixedStyles = {};

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebarOpen : this.props.width !== 1
        }
    }
    componentWillMount() {
        if (this.props.width !== 1) {
            // this.props.setSidebarVisibility(true);
        }
    }
    toggleSideBar = (prop)=> {
        this.setState({sidebarOpen: !this.state.sidebarOpen})
    }
    render() {
        const {
            children,
            customRoutes,
            dashboard,
            isLoading,
            logout,
            menu,
            catchAll,
            theme,
            title,
            width,
        } = this.props;

        const muiTheme = getMuiTheme(theme);
        if (!prefixedStyles.main) {
            // do this once because user agent never changes
            const prefix = autoprefixer(muiTheme);
            prefixedStyles.wrapper = prefix(styles.wrapper);
            prefixedStyles.main = prefix(styles.main);
            prefixedStyles.body = prefix(styles.body);
            prefixedStyles.bodySmall = prefix(styles.bodySmall);
            prefixedStyles.content = prefix(styles.content);
            prefixedStyles.contentSmall = prefix(styles.contentSmall);
        }
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div style={prefixedStyles.wrapper}>
                    <div style={prefixedStyles.main}>
                        {<AppBar {...this.props} />}
                        <div
                            className="body"
                            style={
                                width === 1 ? (
                                    prefixedStyles.bodySmall
                                ) : (
                                    prefixedStyles.body
                                )
                            }
                        >
                            <div
                                style={
                                    width === 1 ? (
                                        prefixedStyles.contentSmall
                                    ) : (
                                        prefixedStyles.content
                                    )
                                }
                            >

                                   <div> Content goes here.... </div>

                            </div>
                            <Sidebar
                                open={this.state.sidebarOpen}
                                toggleSideBar={this.toggleSideBar}
                                theme={theme}>
                                {createElement(menu || Menu, {
                                    logout,
                                    hasDashboard: !!dashboard,
                                })}
                            </Sidebar>
                        </div>
                        {isLoading && (
                            <CircularProgress
                                className="app-loader"
                                color="#fff"
                                size={width === 1 ? 20 : 30}
                                thickness={2}
                                style={styles.loader}
                            />
                        )}
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

const componentPropType = PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
]);

Layout.defaultProps = {
    theme: defaultTheme,
};

export default withWidth()(Layout);
