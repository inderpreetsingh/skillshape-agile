import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from 'material-ui/MenuItem';
import DashboardIcon from 'material-ui/svg-icons/action/dashboard';
import { Link } from 'react-router-dom';

const DashboardMenuItem = ({ onClick }) => (
    <MenuItem
        containerElement={<Link to="/" />}
        primaryText={'aor.page.dashboard'}
        leftIcon={<DashboardIcon />}
        onClick={onClick}
    />
);

DashboardMenuItem.propTypes = {
    onClick: PropTypes.func,
};

export default DashboardMenuItem;
