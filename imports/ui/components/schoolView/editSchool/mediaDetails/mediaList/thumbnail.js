import React from "react";
import moment from 'moment';

export default class Thumbnail extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {}
  }

  getCreatorName = (thumbnailData) => {
  	if(thumbnailData && thumbnailData.creator && thumbnailData.creator.profile) {
  		let fullName = `${thumbnailData.creator.profile.firstName} ${thumbnailData.creator.profile.lastName}`;
  		return fullName || thumbnailData.creator.profile.nickame || ""
  	}
  	return
  }

  render() {
  	const { thumbnailData } = this.props;
    return (
    	<div className="thumbnail-wrapper col-sm-6" style={{position: 'absolute', margin: -100}}>
		    <div className="card card-product" data-count="1">
		        <div className="card-image" style={{margin: 5}} data-header-animation="true">
	                <img className="img" src={thumbnailData.sourcePath}/>
		            <div className="ripple-container"></div>
		        </div>
		        <div className="card-content" style={{padding: 0}}>
		            <div className="card-actions">
		                <button type="button" onClick={()=> {this.props.openEditMediaForm(thumbnailData)}} className="btn btn-success btn-simple" rel="tooltip" data-placement="bottom" title="" data-original-title="Edit">
		                    <i className="material-icons">edit</i>
		                </button>
		                <button type="button" onClick={()=> {this.props.onDelete(thumbnailData)}} className="btn btn-danger btn-simple" rel="tooltip" data-placement="bottom" title="" data-original-title="Remove">
		                    <i className="material-icons">close</i>
		                </button>
		            </div>
		        </div>
		        <div className="card-footer">
	                <h4>Image Name: {thumbnailData.name}</h4>
	                <h4>Taken: {moment(thumbnailData.createdAt).format('MMM Do YY, h:mm a')}</h4>
		        	<h4>By: {this.getCreatorName(thumbnailData)}</h4>
		        </div>
		    </div>
		</div>
    )
  }

}