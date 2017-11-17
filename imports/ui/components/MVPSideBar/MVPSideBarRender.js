import React from 'react';
import { validateImage, checkSuperAdmin } from '/imports/util';
import { browserHistory, Link } from 'react-router';

export default function() {
	const { currentUser } = this.props;
  const { mySchool, connectedSchool, claimRequest } = this.state;
  const superAdmin = checkSuperAdmin(currentUser);

	return (
		<div className="sidebar" data-active-color="rose" data-background-color="black" data-image="/images/background.jpg">
			<div className="logo">
        <Link to="/" className="simple-text">
          <img src="/images/logo-location.png" alt="logo" width="80"/>
        </Link>
      </div>
      <div className="logo logo-mini">
        <Link to="/" className="simple-text">
          SS
        </Link>
      </div>
      <div className="sidebar-wrapper">
      	<div className="user">
          <div className="photo">
            <img src={validateImage(currentUser)} />
          </div>
          <div className="info">
            <a data-toggle="collapse" href="#collapseExample" >
              {this.getUserName()}
            </a>
          </div>
      	</div>
      	<ul className="nav">
      		<li>
            <Link to={`/profile/${Meteor.userId()}`} >
              <i className="material-icons">account_circle</i>
              <p>My Profile</p>
            </Link>
          </li>
          <li>
            <Link to="/MyCalendar">
              <i className="material-icons">schedule</i>
              <p>My Calendar</p>
            </Link>
          </li>
          <li>
            <a data-toggle="collapse" href="#Curriculum">
              <i className="material-icons">school</i>
              <p>Manage my school
                <b className="caret"></b>
              </p>
            </a>
            <div className="collapse" id="Curriculum">
              <ul className="nav">
                {
                  mySchool.length > 0 ? mySchool.map((school, index) => {
                    return (
                      <li key={index}>
                        <Link to={`/schools/${school.slug}`} className="close-nav">
                          {school.name}
                        </Link>
                      </li>
                    )
                  }) : (
                    <li>
                      <Link to={`/schoolAdmin`} className="close-nav">
                        START NEW SCHOOL
                      </Link>
                    </li>
                  )
                } 
              </ul>
            </div>
          </li>
            
          {
            connectedSchool.length > 0 &&
            <li>
              <a data-toggle="collapse" href="#Members">
                <i className="material-icons">account_balance</i>
                <p>Classes Attending
                    <b className="caret"></b>
                </p>
              </a>
              <div className="collapse" id="Members">
                <ul className="nav">
                  {
                    connectedSchool.map((school, index) => {
                      return (
                        <li key={index}>
                          <Link to={`/schools/${school.slug}`} className="close-nav">
                            {school.name}
                          </Link>
                        </li>
                      )
                    })
                  }
                </ul>
              </div>
            </li>
          }
          <li>
            <Link to="/">
              <i className="material-icons">find_in_page</i>
              <p>Find a School</p>
            </Link>
          </li>
          <li>
            <Link to="/claimSchool">
              <i className="material-icons">assignment</i>
                <p>Claim a School
              </p>
            </Link>
          </li>
          {
            claimRequest.length > 0 &&
            <li>
              <a data-toggle="collapse" href="#admin">
                <i className="material-icons">assignment</i>
                <p>Claim Request
                  <b className="caret"></b>
                </p>
              </a>
              <div className="collapse" id="admin">
                <ul className="nav">
                  {
                    claimRequest.map((data, index) => {
                      return (
                        <li key={index}>
                          <Link to="#" className="close-nav btn-primary claimProgress">
                            {data.schoolName}
                          </Link>
                        </li>
                      )
                    })
                  }
                </ul>
              </div>
            </li>
          }
          <li>
            <Link to="/ContactUs">
                <i className="material-icons">comment</i>
                <p>Send us feedback</p>
            </Link>
          </li>
          {
            superAdmin && <li>
              <Link to="/schoolAdmin">
                <i className="material-icons">library_add</i>
                <p>Add schools</p>
              </Link>
            </li>
          }
          {
            superAdmin && <li>
              <Link to="/SchoolUpload">
                <i className="material-icons">file_upload</i>
                <p>Upload schools</p>
              </Link>
            </li>
          }
      	</ul>
      </div>
		</div>
	)
}