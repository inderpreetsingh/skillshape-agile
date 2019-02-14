import React from 'react';
import Avatar from 'material-ui/Avatar';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import { verifyImageURL } from '/imports/util';
import ProgressiveImage from 'react-progressive-image';
import { get, isEmpty } from 'lodash';
import { sortByView } from './helpers.js';
{
	/*
1.Set profile pic for student.
2.Find letter in code.
3.Change letter with the pic.
*/
}
export default function (props) {
	const { src, collectionData, view, isAdmin, superAdminId } = props;
	let handleMemberDetailsToRightPanel;
	let membersByName = sortByView(view, collectionData);
	if (view == 'classmates') {
		handleMemberDetailsToRightPanel = this.props.handleMemberDetailsToRightPanel;
	} else {
		handleMemberDetailsToRightPanel = props.handleMemberDetailsToRightPanel;
	}
	return (
		<Grid container>
			{collectionData && collectionData.length > 0 ? (
				<Grid item sm={12} xs={12} md={12}>
					<Grid item sm={12} xs={12} md={12} style={{ padding: 8 }}>
						<Typography>
							{collectionData.length} {view == 'classmates' ? 'Students' : 'Admins'}
						</Typography>
					</Grid>
					<Grid item sm={12} xs={12} md={12}>
						<Grid container style={{ borderTop: 'solid 1px #ddd', marginTop: 'auto' }}>
							<List>
								{membersByName &&
									Object.keys(membersByName).sort().map((key) => {
										return [
											<ListItem
												style={{ borderBottom: 'solid 1px #dddd' }}
												key={key}
												dense
												button
											>
												<b>{key}</b>
												<hr />
											</ListItem>,
											membersByName[key] &&
											membersByName[key].map((data) => {
												let profile, pic, firstName, emails;
												if (view == 'classmates') {
													profile = data.profile.profile;
												} else {
													profile = data.profile;
												}
												emails = get(data.profile, "emails", []);
												pic = profile && profile.low ? profile.low : profile && profile.medium ? profile.medium : profile && profile.pic ? profile.pic : config.defaultProfilePicOptimized;
												firstName = get(profile, 'firstName', get(profile, 'name', get(emails[0], 'address', 'Old Data')));
												if (get(data, '_id', null) == superAdminId) {
													firstName = `${firstName} (SuperAdmin)`;
												}
												verifyImageURL(pic, (res) => {
													if (!res) {
														pic = config.defaultProfilePic;
													}
												});
												return (
													<ListItem
														key={data._id}
														dense
														button
														onClick={() =>
															handleMemberDetailsToRightPanel(data._id, superAdminId)}
													>
														<ProgressiveImage src={pic} placeholder={config.blurImage}>
															{(src) => (
																<Avatar alt="Remy Sharp" src={src}>
																	{!src && key}
																</Avatar>
															)}
														</ProgressiveImage>

														<ListItemText primary={firstName} style={{ textTransform: "capitalize" }} />
													</ListItem>
												);
											})
										];
									})}
							</List>
						</Grid>
					</Grid>
				</Grid>
			) : (
					''
				)}
		</Grid>
	);
}
