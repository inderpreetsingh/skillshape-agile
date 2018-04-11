import React from "react";
import styled from 'styled-components';

import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import isEmpty from 'lodash/isEmpty';

import Thumbnail from './thumbnail';
import ImageGalleryView from "/imports/ui/componentHelpers/imageGalleryView";

export default function() {

	const { collectionData, noMediaFound, showEditButton, onDelete, openEditMediaForm, memberExists, memberInfo } = this.props;
	console.log("media list render props -->>",this.props);
	console.log("media list render state -->>",this.state);
	const { isHovering, thumbnailData, imgIndex } = this.state;
	console.info('no Media found',noMediaFound);

	return (
		<div style={{textAlign:'center'}}>
			{
				isEmpty(collectionData) ? React.cloneElement(noMediaFound) : (
					<Grid container>
						<Grid item xs={12} style={{display: 'inline-flex',justifyContent: 'center'}}>
							<div style={{width: "100%"}}>
								<ImageGalleryView
									mediaSubscriptionReady={this.props.mediaSubscriptionReady}
									changeLimit={this.props.changeLimit}
									lazyLoad={true}
									onDelete={onDelete}
									openEditMediaForm={openEditMediaForm}
									showEditButton={showEditButton}
									images={collectionData.map((media)=>({original: media.sourcePath, thumbnail:media.sourcePath, media: media}))}
									showTagButton={memberExists}
									schoolData={this.props.schoolData}
									memberInfo={memberInfo}
								/>
							</div>
						</Grid>
					</Grid>)
			}
		</div>
	)
}
