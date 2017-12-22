import React from "react";
import MediaFilter from './filter';
import MediaList from './mediaList';
import CreateMedia from './createMedia';
export default function () {

	const { showCreateMediaModal, mediaFormData, filterStatus } = this.state;
	const { schoolId, mediaData } = this.props;

	console.log("<<<<media details state --->>",this.state);
	return (
		<div>
			{
				showCreateMediaModal && <CreateMedia
					formType={showCreateMediaModal}
					schoolId={schoolId}
					ref="createMedia"
					onAdd={this.onAddMedia}
					onEdit={this.onEditMedia}
					mediaFormData={mediaFormData}
					filterStatus={filterStatus}
				/>
			}
			<div className="row">
				<MediaFilter
					onSearch={this.onSearch}
					resetFilter={this.resetFilter}
				/>
			</div>
			<div className="row">
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

			</div>
			<div className="row" style={{marginTop: 10}}>
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