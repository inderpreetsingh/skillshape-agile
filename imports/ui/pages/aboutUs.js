import React from 'react'

export default class AboutUs extends React.Component{

  constructor(props){
    super(props);
  }

  render(){
    return(
      <div className="content" >
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="card fontnormal">
                <div className="card-header text-center ">
                  <img src="/images/new-logo.png" alt="logo" width="48" style={{width: 'auto', height: '100px'}}/>
                  <h2 className="card-title" style={{color: 'orange'}}>Welcome to SkillShape!</h2>
                </div>
                <div className="card-content">
                  <p className="typo1">Our goal is to make it easier for you to join the communities and gain the skills you want by letting you see all the local opportunities in one place!</p>
                  <p className="typo1">Feel free to look around at all then className in your area and you can even suggest a className if it is not listed.</p>
                  <p className="typo1">If you create free membership account , you can add classNamees to your own SkillShape calender which syncs with many other calendars.</p>
                  <p className="typo1">If your school or gym participates,you may wish to subscribe for a full membership which will allow you to participate in their progress tracking educational software which help you and your teachers or trainers decide what you should focus on next progress.</p>
                  <p className="typo1">If you are a teacher or you own a school, you can open an instructor or administrator account and administer your school, keep track of safety,progress and track payments.</p>
                </div>
              </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-5">
            <div className="card card-stats fontnormal">
              <div className="card-header" data-background-color="green">
                <i className="material-icons">supervisor_account</i>
              </div>
            <div className="card-content ccnt">
              <h3 className="card-title cttb cttl" style={{color:'green'}}>Open a Student Account</h3>
            </div>
          <div className="card-footer">
            <div className="stats">
              <p className="typo1">Join Schools</p>
              <p className="typo1">Track your progress</p>
              <p className="typo1">Share milestones and Videos</p>
            </div>
          </div>
        </div>
        <div className="card card-stats fontnormal">
          <div className="card-header" data-background-color="green">
          <i className="material-icons">place</i>
        </div>
        <div className="card-content ccnt">
          <h3 className="card-title cttb cttl" style={{color:'green'}}>Upload your Local Listing</h3>
        </div>
        <div className="card-footer">
          <div className="stats">
            <p className="typo1">Update your Listing</p>
            <p className="typo1">Present your expertise</p>
            <p className="typo1">Bring in Students</p>
          </div>
        </div>
          </div>
          </div>
          <div className="col-md-7">
              <div className="card card-stats fontnormal" style={{minHeight:'540px'}}>
  <div className="card-header" data-background-color="green">
    <i className="material-icons">school</i>
  </div>
  <div className="card-content ccnt">
    <h3 className="card-title cttb" style={{color:'green'}}>Manage your school</h3>
  </div>
  <div className="card-footer">
    <div className="stats">
        <br/>
      <p className="typo1 weightbold">Manage Your Curriculum</p>
            <p className="typo1" style={{paddingLeft: '30px'}}>Create clear guidelines and hel students stay excited by seeing where they are going</p>
            <p className="typo1 weightbold">Monitor Student Exposure,Progress, and Safety</p>
            <p className="typo1" style={{paddingLeft: '30px'}}>Credut students for attending,evaluate on the fly, track safety issues, and build classNamees based on what is needed for the students that are present.</p>
            <p className="typo1 weightbold">Stay connected with Your Students</p>
            <p className="typo1" style={{paddingLeft: '30px'}}>Provide a way for your student to engage anf connect with your curriculum and community, even when yhey are not in className.</p>
    </div>
  </div>
</div>
          </div>
      </div>
      </div>
  </div>
    )
  }
}