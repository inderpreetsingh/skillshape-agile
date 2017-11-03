import React from 'react';
import { validateImage, checkSuperAdmin } from '/imports/util';

export default function() {
	const { currentUser } = this.props;
  const { mySchool, connectedSchool, claimRequest } = this.state;
  const superAdmin = checkSuperAdmin(currentUser);

	return (
		<div className="sidebar" data-active-color="rose" data-background-color="black" data-image="/images/background.jpg">
			<div className="logo">
        <a href="#" className="simple-text">
          <img src="/images/logo-location.png" alt="logo" width="80"/>
        </a>
      </div>
      <div className="logo logo-mini">
        <a href="#" className="simple-text">
          SS
        </a>
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
            <a href={`/profile/${Meteor.userId()}`}>
              <i className="material-icons">account_circle</i>
              <p>My Profile</p>
            </a>
          </li>
          <li>
            <a href="/MyCalendar">
              <i className="material-icons">schedule</i>
              <p>My Calendar</p>
            </a>
          </li>
          {
            this.checkSchoolAccess() && (
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
                      mySchool.map((school, index) => {
                        return (
                          <li key={index}>
                            <a href={`/schools/${school.slug}`} className="close-nav">
                              {school.name}
                            </a>
                          </li>
                        )
                      })
                    } 
                  </ul>
                </div>
            </li>
            )
          }
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
                          <a href={`/schools/${school.slug}`} className="close-nav">
                            {school.name}
                          </a>
                        </li>
                      )
                    })
                  }
                </ul>
              </div>
            </li>
          }
          <li>
            <a href="/">
              <i className="material-icons">find_in_page</i>
              <p>Find a School</p>
            </a>
          </li>
          <li>
            <a href="/claimSchool">
              <i className="material-icons">assignment</i>
                <p>Claim a School
              </p>
            </a>
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
                          <a href="#" className="close-nav btn-primary claimProgress">
                            {data.schoolName}
                          </a>
                        </li>
                      )
                    })
                  }
                </ul>
              </div>
            </li>
          }
          <li>
            <a href="/ContactUs">
                <i className="material-icons">comment</i>
                <p>Send us feedback</p>
            </a>
          </li>
          {
            superAdmin && <li>
              <a href="/schoolAdmin">
                <i className="material-icons">library_add</i>
                <p>Add schools</p>
              </a>
            </li>
          }
          {
            superAdmin && <li>
              <a href="/SchoolUpload">
                <i className="material-icons">file_upload</i>
                <p>Upload schools</p>
              </a>
            </li>
          }
      	</ul>
      </div>
		</div>
	)
}