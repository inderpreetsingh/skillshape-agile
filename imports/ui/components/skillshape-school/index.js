import React from 'react';
import styled from 'styled-components';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Card, { CardContent, CardHeader, CardActions } from 'material-ui/Card';

import { withStyles } from '/imports/util';

const style = theme => {
	return {
		card: {
			margin:theme.spacing.unit,
            flexDirection: 'column',
            height: '80%',
            borderRadius: theme.spacing.unit - 2
		},
		actions: {
		},
		typoText: {
			font: '400 18px/1.4 "Open Sans", sans-serif',
			color: '#fff',
		},
		typoFont: {
			font: '400 18px/1.4 "Open Sans", sans-serif',
		},
		aboutUs: {
		  height: '520px',
		  width: '100%',
		  display: 'flex',
		  overflow: 'hidden',
		  position: 'relative',
		  font: '400 18px/1.4 "Open Sans", sans-serif',
		  color: '#fff',
		  backgroundSize: 'cover',
		  backgroundPosition: '50% 50%',
		  zIndex: 1,
		  opacity: 0.8,
		},
		problemsDiv: {
		  height: '520px',
		  width: '100%',
		  display: 'flex',
		  background: '#58409e',
		  overflow: 'hidden',
		  position: 'relative',
		  zIndex: 1,
		  font: '400 18px/1.4 "Open Sans", sans-serif',
		  color: '#fff',
		  backgroundSize: 'cover',
		  backgroundPosition: '50% 50%',
		  backgroundColor:'#0288d1',
		  background: 'linear-gradient(to right, #28b0ce 0%, #28b0ce 13%, #2fa9cd 27%, #389fce 41%, #5a7bcb 80%, #666fcb 100%)',
		},
		bringPeopleIn: {
		  width: '100%',
		  display: 'flex',
		  background: '#58409e',
		  overflow: 'hidden',
		  position: 'relative',
		  zIndex: 1,
		  font: '400 18px/1.4 "Open Sans", sans-serif',
		  color: '#fff',
		  backgroundSize: 'cover',
		  backgroundPosition: '50% 50%',
		  backgroundColor:'#0288d1',
		  background: 'linear-gradient(#28b0ce 0%, #28b0ce 13%, #2fa9cd 27%, #389fce 41%, #5a7bcb 80%, #666fcb 100%)',
		},
		keepStudentEngaged: {
		  width: '100%',
		  display: 'flex',
		  background: '#58409e',
		  overflow: 'hidden',
		  position: 'relative',
		  zIndex: 1,
		  font: '400 18px/1.4 "Open Sans", sans-serif',
		  color: '#655454fc',
		  backgroundSize: 'cover',
		  backgroundPosition: '50% 50%',
		  backgroundColor:'rgba(253, 184, 59, 0.8)',
		  background: 'linear-gradient(#28b0ce 0%, #28b0ce 13%, #2fa9cd 27%, #389fce 41%, #5a7bcb 80%, #666fcb 100%)',

		  // background: 'rgba(253, 184, 59, 0.8)',
		},
		manageAdministration: {
		  width: '100%',
		  display: 'flex',
		  background: '#58409e',
		  overflow: 'hidden',
		  position: 'relative',
		  zIndex: 1,
		  font: '400 18px/1.4 "Open Sans", sans-serif',
		  color: '#fff',
		  backgroundSize: 'cover',
		  backgroundPosition: '50% 50%',
		  backgroundColor:'#58409e;',
		  background: 'linear-gradient(to right, #3fc49c 0%, #3ac6ae 24%, #2acde5 78%, #25cff6 100%)',
		  content: '',
		},
		pricingBlocks: {
			padding: '15px',
			textAlign: 'center',
			borderBottomWidth: '1px',
			borderBottomStyle: 'solid',
			borderColor: '#e0e0e0'
		},
		letsHandleIt: {
		    borderRadius: '50px',
		    fontSize: '16px',
		    lineHeight: '1.8em',
		    paddingLeft: '30px',
		    paddingRight: '30px',
		    borderColor: '#081452',
		    background: '#081452',
		    color: '#fff',
		    borderWidth: '1px',
		    borderStyle: 'solid',
		    margin: 'auto',
		    minWidth: '8em'
		},
		styleGrid: {
			padding: '8px',
			display: 'table',
			height: 'inherit',
			width: 'inherit'
		}
	}
}

