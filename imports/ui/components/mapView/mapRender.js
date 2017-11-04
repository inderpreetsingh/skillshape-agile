import React from 'react';

export default function() {
  const {
    school,
    classTypeData,
    checkJoin,
    backgroundUrl,
    isMyClass,
    locationId,
  } = this.props;

	return (
		<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <div className="card card-product card-product-new" data-count="6" >
        <a href={`/schools/${school.slug}`}>
          <div className="card-image" style={{backgroundImage: `url(${backgroundUrl})`}} data-header-animation="true" >
          </div>
        </a>
        <div className="card-content">
        <a href={`/schools/${school.slug}`}>
          <h4 className="card-title" title={`${classTypeData.className} at ${school.name}`}>
              { school && classTypeData.skillTypeId && `${school.name} at ${classTypeData.skillTypeId}`}
          </h4>
        </a>
        <div className="card-description money-value">
          <p className="">
            <i className="material-icons">location_on</i> 
            {locationId}
          </p>
          {/*  {{#with view_class_price classTypeId}}
              {{#if validateCost cost }}
                <h4><i className="material-icons">attach_money</i>  Starting ${{cost}}/Month</h4>
              {{ else }}
                <p className="text-center">&nbsp; </p>
              {{/if}}
            {{/with}}  */}
        </div>
      </div>
      <div className="card-footer text-center">
        <div className="row ">
            {
              isMyClass ?
              (<a href="/schoolAdmin/{{schoolId}}" className="btn btn-warning" data-className="{{_id}}" data-className-type="{{classTypeId}}" >
                Managing
                <div className="ripple-container">
                </div>
              </a>) : 
              (
                checkJoin ? 
                (<a href="/MyCalendar" className="btn btn-success" data-class="{{_id}}" data-class-type="{{classTypeId}}"><i className="material-icons">check</i>  
                  Joined
                  <div className="ripple-container">
                  </div>
                </a>) : 
                (<a href="#" className="btn btn-rose btn_join_class btn_join_check" data-class="{{_id}}" data-class-type="{{classTypeId}}" >
                  Join Class
                  <div className="ripple-container">
                  </div>
                </a>
                )
              )
            }
        </div>
      </div>
    </div>
  </div>
	)
}