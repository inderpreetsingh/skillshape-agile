import React from 'react';

import CoaButton from '/imports/ui/components/landing/components/buttons/CoaButton.jsx';

const askLocationPermission = () => {
//   navigator.permissions.query({name:'geolocation', userVisibleOnly:true }).then(function(result) {
//     // do more here
//   });
  const success = () => {

  }
  const error = () => {

  }
  navigator.geolocation.getCurrentPosition(success, error);
}

const NearByClassesButton = () => (
  <CoaButton
    onClick={askLocationPermission}
    icon="location_searching"
    label="Find classes nearby"
    itemScope
    itemType="http://schema.org/FindAction"
    />
)

export default NearByClassesButton;
