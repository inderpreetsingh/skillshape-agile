import React from "react";
import Thumbnail from './thumbnail';
import ImageGalleryView from "/imports/ui/componentHelpers/imageGalleryView";

export default function() {

	const { collectionData } = this.props;
	console.log("media list render props -->>",this.props);
	console.log("media list render state -->>",this.state);
	const { isHovering, thumbnailData, imgIndex } = this.state;


	return (
		<div className="col-sm-offset-2 col-sm-8 no-padding">
			{
				collectionData && <ImageGalleryView images={collectionData.map((media)=>({original: media.sourcePath, thumbnail:media.sourcePath }))} />
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