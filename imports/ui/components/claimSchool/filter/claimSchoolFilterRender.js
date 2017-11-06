import React from "react";

export default function () {

  return (
      <div className='container-fluid'>
        <div className="card">
          <div className="col-sm-2">
            <div className="form-group label-floating is-empty has-warning">
              <input
                  className="form-control"
                  type="text"
                  aria-required="true"
                  placeholder="School name"
                  name="schoolName"
                  ref= { (ref) => {this.schoolName = ref} }
              />
              <span className="material-input"/>
              <span className="material-input"/>
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group label-floating is-empty has-warning">
              <select
                  className="form-control"
                  style={{width: '100%'}}
                  name="typeOfSchool"
                  ref= { (ref) => {this.typeOfSkill = ref}}
              >
                <option disabled selected>Type Of Skills</option>
                <option >Any</option>
                <option value="AIKI-YOUTH AIKIDO">AIKI-YOUTH AIKIDO</option>
                { this.props.dataForSkillTypes.map((skill, i) => {
                  return (<option key={i} value={`${skill.name}`}>{skill.name}</option>)
                }) }
              </select>
              <span className="material-input"/>
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group label-floating is-empty has-warning">
              <input
                  className="form-control"
                  type="text"
                  aria-required="true"
                  placeholder="Address"
                  name="address"
                  ref= { (ref) => {this.address = ref} }
                  autoComplete="off"
              />
              <span className="material-input"/>
              <span className="material-input"/>
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group label-floating is-empty has-warning">
              <input
                  className="form-control"
                  type="text"
                  aria-required="true"
                  placeholder="Website"
                  name="website"
                  ref= { (ref) => {this.website = ref} }
                  id="web"
              />
              <span className="material-input"/>
              <span className="material-input"/>
            </div>
          </div>
          <div className="col-sm-2">
            <div className="form-group label-floating is-empty has-warning">
              <input
                  className="form-control"
                  type="text"
                  aria-required="true"
                  placeholder="Phone Number"
                  name="phoneNumber"
                  ref= { (ref) => {this.phoneNumber = ref} }
                  id="phone"
              />
              <span className="material-input"/>
              <span className="material-input"/>
            </div>
          </div>
          <div className="col-sm-2" style={{paddingTop: 10}}>
            <a onClick={() => this.props.onSearch(this) } style={{marginRight: '4px'}} id="search" title="Search"
               className="btn btn-warning btn-sm search"><i className="material-icons md-18">search</i></a>
            <a onClick={() => this.props.resetFilter(this) } id="view_list" title="reset filter" className="btn btn-warning btn-sm clear_filter"><i
                className="material-icons md-18">autorenew</i></a>
          </div>
        </div>
      </div>
  )
}