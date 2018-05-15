import React from 'react';
import {browserHistory} from 'react-router';
import queryString from 'query-string';
import styled from 'styled-components'

import ManageUnsubscribeDialogBox from "/imports/ui/components/landing/components/dialogs/ManageUnsubscriptionDialogBox.jsx";

const redirectUser = () => browserHistory.push('/');

const UnsubscribeUser = (props) => {
    console.log("props for the unsubscribe dialog box...");
    const {pricingRequest, classTimesRequest, classTypeLocationRequest, requestId} = queryString.parse(props.location.search);
    const requestFor = (pricingRequest && 'price details') || (classTimesRequest && 'class times') || (classTypeLocationRequest && 'location');
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
