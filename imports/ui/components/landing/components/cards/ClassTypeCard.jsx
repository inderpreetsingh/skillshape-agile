import { get, isEmpty } from 'lodash';
import React, { Component, Fragment } from 'react';
import { scroller } from 'react-scroll';
import styled from 'styled-components';
import ClassTimes from '/imports/api/classTimes/fields';
import School from '/imports/api/school/fields';
import CardsReveal from '/imports/ui/components/landing/components/cards/CardsReveal.jsx';
import ClassTypeCardBody from '/imports/ui/components/landing/components/cards/ClassTypeCardBody.jsx';
import ClassTypeCardDescription from '/imports/ui/components/landing/components/cards/ClassTypeCardDescription.jsx';
import ClassTimesDialogBox from '/imports/ui/components/landing/components/dialogs/ClassTimesDialogBox.jsx';
import ManageRequestsDialogBox from '/imports/ui/components/landing/components/dialogs/ManageRequestsDialogBox.jsx';
import { cardImgSrc } from '/imports/ui/components/landing/site-settings.js';
import { ContainerLoader } from '/imports/ui/loading/container.js';
import { formatClassTimesData, withPopUp } from '/imports/util';
import { getUserFullName } from '/imports/util/getUserData';
import { openMailToInNewTab } from '/imports/util/openInNewTabHelpers';

const CardsRevealWrapper = styled.div`width: 100%;`;

const imageExistsConfig = {
	originalImagePath: 'classTypeImg',
	defaultImage: cardImgSrc
};

class ClassTypeCard extends Component {
	state = {
		dialogOpen: false,
		manageRequestsDialog: false,
		isLoading: false,
		x: null,
		y: null
	};
	handleDialogState = (state) => (e) => {
		e && e.stopPropagation();
		this.setState({
			dialogOpen: state,
			classTimesDialogBoxError: null,
			x: e && e.pageX - 500,
			y: e && e.clientY - 200
		});

		// this.scrollTo("myScrollToElement");
	};
	scrollTo(name) {
		scroller.scrollTo(name || 'content-container', {
			duration: 800,
			delay: 0,
			smooth: 'easeInOutQuart'
		});
	}

	getClassTimes = (classTypeId) => {
		if (classTypeId) return ClassTimes.find({ classTypeId }).fetch();
	};

	getSchoolData = (schoolId) => {
		let schoolData = School.findOne(schoolId);
		return schoolData;
	};

	handleManageRequestsDialogState = (dialogState) => {
		this.setState({
			manageRequestsDialog: dialogState
		});
	};

	handleClassTimesRequest = () => {
		const { _id, schoolId, popUp } = this.props;
		if (!Meteor.userId()) {
			const newState = {
				...this.state,
				dialogOpen: false,
				manageRequestsDialog: true
			};
			this.setState(newState);
		} else {
			const data = {
				classTypeId: _id,
				schoolId: schoolId
			};

			Meteor.call('classTimesRequest.addRequest', data, (err, res) => {
				this.setState({ isBusy: false }, () => {
					if (err) {
						popUp.appear('error', { content: err.reason || err.message }, false);
					} else {
						popUp.appear('success', {
							content: 'Your request has been processed'
						});
						this.handleRequest(schoolId);
					}
				});
			});
		}
	};

	handleRequest = (schoolId) => {
		let schoolData = this.getSchoolData(schoolId);
		if (!isEmpty(schoolData)) {
			let emailBody = '';
			let url = `${Meteor.absoluteUrl()}schools/${schoolData.slug}`;
			let subject = '',
				message = '';
			let currentUserName = getUserFullName(Meteor.user());
			emailBody = `Hi %0D%0A%0D%0A I saw your listing on SkillShape.com ${url} and would like to attend. Can you please update your class times%3F %0D%0A%0D%0A Thanks`;
			const mailTo = `mailto:${schoolData && schoolData.email}?subject=${subject}&body=${emailBody}`;
			const mailToNormalized = /*encodeURI(*/ mailTo /*)*/;
			openMailToInNewTab(mailToNormalized);
		}
	};

	render() {
		{
			/*handleClassTimeRequest={this.handleClassTimeRequest.bind(this, this.props.schoolId)} */
		}
		let ratings, reviews;
		const {
			schoolId,
			_id,
			ageMin,
			ageMax,
			gender,
			experienceLevel,
			desc,
			name,
			selectedSkillSubject,
			reviewsStats,
			classInterestData,
			hideClassTypeOptions,
			bgImg,
			editMode,
			onEditClassTypeClick
		} = this.props;
		const cardRevealData = {
			_id: _id,
			schoolId: schoolId,
			ageMin: ageMin,
			ageMax: ageMax,
			gender: gender,
			experienceLevel: experienceLevel,
			description: desc,
			name: name
		};

		const classTimesData = this.getClassTimes(get(this.props, '_id', null));
		const formattedClassTimesData = formatClassTimesData(classTimesData).filter((data) => {
			if (data) return data.formattedClassTimesDetails.totalClassTimes > 0;
			else return false;
		});

		const schoolData = this.getSchoolData(schoolId);

		if (!isEmpty(reviewsStats)) {
			ratings = reviewsStats.ratings;
			reviews = reviewsStats.reviews;
		}

		return (
			<Fragment>
				{this.state.dialogOpen && (
					<ClassTimesDialogBox
						classTypeImg={bgImg}
						classInterestData={classInterestData}
						classTimesData={formattedClassTimesData}
						classTypeName={name}
						open={this.state.dialogOpen}
						onModalClose={this.handleDialogState(false)}
						handleClassTimeRequest={this.handleClassTimesRequest}
						hideClassTypeOptions={hideClassTypeOptions}
						errorText={this.state.classTimesDialogBoxError}
						x={this.state.x}
						y={this.state.y}
						{...this.props}
					/>
				)}
				{this.state.manageRequestsDialog && (
					<ManageRequestsDialogBox
						title={'Schedule Info'}
						open={this.state.manageRequestsDialog}
						onModalClose={() => this.handleManageRequestsDialogState(false)}
						requestFor={'class times'}
						submitBtnLabel={'Requests class times'}
						schoolData={schoolData}
						classTypeId={_id}
						onToastrClose={() => this.handleManageRequestsDialogState(false)}
					/>
				)}
				{this.state.isLoading && <ContainerLoader />}

				<CardsRevealWrapper>
					<CardsReveal
						{...this.props}
						bgImg={this.props.bgImg}
						body={
							<ClassTypeCardBody
								editMode={editMode}
								ratings={ratings}
								reviews={reviews}
								onEditClassTypeClick={onEditClassTypeClick}
								hideClassTypeOptions={hideClassTypeOptions}
								onJoinClassButtonClick={this.handleDialogState(true)}
							/>
						}
						descriptionContent={
							<ClassTypeCardDescription
								editMode={editMode}
								ratings={ratings}
								reviews={reviews}
								schoolData={schoolData}
								onEditClassTypeClick={onEditClassTypeClick}
								classTimeCheck={!isEmpty(formattedClassTimesData)}
								description={desc}
								onClassTimeButtonClick={this.handleDialogState(true)}
								onRequestClassTimeButtonClick={this.handleDialogState(true)}
								cardRevealInfo={cardRevealData}
								selectedSkillSubject={selectedSkillSubject}
								hideClassTypeOptions={hideClassTypeOptions}
								onEditClassTypeClick={onEditClassTypeClick}
							/>
						}
					/>
				</CardsRevealWrapper>
			</Fragment>
		);
	}
}

export default withPopUp(withImageExists(ClassTypeCard, imageExistsConfig));
