import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import SearchControl from '/imports/ui/components/searchControl';

class Home extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      gridView: true,
      mapView: false
    }
  }

  render(){
    console.log("Home state -->>",this.state);
    console.log("Home props -->>",this.props);
    const {
      gridView,
      mapView,
    } = this.state;

    return(
      <div className="content">
        <div className="container-fluid">
          <SearchControl/>
          <div className="row">
            <div className="col-sm-12 grid-map-wrap">
              <div className="col-sm-5 p0">
                <p className="search-no text-center-xs">
                  46 Classes Found
                </p>
              </div>
              <div className="col-sm-7 text-right p0">
                <p className="dispInBlk text-center-xs dispBlk-xs">
                  Choose View:  
                </p>   
                <button 
                  onClick={()=>{this.setState({gridView: true,mapView: false})}} 
                  className="btn btn-default btn-grid btn-custom-active"
                >
                  <i className="material-icons card-material-icon" title="GridView">
                    grid_on
                  </i>
                </button>
                <button 
                  onClick={()=>{this.setState({gridView: false,mapView: true})}} 
                  className="btn btn-default btn-map"
                >
                  <i className="material-icons card-material-icon" title="Map">
                    map
                  </i>
                </button>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 pt-15">
              {/*{{#if hasSkillValue}}
                {{ > selectTags tag_class=skillvalue tag_filter="yes" tag_count=10  }}
              {{/if}}*/}
            </div>
          </div>
          {/*<div className="row">
             {{#each classTypeList}}
                 {{#each classByClassType _id}}
            <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12">
              <div className="card card-product card-product-new" data-count="6" >
                <a href="/schools/{{schoolslug schoolId}}">
                  <div className="card-image"  style="background-image: url({{view_image _id classTypeImg schoolId}})" data-header-animation="true" >
        
                  </div>
                  </a>
                  <div className="card-content">
                    <a href="/schools/{{schoolslug schoolId}}">
                      <h4 className="card-title" title="{{className}}  at {{schoolName schoolId}}">
                        {{curSchoolName schoolId}}
                      </h4>
                      </a>
                    <div className="card-description money-value">
                      <p className=""><i className="material-icons">location_on</i> {{address_view locationId}}</p>
                        {{#with view_class_price classTypeId}}
                          {{#if validateCost cost }}
                            <h4><i className="material-icons">attach_money</i>  Starting ${{cost}}/Month</h4>
                          {{ else }}
                            <p className="text-center">&nbsp; </p>
                          {{/if}}
                        {{/with}}
                      </div>
                  </div>
                  <div className="card-footer text-center">
                      <div className="row ">
                        {{#if isMyClass schoolId}}
                            <a href="/schoolAdmin/{{schoolId}}" className="btn btn-warning" data-className="{{_id}}" data-className-type="{{classTypeId}}" >Managing<div className="ripple-container"></div></a>
                        {{else}}
                          {{#if check_join _id}}
                              <a href="/MyCalendar" className="btn btn-success" data-className="{{_id}}" data-className-type="{{classTypeId}}"><i className="material-icons">check</i>  Joined
                              <div className="ripple-container"></div></a>
                          {{else}}
                              <a href="#" className="btn btn-rose btn_join_class btn_join_check" data-className="{{_id}}" data-className-type="{{classTypeId}}" >Join Class<div className="ripple-container"></div></a>
                          {{/if}}
                        {{/if}}
                      </div>
                  </div>
              </div>
            </div>*/}
        </div>
      </div>
    )
  }
}

export default createContainer(props => {
  Meteor.subscribe("classtype");
  Meteor.subscribe("SkillClassbySchool");
  const classType = ClassType.find({}).fetch();
  return { ...props, classType };
}, Home);