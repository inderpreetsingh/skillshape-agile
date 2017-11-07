import React from 'react';
import { validateImage } from '/imports/util';
import { Loading } from '/imports/ui/loading';
import DatePicker from 'react-datepicker';

export default function() {
	let { currentUser } = this.props;
	let { 
		firstName,
		nickame,
		lastName,
		dob,
		phone,
		address 
	} = this.state;

	if(!currentUser)
		return <Loading/>

	return (
    <div className="content">
      <div className="container-fluid">
        <div className="card">
          <div className="row">
            <div className="card-header card-header-icon" data-background-color="blue">
              <i className="material-icons">perm_identity</i>
            </div>
          </div>
          <div className="col-md-3 text-center" style={{paddingTop: '20px'}}>
            <div className="fileinput fileinput-new card-button text-center" data-provides="fileinput">
              <div className="fileinput-new card-button thumbnail">
                <img className="" src={validateImage(currentUser)} alt="Profile Image" id="pic"/>
              </div>
              <div className="fileinput-preview fileinput-exists thumbnail"></div>
                <div>
                  <span className="btn btn-warning btn-sm btn-file">
                  	<span className="fileinput-new">Upload New Image</span>
                  	<span className="fileinput-exists">Change</span>
                  	<input type="hidden"/>
                  	<input type="file" name="..." accept="image/*" id="ProfileImage" ref="ProfileImage"/>
                  </span>
                  <a href="#" className="btn btn-danger  fileinput-exists" data-dismiss="fileinput">
                  	<i className="fa fa-times"></i>
                  		Remove
                  </a>
                </div>
             	</div>
           	</div>
           	<div className="col-md-8 right txtwar">
              <div className="form-group row">
               	<label for="example-text-input" className="col-md-2 col-form-label" style={{textAlign: 'right'}}>
               		First Name
               	</label>
               	<div className="col-md-10">
                  <input 
                  	className="form-control" 
                  	type="text"  
                  	id="firstName" 
                  	ref="firstName" 
                  	value={firstName}
                  	onChange={(e) => this.setState({firstName: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group row">
              	<label for="example-text-input" className="col-md-2 col-form-label" style={{textAlign: 'right'}}>
              		Nickname
              	</label>
              <div className="col-md-10">
                <input 
                	className="form-control" 
                	type="text" 
                	id="nickame" 
                	ref="nickame"  
                	value={nickame}
                	onChange={(e) => this.setState({nickame: e.target.value})}
                />
              </div>
            </div>
            <div className="form-group row">
              <label for="example-text-input" className="col-md-2 col-form-label" style={{textAlign: 'right'}}>Last Name</label>
              <div className="col-md-10">
                <input 
                	className="form-control" 
                	type="text"  
                	id="lastName" 
                	ref="lastName" 
                	value={lastName}
                	onChange={(e) => this.setState({lastName: e.target.value})}
                />
                <small >Your public profile only shows your first name and nickname. When you join a school, your instructors will see your first and last name.</small>
              </div>
            </div>
            <div className="form-group row">
              <label for="example-text-input" className="col-md-2 col-form-label" style={{textAlign: 'right'}}>I AM</label>
              <div className="col-md-10">
                <select 
                	className="custom-select mb-2 mr-sm-2 mb-sm-0" 
                	id="gender"
                	ref="gender" 
                	value={this.state.gender} 
                	onChange={(e) => this.setState({gender: e.target.value})}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <br/>
                <small>We use this data for analysis and never shared it with other users.</small>
              </div>

            </div>
            <div className="form-group row">
              <label for="example-text-input" className="col-md-2 col-form-label" style={{textAlign: 'right'}}>Birth Date</label>
              <div className="col-md-10">
                <DatePicker
                  className="form-control react-datepicker-text-field" 
                  selected={this.state.dob}
                  onChange={(date)=> this.setState({dob: date})}
                />
                <small>The wonderful day you took your first breath. We use this data for analysis and never share it wuth other users.</small>
              </div>
            </div>
            <div className="form-group row">
              <label for="example-text-input" className="col-md-2 col-form-label" style={{textAlign: 'right'}}>Email</label>
              <div className="col-md-10">
                <input 
                	className="form-control" 
                	type="text"  
                	id="example-text-input" 
                	value={currentUser.emails.length > 0 && (currentUser.emails[0].address || "")} 
                	readOnly="true"
                />
                <small>We won't share your private email address with other Members.</small>
              </div>
            </div>
            <div className="form-group row">
              <label for="example-text-input" className="col-md-2 col-form-label" style={{textAlign: 'right'}}>Phone</label>
              <div className="col-md-10">
                <input 
                	className="form-control" 
                	type="text"  
                	id="phone" 
                	ref="phone"  
                	value={phone}
                	onChange={(e) => this.setState({phone: e.target.value})}
                />
                <small>This is only shared with Administrators of school you have enrolled in.</small>
              </div>
            </div>
            <div className="form-group row">
              <label for="example-text-input" className="col-md-2 col-form-label" style={{textAlign: 'right'}}>Address</label>
              <div className="col-md-10">
                <input 
                	className="form-control" 
                	type="text"  
                	id="address" 
                	ref="address" 
                	value={address}
                	onChange={(e) => this.setState({address: e.target.value})}
                />
                <small>Please enter your address, including zip code and country. We only use this to help you find classes in your area and do not share it.</small>
              </div>
            </div>
            <div className="row form-group right">
              <button
              	onClick={this.updateUser} 
              	type='button' 
              	className='btn btn-md btn-rose' 
              	id="btn_update_user"
              > Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}