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
				collectionData && (
					<Grid container>
						<Grid item xs={12} style={{display: 'inline-flex',justifyContent: 'center'}}>
							<div style={{maxWidth: 650}}>
								<ImageGalleryView
									onDelete={onDelete}
									openEditMediaForm={openEditMediaForm}
									showEditButton={showEditButton}
									images={collectionData.map((media)=>({original: media.sourcePath, thumbnail:media.sourcePath, media: media}))}
								/>
							</div>
						</Grid>
					</Grid>)
			}
			{/*
				collectionData && collectionData.map((media, index) => {
					return (
						<div
							key={index}
							className="thumb"
							onMouseEnter={() => this.setState({isHovering: true, thumbnailData: media, imgIndex: index})}
      						onMouseLeave={() => this.setState({isHovering: false, thumbnailData: null})}
							style={{
								backgroundImage: `url(${media.sourcePath})`,
								height:'125px',
								width:'125px',
								marginRight: '5px',
								cursor: 'pointer'
							}}
						>
							{
								isHovering && (imgIndex === index) && <Thumbnail thumbnailData={this.state.thumbnailData} {...this.props}/>
							}
						</div>
					)
				})
			*/}
		</div>
	)
}