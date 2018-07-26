import React from 'react';
import {browserHistory} from 'react-router';
import queryString from 'query-string';
import styled from 'styled-components'

import ManageUnsubscribeDialogBox from "/imports/ui/components/landing/components/dialogs/ManageUnsubscriptionDialogBox.jsx";

const redirectUser = () => browserHistory.push('/');

const UnsubscribeUser = (props) => {
    const {pricingRequest, classTimesRequest, locationRequest, requestId} = queryString.parse(props.location.search);
    const requestFor = (pricingRequest && 'price details') || (classTimesRequest && 'class times') || (locationRequest && 'location');
    return(<div>
        <ManageUnsubscribeDialogBox
          onModalClose={redirectUser}
          open={true}
          onToastrClose={redirectUser}
          requestId={requestId}
          requestFor={requestFor}
          />
      </div>);
}

export default UnsubscribeUser;
