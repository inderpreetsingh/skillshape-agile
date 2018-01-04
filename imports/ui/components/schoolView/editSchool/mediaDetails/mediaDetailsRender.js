import React from "react";
import Grid from 'material-ui/Grid';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import Button from 'material-ui/Button';
import FileUpload from 'material-ui-icons/FileUpload';
import Switch from 'material-ui/Switch';
import { FormControlLabel, FormGroup } from 'material-ui/Form';

import { ContainerLoader } from '/imports/ui/loading/container.js';
import MediaFilter from './filter';
import MediaList from './mediaList';
import ImageGridGallery from './gridGallery/gridGalleryView.js';
import CreateMedia from './createMedia';

export default function () {

	const { showCreateMediaModal, mediaFormData, filterStatus, limit , isGalleryView} = this.state;
	const { schoolId, mediaData, classes, fullScreen, schoolView  } = this.props;
	console.log("<<<<media details state --->>",this.props);
	return (
		<div>
			{
				this.state.loading && <ContainerLoader />
			}
			 {!schoolView && <CreateMedia
			 	showCreateMediaModal={showCreateMediaModal}
			 	onClose = {this.closeMediaUpload}
				formType={showCreateMediaModal}
				schoolId={schoolId}
				ref="createMedia"
				onAdd={this.onAddMedia}
				onEdit={this.onEditMedia}
				mediaFormData={mediaFormData}
				filterStatus={filterStatus}
				showLoading = {this.showLoading}
			/>}
			{/*<div className="row">
				<MediaFilter
					onSearch={this.onSearch}
					resetFilter={this.resetFilter}
				/>
			</div>*/}
			<Grid container>
				<Grid item xs={12}>
					{!schoolView && <Card>
						<Grid container>
							<Grid item xs={6}>
								<FormGroup>
							        <FormControlLabel
							          style={{paddingLeft:13}}
							          control={
							            <Switch
								          checked={isGalleryView}
								          onChange={!isGalleryView ? ()=> this.setState({isGalleryView:true}): ()=> this.setState({isGalleryView:false})}
								          aria-label="galleryViewTrue"
								        />
							          }
							          label="Switch to Gallery view"
							        />
							    </FormGroup>
							</Grid>
							<Grid item xs={6}>
								<div style={{textAlign:"right",padding: 8}}>
									<Button raised color="accent" onClick={()=> this.setState({showCreateMediaModal:true, mediaFormData: null, filterStatus: false})}>
							          	Upload Media <FileUpload />
							        </Button>
						        </div>
				        	</Grid>
				        	<Grid item xs={12}>
				        		{/*if isGalleryView true then need to show gallery view*/}
				        		{isGalleryView ? <ImageGridGallery
				        			filters={{schoolId}}
				        			onDelete={this.onDeleteMedia}
									openEditMediaForm={this.openEditMediaForm}

				        			/> : <MediaList
						        	changeLimit = {this.changeLimit}
						        	limit= {limit || 0}
									mediaData={mediaData}
									schoolId={schoolId}
									onDelete={this.onDeleteMedia}
									openEditMediaForm={this.openEditMediaForm}
									showEditButton={true}
									{...this.state}
								/>}
				        	</Grid>
				        </Grid>
					</Card>}
					{schoolView &&
						<Grid container>

				        	<Grid item xs={12}>
						        <MediaList
						        	changeLimit = {this.changeLimit}
						        	limit= {limit || 0}
									mediaData={mediaData}
									schoolId={schoolId}
									onDelete={this.onDeleteMedia}
									openEditMediaForm={this.openEditMediaForm}
									showEditButton={false}
									{...this.state}
								/>
				        	</Grid>
				        </Grid>
					}
				</Grid>
			</Grid>

			{/*<div className="row">
				<div className="col-sm-3 col-offset-9 no-padding pull-right">
					<div className="card" style={{margin: 0, width:'86%'}}>
						<div className="card-body" style={{display: 'flex'}}>
							<div className="upload-box">
								<div className="upload-box-header text-center">
									<button onClick={()=> this.setState({showCreateMediaModal:"system", mediaFormData: null, filterStatus: false})} className="btn btn-warning" type="button" >
					   				  <i className="fa fa-upload" aria-hidden="true"></i>
					  				</button>
					  			</div>
					  			<div className="upload-box-footer text-center">
									<p>Upload From Computer</p>
					  			</div>
							</div>
							<div className="upload-box">
								<div className="upload-box-header text-center">
									<button onClick={()=> this.setState({showCreateMediaModal:"url", mediaFormData: null, filterStatus: false})} className="btn btn-warning" type="button" >
					   				  <i className="fa fa-globe" aria-hidden="true"></i>
					  				</button>
								</div>
								<div className="upload-box-footer text-center">
									<p>Upload From URL's</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>*/}


		</div>
	)
}