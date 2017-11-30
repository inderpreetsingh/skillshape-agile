import React from 'react';
import { imageRegex } from '/imports/util';
import { ContainerLoader } from '/imports/ui/loading/container';
import '/imports/api/media/methods';

const formId = "create-media";

export default class CreateMedia extends React.Component {

	constructor(props) {
        super(props);
        this.state = {
        	isBusy: false,
        }
    }

    componentDidMount() {
	    this.handleModal();
	    this.initializeFormValues();		
	}

	componentDidUpdate() {
	    this.handleModal();
	    this.initializeFormValues();
	}

	initializeFormValues = () => {
		let { mediaFormData } = this.props;
		this.refs.mediaFile.value = null
		$(this.refs.mediaFile).change();
		if(mediaFormData) {
			this.refs.mediaName.value = mediaFormData.name || null
			this.refs.mediaNotes.value = mediaFormData.notes || null
			this.refs.mediaImg.src = mediaFormData.sourcePath;
		} else {
			this.refs.mediaName.value = null
			this.refs.mediaNotes.value = null
		}
		
	}

  	handleModal = () => {
	    $('#createMedia').appendTo("body").modal('show')
	    $('#createMedia').on('hidden.bs.modal', () => {
	      $('#createMedia').modal('hide')
	    })    
  	}

  	hideModal = () => {
  		this.setState({isBusy:false})
  		$('#createMedia').modal('hide')
  	}

  	getFileType = (file) => {
  		if (file.type.match('image/*')) {
        	return "Image";
      	} else if (file.type.match('video/*') || file.type.match('audio/*')) {
        	return "Media";
      	} else {
        	return "Document";
      	}
  	}

  	onSubmit = (event) => {
  		event.preventDefault()
  		this.setState({isBusy:true})
  		const file = this.refs.mediaFile.files[0];
  		const { mediaFormData } = this.props;
  		const mediaData = {
  			"name": this.refs.mediaName.value,
  			"desc": this.refs.mediaNotes.value,
  			"schoolId": this.props.schoolId,
  			"type": file && this.getFileType(file),
  		}
 		console.log("onSubmit file",file)
 		console.log("onSubmit mediaData",mediaData)

  		if(mediaFormData) {
  			this.props.onEdit({editKey: mediaFormData._id , data: mediaData, fileData:file});
  		} else {
	  		this.props.onAdd(mediaData, file);
  		}
  	
  	}

    render() {
    	let { mediaFormData } = this.props;
    	console.log("createMedia props -->>",this.props)
	    return (
		    <div className="modal fade " id="createMedia" role="dialog">
        		<div className="modal-dialog" style={{minWidth: '850px'}}>
          			<div className={`modal-content`}>
            
			            <div className="modal-header">
			              <button type="button" className="close" data-dismiss="modal">×</button>
			              <h4 className="modal-title">Media Upload</h4>
			            </div>
            
	            		<div className="modal-body">
	            			{this.state.isBusy && <ContainerLoader/>}
	            			<form id={formId} className="formmyModal" onSubmit={this.onSubmit}>
	            				<div className="row">
    								<div className="col-sm-8">
    									<div className="form-group is-empty">
								            <label>
								                Media Name *
								            </label>
								            <input 
								            	type="text"
								            	ref="mediaName"  
								            	className="form-control form-mandatory onChangeClassType" 
								            	required="true"
								           	/>
								            <span className="material-input"></span>
								            <span className="material-input"></span>
								        </div>
								        <div className="form-group is-empty">
								            <label>
								                Notes
								            </label>
								            <textarea
								            	ref="mediaNotes"  
									            className="form-control"
									            row="4"
									            style={{border: '1px solid black'}} 
									        />
								            <span className="material-input"></span>
								            <span className="material-input"></span>
								        </div>
    								</div>
    								<div className="col-sm-4">
    									<div className="card">
										    <div className="card-header" data-background-color="blue">
										        <i className="material-icons">file_upload</i>
										    </div>
										    <div className="card-content bootstrap-dialog-footer">
										        <p className="category">Upload Media</p>
										        <div className="fileinput card-button text-right fileinput-new" data-provides="fileinput">
										            {
										            	mediaFormData && <div className="fileinput-new card-button thumbnail">
										                	<img className="" ref="mediaImg" alt="Profile Image" />
										            	</div>
										        	}
										            <div className="fileinput-preview fileinput-exists thumbnail" style={{marginTop: '10px'}}></div>
										            <div>
										                <span className="btn btn-warning btn-sm btn-file">
							                                <span className="fileinput-new">Select</span>
										                	<span className="fileinput-exists">Change</span>
										                	<input type="hidden"/>
										                	<input type="hidden" value="" name="..."/>
										                	<input type="file" name="" required={mediaFormData ? false : true} ref="mediaFile"/>
										                	<div className="ripple-container"></div>
										                </span>
										                <a href="#" className="btn btn-danger btn-sm fileinput-exists" data-dismiss="fileinput">
										                    <i className="fa fa-times"></i>Remove
										                </a>
										            </div>
										            
										        </div>
										        {/*<div className="card-footer text-center">
										            <a href="#" className="btn_upload">
										                <div className="">
										                    <i className="material-icons text-warning link">link</i>
										                    <h4 className="card-title"><b>Link to Media</b></h4>
										                </div>
										            </a>
										        </div>*/}
										    </div>
										</div>
    								</div>
    							</div>	
	            			</form>
	            		</div>

	            		<div className="modal-footer">
	            			<button  
						        form={formId} 
						        type="submit" 
						        className="btn btn-success"
						    >
						        ADD
						    </button>
						    <button  
						        type="button" 
						        className="btn btn-default" 
						        data-dismiss="modal"
						    >
						        Cancel
						    </button>
	            		</div>
	            	</div>
	            </div>
	        </div>    		
	    )
    }
}