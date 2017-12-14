import React from 'react';
import inflection from 'inflection';
import compose from 'recompose/compose';
import DashboardMenuItem from './DashboardMenuItem';
// import MenuItemLink from './MenuItemLink';
// import translate from '../../i18n/translate';

const styles = {
    main: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        height: '100%',
    },
};

const translatedResourceName = (resource, translate) =>
    translate(`resources.${resource.name}.name`, {
        smart_count: 2,
        _:
            resource.options && resource.options.label
                ? translate(resource.options.label, {
                      smart_count: 2,
                      _: resource.options.label,
                  })
                : inflection.humanize(inflection.pluralize(resource.name)),
    });

const Menu = ({ hasDashboard, onMenuTap, resources, translate, logout }) => (
    <div style={styles.main}>
        Menu Items herer....
    </div>
);

export default Menu;
                //<MenuItemLink
                  //  key={resource.name}
                    //to={`/${resource.name}`}
                  //  primaryText={translatedResourceName(resource, translate)}
                   // leftIcon={<resource.icon />}
                   // onClick={onMenuTap}
                ///>
