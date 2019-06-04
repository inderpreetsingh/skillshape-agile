import React, { Fragment } from 'react';

export default function () {
  return (
    <Fragment>
      <div className="col-md-6 mapview" style={{ height: '700px' }}>
        <div id="google-map" style={{ height: '700px' }} />
      </div>
    </Fragment>
  );
}
