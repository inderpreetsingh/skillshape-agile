import React from 'react';
import { Loading } from '/imports/ui/loading';
import { checkSuperAdmin } from '/imports/util';
import { browserHistory, Link } from 'react-router';
import Signup from '/imports/ui/components/account/signup';

export default function() {

	const defaultSchoolImage = "http://img.freepik.com/free-icon/high-school_318-137014.jpg?size=338c&ext=jpg";
	let {
		schoolData,
		classPricing,
		monthlyPricing,
		currentUser,
	} = this.props;

	if(!schoolData) {
		return <Loading/>
	}

	const checkUserAccess = this.checkUserAccess(currentUser, schoolData.userId);
	const claimBtnCSS = this.claimBtnCSS(currentUser, schoolData.claimed);
	return (
		<div className="content">
      <div className="container-fluid">
      	<div className="row">
          <div className="card">
							{
								classPricing && classPricing.length > 0 && (
									<div className="col-md-12">
             				<h2 className="tagline line-bottom">Prices</h2>
             				<div className="card-content table-grey-box">
             					<h4 className="card-title border-line-text line-bottom">Monthly Packages</h4>
             					<div className="card-content table-responsive prices school-view-price" style={{overflowX: 'auto !important'}}>
             						<table className="table">
             							<thead>
                            <tr>
                              <th className="th_header">Package Name</th>
                              <th className="th_header">Payment Type</th>
                              <th className="th_header">Class Type includes</th>
                              <th className="th_header">1 month</th>
                              <th className="th_header">3 month</th>
                              <th className="th_header">6 month</th>
                              <th className="th_header">1 year</th>
                              <th className="th_header">Life Time Cost</th>
                            </tr>
                         </thead>
                         <tbody>
                       		{/*table body content pending*/}
                         </tbody>
             						</table>
             					</div>	
             				</div>	
             			</div>	
								)
							} 
							{
								classPricing && classPricing.length > 0 && (
									<div className="col-md-12">
                 		<div className="card-content table-grey-box ">
                 			<h4 className="card-title border-line-text line-bottom" >Class Costs</h4>
                     	<div className="card-content table-responsive clascost school-view-price" style={{overflowX:'auto !important'}}>
                        <table className="table">
                          <thead className="">
                            <tr>
                              <th className="th_header">Package Name</th>
                              <th className="th_header">Cost</th>
                              <th className="th_header">Class Type includes</th>
                              <th className="th_header">Number of Classes</th>
                              <th className="th_header">Expires</th>
                            </tr>
                          </thead>
                         <tbody>
                           {/*table body content pending*/}   
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
								)
							}
						</div>
				</div>
				<div className="row">
          <div className="col-sm-12">
          	<div className="col-sm-6">
          	</div>	
        	</div>
        	<div className="col-sm-12">
    				<div className="card">
        			<div className="card-content">
            		<div className="">
                	<div className="thumb about-school-top">
	        					<figure className="about-head-image">
                      <div className="overlay-box"></div>
                      <img src={ schoolData.mainImage || defaultSchoolImage }/>
                    </figure>
                    <div className="col-md-12">
                      {
                      	checkUserAccess && (
	                       <div className="togglebutton pull-right">
	                          <label>
	                          	<span className="btn-label" style={{color:'white'}}> 
	                          		Publish / Unpublish
	                          	</span>
	                            <input 
	                            	type="checkbox" 
	                            	data-school_id="{{_id}}" 
	                            	className="schoolStatus toggelSchoolStatus" 
	                            	style={{position: 'absolute'}} 
	                            	
	                            />
	                          </label>
	                        </div>
                      	)
                      }
                     </div>
                     <div className="col-md-12">
                        { 
                      		checkUserAccess && (
                      			<Link to={`/SchoolAdmin/${schoolData._id}/edit`} type="button" className="btn btn-default pull-right">
                          		<i className="fa fa-edit"></i>  Edit
                          	</Link> 
                      		)
                      	}
                				{ true && (
                						<a onClick={this.claimASchool.bind(this,currentUser)} type="button" style={{marginRight: '10px'}} className={`btn ${claimBtnCSS} pull-right btn_claim`} id="claimSchool1">
                							<i className="fa fa-gavel"></i>  Claim
                						</a>
                					)
                				}
                    </div>
                    <div className="school-view-top-heading">
                      <div className="col-md-12">
                        <h1><a href="#">{schoolData.name}</a></h1>
                        <hr/>
                      </div>
                      <div className="col-md-6 col-lg-7">
                        <a href="#">{schoolData.website}</a>
                      </div>
                    </div>
	        					<div className="col-md-6 col-lg-5  view-btn-top">
	                    <button className="btn account-view-btn btn-warning">
	                      <span className="btn-label">
	                        <i className="material-icons">account_circle</i>
	                          Contact Us
	                        </span>
	                      </button>
	                      <button className="btn account-view-btn btn-info">
	                        <span className="btn-label">
	                        <i className="material-icons">phone</i>
	                          Call Us
	                        </span>
	                      </button>
	                  </div>
        					</div>
        				</div>
        			</div>
        			<div className="card-footer">
            		<div className="col-sm-12">
            		</div>
        			</div>
        		</div>     
        	</div>     
        </div>     
			</div>
		</div>
	)
}