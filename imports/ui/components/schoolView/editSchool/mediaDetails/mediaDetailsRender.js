import React from "react";
import MediaFilter from './filter';
import MediaList from './mediaList';
import CreateMedia from './createMedia';

export default function () {

	const { showCreateMediaModal, mediaFormData } = this.state;
	const { schoolId, mediaData } = this.props;

	return (
		<div>
			{
				showCreateMediaModal && <CreateMedia
					schoolId={schoolId}
					ref="createMedia"
					onAdd={this.onAddMedia}
					onEdit={this.onEditMedia}
					mediaFormData={mediaFormData}
				/>
			}
			<div className="row">
				<MediaFilter
					onSearch={this.onSearch}
					resetFilter={this.resetFilter}
				/>
			</div>
			<div className="row">
				<div className="col-sm-offset-2 col-sm-8 no-padding" style={{textAlign: 'center'}}>
					<h2>Thumbnails View</h2>
					<p>Create beautiful thumbnaiuls to display the content of your entire gallery. Upon clicking on the image an image lightbox will be opened. As an alternative you can redirect the images to specific URLs.</p>
				</div>
				<div className="col-sm-2 no-padding">
					<button onClick={()=> this.setState({showCreateMediaModal:true, mediaFormData: null})} className="btn btn-warning" type="button" >
       				  Add New Media 
      				</button>
				</div>
			</div>
			<div className="row">
				<MediaList
					mediaData={mediaData}
					schoolId={schoolId}
					onDelete={this.onDeleteMedia}
					openEditMediaForm={this.openEditMediaForm}
					{...this.state}
				/>
			</div>
		</div>
	)
}