import React from "react";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import embedCodeSettings from './embedCodeSettings';

export default function () {
	const { schoolData, moveTab } = this.props;
	
	return (
		<div className="tab-pane active" id="tab_default_10">
	        <div className="col-md-12">
	        	{
	        		embedCodeSettings.map((setting, index) => {
						let code = Meteor.absoluteUrl(`embed/schools/${schoolData.slug}/${setting.codeName}`) + "?height=800";
	        			let value = `<iframe src=${code} seamless="seamless" id="skillshape-embed" name="skillshape" frameborder="0" scrolling="no" style="width: 100%;height:840px;"></iframe>`
	        			return (
	        				<div key={index} className="col-sm-12 card" style={{paddingBottom: '20px'}}>
				                <h4 className="tagline"><b>{setting.title}</b></h4>
				                <div className="col-sm-12" id="iframe_code">
				                    <textarea
				                    	value={value}
				                    	onChange={() => this.setState({value, copied: false})}
				                    	id="iframe_code_textarea" 
				                    	className="form-group form-control embed-code_box" 
				                    	data-gramm="true" 
				                    	spellCheck="false" 
				                    	data-gramm_editor="true"
				                    >
				                    </textarea>
				                    
							        <CopyToClipboard text={value}
							          className="pull-right"
							          onCopy={() => {
							          	toastr.success("Code Copied","Success");
							          }}
							        >
							          <button>Copy to clipboard</button>
							        </CopyToClipboard>
				                </div>
				            </div>
	        			)
	        		})
	        	}
	       	</div> 	
	        <div className="pull-right">
            	<input type="button" onClick={()=> {moveTab("embed_codes")}} className="btn btn-next btn-fill btn-success btn-wd" name="next" id="nxt" value="Next" disabled/>
            	<input type="button" className="btn btn-finish btn-fill btn-rose btn-wd" name="finish" value="Finish" style={{display: 'none'}}/>
        	</div>
	        <div className="pull-left">
	            <input type="button" onClick={()=> {moveTab("media_details")}} className="btn btn-previous btn-fill btn-warning btn-wd" name="previous" value="Previous" id="prv"/>
	        </div>
        	<div className="clearfix"></div>
    	</div>
	)
}