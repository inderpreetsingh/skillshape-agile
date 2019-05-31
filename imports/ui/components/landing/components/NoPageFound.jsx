import get from 'lodash/get';
import React from 'react';
import DocumentTitle from 'react-document-title';
import NotFound from '/imports/ui/components/landing/components/helpers/NotFound';

const NoPageFound = props => (
  <DocumentTitle title={get(props, 'route.name', 'Untitled')}>
    <NotFound />
  </DocumentTitle>
);

export default NoPageFound;
