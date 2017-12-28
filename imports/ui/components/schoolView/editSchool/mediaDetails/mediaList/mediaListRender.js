import React from "react";
import Grid from 'material-ui/Grid';

import Thumbnail from './thumbnail';
import ImageGalleryView from "/imports/ui/componentHelpers/imageGalleryView";

export default function() {

	const { collectionData, showEditButton, onDelete, openEditMediaForm } = this.props;
	console.log("media list render props -->>",this.props);
	console.log("media list render state -->>",this.state);
	const { isHovering, thumbnailData, imgIndex } = this.state;


	return (
		<div className="col-sm-offset-2 col-sm-8 no-padding">
			{
				collectionData.length && (
					<Grid container>
						<Grid item xs={12} style={{display: 'inline-flex',justifyContent: 'center'}}>
							<div style={{maxWidth: 650}}>
								<ImageGalleryView
									mediaSubscriptionReady={this.props.mediaSubscriptionReady}
									changeLimit = {this.props.changeLimit}
									lazyLoad={true}
									onDelete={onDelete}
									openEditMediaForm={openEditMediaForm}
									showEditButton={showEditButton}
									images={collectionData.map((media)=>({original: media.sourcePath, thumbnail:media.sourcePath, media: media}))}
								/>
							</div>
						</Grid>
					</Grid>)
			}
		</div>
	)
}