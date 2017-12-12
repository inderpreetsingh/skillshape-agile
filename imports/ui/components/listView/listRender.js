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
        <a href={`/schools/${school.slug}`}>
          <div className="card-image" style={{backgroundImage: `url(${backgroundUrl})`}} data-header-animation="true" >
          </div>
        </a>
        <div className="card-content">
        <a href={`/schools/${school.slug}`}>
          <h4 className="card-title">
              { classTypeData.name}
          </h4>
        </a>
      </div>
    </div>
  </div>
	)
}