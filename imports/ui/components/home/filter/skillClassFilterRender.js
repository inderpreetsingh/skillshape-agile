import React from "react";
import TagFilter from '/imports/ui/components/tag';

export default function () {
	const skillType = this.props.skillType || [];
  const { 
    classPrice, 
    monthPrice,
    SLocation,
  } = this.state;
  
  return(
      <div className="row " id="scr_affix">
        <div className="col-md-12 card clear-margin-bt custom-card-filter">
          <div className="col-md-2 col-sm-4">
            <div className="input-group ">
              <div className="form-group label-floating is-empty has-warning location-input">
                <input 
                  className="form-control search-bar-form" 
                  type="text" 
                  aria-required="true" 
                  placeholder="Location" 
                  id="location"
                  value={SLocation}
                  onChange={(e) => this.setState({SLocation: e.target.value})} 
                  ref= { (ref) => {this.location = ref} }
                />
                <span className="material-input"></span>
                <i className="material-icons card-material-icon" title="Search around your location...">
                  location_searching
                </i>            
              </div>
            </div>
          </div>
          <div className="col-md-2 col-sm-4">
            <div className="form-group label-floating is-empty has-warning">
              <input 
                className="form-control search-bar-form" 
                type="text" 
                aria-required="true" 
                placeholder="School"  
                autoComplete="off"
                ref= { (ref) => {this.schoolName = ref} }
                onChange={() => this.props.onSearch(this) }
              />
              <i className="material-icons card-material-icon" title="Search around your location...">
                search
              </i>  
            </div>
          </div>
          <div className="col-md-2 col-sm-4">
            <div className="form-group label-floating is-empty has-warning">
              <select 
                className="form-control search-bar-form" 
                style={{width: '100%'}} 
                id="cskill" 
                name="cskill"
                ref= { (ref) => {this.typeOfSkill = ref}}
                onChange= {() => this.props.onSearch(this)}
              >
                <option value="" disabled selected >Type Of Skill</option>
                <option value="">Any</option>
                {
                  skillType.map((type, index) => {
                    return <option key={index} value={type.name}>
                      {type.name}
                    </option>
                  })
                }
              </select>
            </div>
          </div>
          <div className="col-md-3 col-sm-6">
            <div className="form-group label-floating filter-price">
              <div className="col-lg-12 clearfix">
                <div className="col-sm-7 p0 text-left">
                  Price per Class
                </div>
                <div className="col-sm-5 p0 text-right">
                  <strong>
                    ${classPrice[0]} - {classPrice[1]}$
                  </strong>
                </div>
              </div>
              <div className="col-lg-12 clearfix">
                <div id="sliderPriceClass" className="range-slider-wrap">
                </div>
              </div>                         
            </div>
          </div>
          <div className="col-md-3 col-sm-6">
            <div className="form-group label-floating filter-price">
              <div className="col-lg-12 clearfix">
                <div className="col-sm-7 p0 text-left">
                  Price per Month
                </div>
                <div className="col-sm-5 p0 text-right">
                  <strong>
                    ${monthPrice[0]} - {monthPrice[1]}$
                  </strong>
                </div>
              </div>  
              <div className="col-lg-12 clearfix">
                <div id="sliderPriceMonth" className="range-slider-wrap">
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-12 ">
            <TagFilter
              selectedSkill={this.typeOfSkill && this.typeOfSkill.value}
            />
          </div>
        </div>
      </div>
    )
}