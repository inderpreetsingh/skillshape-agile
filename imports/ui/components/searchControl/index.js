import React from 'react';

export default class SearchControl extends React.Component {

  constructor(props){
    super(props);
  }

  componentDidMount() {
    this.initializeSlider()  
  }

  initializeSlider = () => {
    const rangeClass = document.getElementById('sliderPriceClass');
    const rangeMonth = document.getElementById('sliderPriceMonth');
    noUiSlider.create(rangeClass,{
      start: [20, 80],
      connect: true,
      range: {
          'min': 0,
          'max': 100
      }
    });
    noUiSlider.create(rangeMonth,{
      start: [20, 80],
      connect: true,
      range: {
          'min': 0,
          'max': 100
      }
    })
  }

  render(){
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
                  id="location" value="test"
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
              />
              <i className="material-icons card-material-icon" title="Search around your location...">
                search
              </i>  
            </div>
          </div>
          <div className="col-md-2 col-sm-4">
            <div className="form-group label-floating is-empty has-warning">
              <select className="form-control search-bar-form" style={{width: '100%'}} id="cskill" name="cskill">
                <option value="" disabled selected >Type Of Skill</option>
                <option value="">Any</option>
                <option value="">name</option>
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
                    $10 - 35$
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
                    $35 - 250$
                  </strong>
                </div>
              </div>  
              <div className="col-lg-12 clearfix">
                <div id="sliderPriceMonth" className="range-slider-wrap">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
