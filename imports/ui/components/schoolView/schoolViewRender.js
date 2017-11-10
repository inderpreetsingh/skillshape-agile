import React from 'react';
import { Loading } from '/imports/ui/loading';
import { checkSuperAdmin } from '/imports/util';
import { browserHistory, Link } from 'react-router';
import { ClaimSchoolModal } from '/imports/ui/modal';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import MyCalender from '/imports/ui/components/users/myCalender';

export default function() {

	const defaultSchoolImage = "http://img.freepik.com/free-icon/high-school_318-137014.jpg?size=338c&ext=jpg";
	let {
		schoolData,
		classPricing,
		monthlyPricing,
		schoolLocation,
		classType,
		currentUser,
	} = this.props;

	const {
		showClaimSchoolModal
	} = this.state;
	if(!schoolData) {
		return <Loading/>
	}

	console.log("SchoolView render state -->>",this.props)
	const checkUserAccess = this.checkUserAccess(currentUser, schoolData.userId);
	const claimBtnCSS = this.claimBtnCSS(currentUser, schoolData.claimed);
	return (
		<div className="content">
			{ false && <ClaimSchoolModal/>}
      <div className="container-fluid">
      	<div className="row">
          <div className="card">
							{
								false && classPricing && classPricing.length > 0 && (
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
								false && classPricing && classPricing.length > 0 && (
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
                						<a onClick={this.claimASchool.bind(this,currentUser, schoolData)} type="button" style={{marginRight: '10px'}} className={`btn ${claimBtnCSS} pull-right btn_claim`} id="claimSchool1">
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
        	<div className="col-sm-12">
        		<div className="clearfix card" >
           		<div className="col-sm-9">
           			<div className="">
           				
           				<div className="card-content">
            				<div className="content-list-heading">
             					<h2 className="card-title text-center ">About School
             						<figure>
             							<img src="/images/heading-line.png"/>
             						</figure>
            				 	</h2>
            				 	{schoolData.descHtml}
            				</div>
            			</div>	 	
        				</div>     
        			</div>
        			<div className="col-sm-3">
           	  	<div className="card">
           	  		{
           	  			schoolLocation.map((data, index) => {
           	  				return (<div key={index}>
           	  					<div className="btn-info address-bar-box">
           	  						<h4><i className="fa fa-map-marker"></i>&nbsp;{data.title}</h4>
                     		</div>
           		          <div className="school-view-adress card-content">
                          <p>{data.address}<br/>
                          	{data.city},{data.state} - {data.zip}<br/>
                          	{data.country}
                          </p>
                              <div className="card-content" id="google-map" style={{height:'200px'}}>
                              </div>
                          </div>
           	  					</div>
           	  				)
           	  			})
           	  		}
           	  	</div>
           	  </div>	     
        		</div>     
        	</div>
        	{
        		schoolData.descHtml && (
		        	<div className="row  card">
		            <div className="col-md-12">
		              <div className="">
			              <div className="card-content">
			                <div className="content-list-heading">
				             	  <h2 className="card-title text-center">Description
				             	 	  <figure><img src="/images/heading-line.png"/></figure>
				             	  </h2>
			                  {schoolData.descHtml}
			                </div>
			             	</div>
		             	</div>
		            </div>
		          </div>     
        		)
        	}
        	<div className="row  card">
            <div className="col-sm-12 text-left">
              <div className="content-list-heading ">
               	<h2 className="text-center">{schoolData.name} offers the following class types
                  <figure>
                  	<img src="/images/heading-line.png"/>
                  </figure>
                </h2>
              </div>
            </div>
            <div className="col-sm-12">
          	{
          		classType.map((classTypeData, index)=> {
          		  console.log("classTypeData -->>",classTypeData)
          			const skillClass = SkillClass.find({classTypeId: classTypeData._id}).fetch();
          			return skillClass.map((skillClassData, index) => {
          				console.log("skillClassData -->>",skillClassData)
          				const imgUrl = this.getClassImageUrl(skillClassData.classTypeId, skillClassData.classImagePath);
          				return (<div className="col-md-4 npdagin npding">
          						<div className="card card-profile">
                     		<h4 className="tagline" title={skillClassData.className}>
                        	{classTypeData.skillTypeId} at {schoolData.name}
                     		</h4>
	                     	<div className="card-content">
											    <div className="" data-header-animation="false">
										        <div className="">
									            <div className="thumb " style={{backgroundImage: `url(${imgUrl})`, height: '155px', width:'100%'}}>
									            </div>
										        </div>
											    </div>
											    <div className="card-content">
	                          <h4 className="card-title">
	                            <a href="#">{skillClassData.className}</a>
	                          </h4>
	                          <div className="card-description">
	                            {classTypeData.desc}
	                            <br/>
	                            <br/>
	                            {this.getClassPrice(skillClassData.classTypeId)}  
	                          </div>
	                          <br/>
	                          <p className="text-center">
	                          	{ReactHtmlParser(this.viewSchedule(skillClassData))}
	                          </p>
	                        </div>
	                        <div className="card-footer">
												    <div className="col-sm-12 col-xs-12">
												      <a href="#" className="btn btn-danger btn_join_className btn_join_check" data-className="KCcabqEX4Kb5c58cW" data-className-type="YXdAyLNiR45yqiDXs">
												      	Add to my calendar! 
												      	<div className="ripple-container"></div>
												      </a>
												    </div>
												    <div className="clearfix"></div>
												    <div className="col-sm-12 col-xs-12" style={{padding: '5px'}}>
											        <div className="col-sm-9">
											            <p className="text-center">Toggle Weekend view </p>
											        </div>
											        <div className="col-sm-3 col-xs-3">
										            <div className="togglebutton">
									                <label>
								                    <input type="checkbox" data-id="KCcabqEX4Kb5c58cW" className="toggeleview" style={{position: 'absolute'}}/>
								                    <span className="toggle toggle-success"></span>
									                </label>
										            </div>
											        </div>
												    </div>
													</div>
												</div>
											</div>	
          					</div>
          				)
          			})
          		})
          	}
          	</div>
          </div>
          <MyCalender/>
        </div>     
			</div>
		</div>
	)
}