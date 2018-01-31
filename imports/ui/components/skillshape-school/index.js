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
			margin: theme.spacing.unit,
			display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%'
		},
		actions: {
		}
	}
}

const MainContentWrapper = styled.div`
    width: 100%;
    border: 1px solid black;
    padding: 30px;
    margin-bottom: 5px;
`;

const TitleWrapper = styled.div`
	margin-left: 40px;
	margin-top: 10px;
`;

const MainContainer = styled.div`
	padding: 5px;
`;

const SkillShapeSchool = (props) => {

	return (
		<MainContainer>
			<MainContentWrapper>
				<ul>
					<li>
						This is your school
					</li>
					<li>
						Amazing things happen when people enter these doors.
					</li>
				</ul>
			</MainContentWrapper>
			<MainContentWrapper>
				<TitleWrapper>
					<Typography type="body1">
				        As a school, you face 3 main problems:
				    </Typography>
				</TitleWrapper>
			    <ol>
			    	<li>
						Bringing people in.
					</li>
					<li>
						Keeping students engaged and excited about learning with you.
					</li>
					<li>
						Managing the administrative chores of the school.
					</li>
			    </ol>
			</MainContentWrapper>
			<MainContentWrapper>
				<TitleWrapper>
					<Typography type="body1">
			    		At SkillShape, we bring you solutions to all 3 of these challenges.
				    </Typography>
				</TitleWrapper>
				<ol>
			    	<li>
						Bringing People In
						<br></br>
						<ol type="a">
							<li>
								SkillShape’s beautiful directory highlights your school and it’s offerings, and makes it easy for students to search by times, skill level, age, location, and other parameters to find the class that truly meets their needs.
							</li>
							<br></br>
							<li>
								Our Patented Media Management system allows students to socially share video and images taken of them at your school, with a link to your school. When their friends see what they are doing, they will be more likely to join!
							</li>
							<br></br>
							<li>
								How will students join your classes if they have trouble finding or understanding your calendar or pricing? SkillShape’s Calendar Frame, Pricing Frame, and Media Frames bring our thoughtfully crafted student interfaces to your website. These frames increase the beauty and professionalism of your website, attracting more students. Just install the plugin or insert the &lt;code&gt; snippet wherever you want it on your site. Now students have an interactive calendar, pricing table, and media views that will inform you when a student is interested in your classes, allowing you to follow up.
							</li>
							<br></br>
							<li>
								SkillShape’s SkillBoard platform allows you to pay a flat monthly fee for access to classes from any participating school. By joining SkillBoard you will see a steady flow of students who will become aware of and experience your classes, potentially signing on for long term enrollment in your school.
							</li>
						</ol>
					</li>
					<br></br>
					<li>
						Keeping students engaged and excited about your school.
						<br></br>
						SkillShape offers a few ways to keep your students engaged and excited.
						<br></br>
						<ol type="a">
							<li>
								One of the best things about learning with actual people in actual schools is the potential for camaraderie and fellowship. Schools that encourage this community do better. Students feel better about the school and will encourage their friends and family to join. If you choose to enable it, SkillShape offers a Class Chat. Students enrolled in a class can chat with each other to plan outings after class or organize transportation or special events. This same function allows you to inform students when the teacher will be late or classes are cancelled.
							</li>
							<br></br>
							<li>
								When students join online, they get access to a training materials area that you can easily create with your phone. In this area, you can list all of the skills and techniques you cover, and provide text and/or media overviews of therefor all your students, and, if you like, advanced trainings for an extra fee.
							</li>
							<br></br>
							<li>
								SkillShape can keep track of attendance inform you when a student drops off attendance. SkillShape can also send an email to the student from you, checking in and seeing if they need anything to help them continue training.
							</li>
							<br></br>
							<li>
								If you enable SkillShape’s Class Progression System, easily plan classes based on the skills or techniques you will cover, and track each student’s exposure when they attend classes.Combined with formal or on-the-fly evaluations, you can see the level of students in a class, teach based on the needs of the students in that class, and help students plan their progression to the next level.
							</li>
						</ol>
					</li>
					<br></br>
					<li>
						Managing School Administration
						<br></br>
						SkillShape helps you manage many of the chores associated with running a school.
						<br></br>
						<ol type="a">
							<li>
								Keeping calendars and pricing up to date: SkillShape’s clean ant intuitive interface allows you to log in ant update your website and SkillShap Listing in one place.
							</li>
							<br></br>
							<li>
								Tracking Students: Payments, enrollment, progress, incident tracking, and just putting a name to a face. Students can enroll and check into class from their phone, and from your phone, you can see who is in class, check students in, and see your own notes about each student. Also, you can contact students about special events, when their enrollment declines, or just on their birthdays!
							</li>
							<br></br>
							<li>
								Financial Management: Students can enroll, and purchase monthly or per class packages. They can set up automatic withdrawal using credit cards or bank transfer for lower fees. They can be informed when their package is almost used up and prompted to renew. Students can also purchase merchandise or gift cards for friends and family.
							</li>
							<br></br>
							<li>
								If you rent out rooms in your school, you can easily delegate a room, allowing other schools to operate seamlessly within your facility,
								<br></br>
								Managing specific times and students within your school while you manage financials, or
								<br></br>
								Managing their own times, students, and financials within their own school, within your facility.
							</li>
							<br></br>
							So sign up for a SkillShape School Account and see what everyone is talking about!
						</ol>
					</li>
			    </ol>
			</MainContentWrapper>
			<MainContentWrapper>
				<Grid container>
					<Grid item md={4} sm={4} xs={12}>
						<Card className={props.classes.card}>
							<CardHeader
					            title="Free:"
					        />
					        <CardContent>
								<ul>
									<li>
										Chat Group,
									</li>
									<li>
										Media,
									</li>
									<li>
										Management,
									</li>
									<li>
										Frames,
									</li>
									<li>
										Directory,
									</li>
									<li>
										Students,
									</li>
									<li>
										Enrollment and Notes,
									</li>
									<li>
										Social Sharing.
									</li>
								</ul>
					        </CardContent>
					        <CardActions className={props.classes.actions}>
					            <Button color="accent" style={{width: '100%'}} dense>
					            	Coming Soon!
					            </Button>
					        </CardActions>
						</Card>
					</Grid>

					<Grid item md={4} sm={4} xs={12}>
						<Card className={props.classes.card}>
							<CardHeader
					            title="Fundamental:"
					            subheader="All FREE Features, PLUS"
					        />
							<CardContent>
								<ul>
									<li>
										Attendance Tracking,
									</li>
									<li>
										Payments Gateway,
									</li>
									<li>
										Incident Accident Citation and Recommendations to Students,
									</li>
									<li>
										Skill Inventory.
									</li>
								</ul>
					        </CardContent>
					        <CardActions className={props.classes.actions}>
					            <Button color="accent" style={{width: '100%'}} dense>
					            	Coming Soon!
					            </Button>
					        </CardActions>
						</Card>
					</Grid>

					<Grid item md={4} sm={4} xs={12}>
						<Card className={props.classes.card}>
							<CardHeader
					            title="Full-Featured:"
					            subheader="All Fundamental Features, PLUS"
					        />
							<CardContent>
								<ul>
									<li>
										Premium Advanced Training,
									</li>
									<li>
										Progress Tracking for Students,
									</li>
									<li>
										eMail Marketing System,
									</li>
									<li>
										Merchandise and Inventory,
									</li>
									<li>
										Private School Apps for iPhone and Android.
									</li>
								</ul>
					        </CardContent>
					        <CardActions className={props.classes.actions}>
					            <Button color="accent" style={{width: '100%'}} dense>
					            	Coming Soon!
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