const MainContentWrapper = styled.div`
    width: 100%;
    padding: 30px;
`;

const TitleWrapper = styled.div`
	margin-left: 40px;
	margin-top: 10px;
`;

const MainContainer = styled.div`
`;

const SkillShapeSchool = (props) => {

	return (
		<MainContainer>
			<MainContentWrapper className={props.classes.aboutUs}>
				<div className="bg-stretch" style={{backgroundImage: 'linear-gradient(to right,grey 50%,yellow 100%),url(images/aboutUs/ballet.jpg)',backgroundBlendMode: 'darken',filter: 'none'}}/>
				<div style={{textAlign: 'center',padding: '100px 16px',position: 'absolute',top: 0,left: 0,bottom: 0,right: 0}}>
					<h1 style={{font: '400 36px/1.2 "Open Sans", sans-serif'}}>
						This is your school
					</h1>
					<Typography className={props.classes.typoText}>
						Amazing things happen when people enter these doors.
					</Typography>
				</div>
			</MainContentWrapper>
			<MainContentWrapper className={props.classes.problemsDiv}>
				<div className="bg-stretch" style={{backgroundImage: 'url(images/aboutUs/Continuing-Wisdom.jpg)',filter: 'opacity(0.6)'}}/>
				<div style={{margin:'auto', zIndex: 1}}>
					<h1 style={{font: '400 36px/1.2 "Open Sans", sans-serif',textAlign:'center'}}>
				        As a school, you face 3 main problems
				    </h1>
				    <ol style={{justifySelf: 'center',maxWidth: '609px',margin: 'auto'}}>
				    	<li className={props.classes.typoText}>
							Bringing people in.
						</li>
						<li className={props.classes.typoText}>
							Keeping students engaged and excited about learning with you.
						</li>
						<li className={props.classes.typoText}>
							Managing the administrative chores of the school.
						</li>
				    </ol>
					<h2 style={{font: '"Open Sans", sans-serif', textAlign:'center'}}>
			    		At SkillShape, we bring you solutions to all 3 of these challenges.
				    </h2>
			    </div>
			</MainContentWrapper>
			<MainContentWrapper className={props.classes.bringPeopleIn}>
				<div className="bg-stretch" style={{backgroundImage: 'url(images/aboutUs/karate.jpg)'}}/>
				<div style={{margin:'auto',zIndex: 1}}>
					<h1 style={{font: '400 36px/1.2 "Open Sans", sans-serif',textAlign:'center'}}>
				        Bringing People In
				    </h1>
					<ul type="a" style={{margin: 'auto',maxWidth: '743px'}}>
						<li className={props.classes.typoText}>
							SkillShape’s beautiful directory highlights your school and it’s offerings, and makes it easy for students to search by times, skill level, age, location, and other parameters to find the class that truly meets their needs.
						</li>
						<br></br>
						<li className={props.classes.typoText}>
							Our Patented Media Management system allows students to socially share video and images taken of them at your school, with a link to your school. When their friends see what they are doing, they will be more likely to join!
						</li>
						<br></br>
						<li className={props.classes.typoText}>
							How will students join your classes if they have trouble finding or understanding your calendar or pricing? SkillShape’s Calendar Frame, Pricing Frame, and Media Frames bring our thoughtfully crafted student interfaces to your website. These frames increase the beauty and professionalism of your website, attracting more students. Just install the plugin or insert the &lt;code&gt; snippet wherever you want it on your site. Now students have an interactive calendar, pricing table, and media views that will inform you when a student is interested in your classes, allowing you to follow up.
						</li>
						<br></br>
						<li className={props.classes.typoText}>
							SkillShape’s SkillBoard platform allows students to pay a flat monthly fee for access to classes from any participating school. By joining SkillBoard you will see a steady flow of students who will become aware of and experience your classes, potentially signing on for long term enrollment in your school.
						</li>
					</ul>
				</div>
			</MainContentWrapper>
			<MainContentWrapper className={props.classes.keepStudentEngaged}>
					<div className="bg-stretch"  style={{ backgroundImage: 'url(images/aboutUs/Gold-Co.jpg)',filter: 'opacity(0.1)'}}/>
					<div style={{margin:'auto', zIndex: 1}}>
						<h1 style={{font: '400 36px/1.2 "Open Sans", sans-serif',textAlign:'center',color:'#fff'}}>
					        Keeping students engaged and excited about your school
					    </h1>
						<Typography style={{color: '#655454fc',textAlign: 'center', color:'#fff'}}>SkillShape offers a few ways to keep your students engaged and excited.</Typography>
						<ul type="a" style={{margin: 'auto',marginTop: '24px',maxWidth: '743px', color:'#655454fc'}}>
							<li className={props.classes.typoText}>
								One of the best things about learning with actual people in actual schools is the potential for camaraderie and fellowship. Schools that encourage this community do better. Students feel better about the school and will encourage their friends and family to join. If you choose to enable it, SkillShape offers a Class Chat. Students enrolled in a class can chat with each other to plan outings after class or organize transportation or special events. This same function allows you to inform students when the teacher will be late or classes are cancelled.
							</li>
							<br></br>
							<li className={props.classes.typoText}>
								When students join online, they get access to a training materials area that you can easily create with your phone. In this area, you can list all of the skills and techniques you cover, and provide text and/or media overviews of therefor all your students, and, if you like, advanced trainings for an extra fee.
							</li>
							<br></br>
							<li className={props.classes.typoText}>
								SkillShape can keep track of attendance inform you when a student drops off attendance. SkillShape can also send an email to the student from you, checking in and seeing if they need anything to help them continue training.
							</li>
							<br></br>
							<li className={props.classes.typoText}>
								If you enable SkillShape’s Class Progression System, easily plan classes based on the skills or techniques you will cover, and track each student’s exposure when they attend classes.Combined with formal or on-the-fly evaluations, you can see the level of students in a class, teach based on the needs of the students in that class, and help students plan their progression to the next level.
							</li>
						</ul>
					</div>
			</MainContentWrapper>
			<MainContentWrapper className={props.classes.manageAdministration}>
				<div className="bg-stretch"  style={{backgroundImage: 'url(images/aboutUs/quickorder.jpg)'}}/>
					<div style={{margin:'auto', zIndex: 1}}>
						<h1 style={{font: '400 36px/1.2 "Open Sans", sans-serif',textAlign:'center'}}>
					        Managing School Administration
					    </h1>
						<Typography style={{textAlign: 'center',color: '#fff'}}>SkillShape helps you manage many of the chores associated with running a school.</Typography>
						<ul type="a" style={{margin: 'auto',marginTop: '24px',maxWidth: '743px'}}>
							<li className={props.classes.typoFont}>
								Keeping calendars and pricing up to date: SkillShape’s clean ant intuitive interface allows you to log in ant update your website and SkillShap Listing in one place.
							</li>
							<br></br>
							<li className={props.classes.typoFont}>
								Tracking Students: Payments, enrollment, progress, incident tracking, and just putting a name to a face. Students can enroll and check into class from their phone, and from your phone, you can see who is in class, check students in, and see your own notes about each student. Also, you can contact students about special events, when their enrollment declines, or just on their birthdays!
							</li>
							<br></br>
							<li className={props.classes.typoFont}>
								Financial Management: Students can enroll, and purchase monthly or per class packages. They can set up automatic withdrawal using credit cards or bank transfer for lower fees. They can be informed when their package is almost used up and prompted to renew. Students can also purchase merchandise or gift cards for friends and family.
							</li>
							<br></br>
							<li className={props.classes.typoFont}>
								If you rent out rooms in your school, you can easily delegate a room, allowing other schools to operate seamlessly within your facility,
								<br></br>
								Managing specific times and students within your school while you manage financials, or
								<br></br>
								Managing their own times, students, and financials within their own school, within your facility.
							</li>
							<br></br>
							<h2 style={{font: '"Open Sans", sans-serif', textAlign:'center'}}>So sign up for a SkillShape School Account and see what everyone is talking about!</h2>
						</ul>
						</div>
			</MainContentWrapper>
			<MainContentWrapper>
				<Grid container style={{margin: 'auto',maxWidth: '1000px'}}>
					<Grid item md={4} sm={4} xs={12} className={props.classes.styleGrid}>
						<div style={{textAlign:'center'}}>
							<img style={{verticalAlign:'bottom',left:'auto',right:'auto'}} role="presentation" src="/images/pricing-free.svg"/>
						</div>
						<Card className={props.classes.card}>
							<CardHeader
					            title="Free"
					            style={{textAlign:'center'}}
					        />
				        	<div className={props.classes.pricingBlocks}>
					        	<div>
									<Typography>
										Chat Group
									</Typography>
					        	</div>
				        	</div>
				        	<div className={props.classes.pricingBlocks}>
				        		<div>
									<Typography>
										Media Management
									</Typography>
				        		</div>
							</div>
							<div className={props.classes.pricingBlocks}>
								<div>
									<Typography>
										Web Frames
									</Typography>
								</div>
							</div>
							<div className={props.classes.pricingBlocks}>
								<div>
									<Typography>
										Directory
									</Typography>
								</div>
							</div>
							<div className={props.classes.pricingBlocks}>
								<div>
									<Typography>
										Student Enrollment and Notes
									</Typography>
								</div>
							</div>
							<div className={props.classes.pricingBlocks} className={props.classes.pricingBlocks}>
								<div>
									<Typography>
										Social Sharing
									</Typography>
								</div>
							</div>
					        <CardActions className={props.classes.actions}>
					            <Button color="accent" className={props.classes.letsHandleIt} dense onClick={this.doSignUp}>
					            	Start Fee Today!
					            </Button>
					        </CardActions>
						</Card>
					</Grid>

					<Grid item md={4} sm={4} xs={12} className={props.classes.styleGrid}>
						<div style={{textAlign:'center'}}>
							<img style={{verticalAlign:'bottom',left:'auto',right:'auto'}} role="presentation" src="/images/pricing-pro.svg"/>
						</div>
						<Card className={props.classes.card}>
							<CardHeader
					            title="Fundamental"
					            subheader="All FREE Features, PLUS"
					            style={{textAlign:'center'}}
					        />
							<div className={props.classes.pricingBlocks}>
								<div>
									<Typography>
										Attendance Tracking
									</Typography>
								</div>
							</div>
							<div className={props.classes.pricingBlocks}>
								<div>
									<Typography>
										Payments Gateway
									</Typography>
								</div>
							</div>
							<div className={props.classes.pricingBlocks}>
								<div>
									<Typography>
										Incident Accident Citation and Recommendations to Students,
									</Typography>
								</div>
							</div>
							<div className={props.classes.pricingBlocks}>
								<div>
									<Typography>
										Skill Inventory
									</Typography>
								</div>
							</div>


					        <CardActions className={props.classes.actions}>
					            <Button color="accent" style={{width: '100%'}} dense>
					            	Coming Soon
					            </Button>
					        </CardActions>
						</Card>
					</Grid>

					<Grid item md={4} sm={4} xs={12} className={props.classes.styleGrid}>
						<div style={{textAlign:'center'}}>
							<img style={{verticalAlign:'bottom',left:'auto',right:'auto'}} role="presentation" src="/images/pricing-pro.svg"/>
						</div>
						<Card className={props.classes.card}>
							<CardHeader
					            title="Full-Featured"
					            subheader="All Fundamental Features, PLUS"
					            style={{textAlign:'center'}}
					        />
							<div className={props.classes.pricingBlocks}>
								<div>
									<Typography>
										Premium Advanced Training
									</Typography>
								</div>
							</div>
							<div className={props.classes.pricingBlocks}>
								<div>
									<Typography>
										Progress Tracking for Students
									</Typography>
								</div>
							</div>
							<div className={props.classes.pricingBlocks}>
								<div>
									<Typography>
										eMail Marketing System
									</Typography>
								</div>
							</div>
							<div className={props.classes.pricingBlocks}>
								<div>
									<Typography>
										Merchandise and Inventory
									</Typography>
								</div>
							</div>
							<div className={props.classes.pricingBlocks}>
								<div>
									<Typography>
										Private School Apps for iPhone and Android
									</Typography>
								</div>
							</div>
					        <CardActions className={props.classes.actions}>
					            <Button color="accent" style={{width: '100%'}} dense>
					            	Coming Soon
					            </Button>
					        </CardActions>
						</Card>
					</Grid>
				</Grid>
			</MainContentWrapper>
		</MainContainer>
	)
}

export default withStyles(style)(SkillShapeSchool);