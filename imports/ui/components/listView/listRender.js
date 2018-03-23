import React from 'react';

export default function() {
  console.log("product props -->>",this.props);
  const {
    className,
    school,
    classTypeData,
    checkJoin,
    backgroundUrl,
    isMyClass,
    locationData,
  } = this.props;

	return (
		<div className={`${className} col-sm-12 col-xs-12`}>
      <div className="card card-product card-product-new" data-count="6" >
     
          <div className="card-image" style={{backgroundImage: `url(${backgroundUrl})`}} data-header-animation="true" >
          </div>
        <div className="card-content">
          <h4 className="card-title">
              { classTypeData.name}
          </h4>
      </div>
    </div>
  </div>
	)
}