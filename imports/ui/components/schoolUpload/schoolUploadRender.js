import React from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {cutString} from '/imports/util';

const style = {
    rowStyle: {
        height: 45,
        width: '100%',
        margin: 5,
        // textAlign: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    colStyle: {
        display: "flex",
        minWidth: 150,
        padding: 2,
        textAlign: 'center'
    },
    fileUploadStyle: {
    	opacity: 0,
	    position: 'absolute',
	    top: 0,
	    // border: 1px solid black;
	    padding: 10
    },
    uploadFloat:{
        float: 'right'
    },
    spanHeight: {
        lineHeight: 3
    },
    spanHHeight: {
        lineHeight: 3,
        color: 'blue'
    }
};

export default function() {
    return (
    	<div className = "content" >
    		<div>
            <div style={style.uploadFloat}>
    			<TextField type="text"
     			 hintText="Select CSV"
                 value={this.state.fileUploadName}
    			/>
    			<input type="file" accept=".csv" onChange={(e)=>{this.fileSelected(e)}} ref={(ref)=>{this.fileInputRef = ref}} style={style.fileUploadStyle} />
                <RaisedButton
                    label="Upload"
                    labelColor ="#ffffff"
                    backgroundColor="#a4c639"
                    onClick= {()=>{this.uploadCSV()}}
                />
            </div>
    		</div>
    		<div>
                <Paper style = { style.rowStyle } zDepth = { 1 } >
                    <div style = { style.colStyle } >
                        <span style = { style.spanHHeight } >File Name</span>
                    </div>
                    <div style = { style.colStyle } >
                        <span style = { style.spanHHeight } >Status</span>
                    </div>
                    <div style = { style.colStyle } >
                        <span style = { style.spanHHeight } >Total Record</span>
                    </div>
                    <div style = { style.colStyle } >
                        <span style = { style.spanHHeight } >Sucess Count</span>
                    </div>
                    <div style = { style.colStyle } >
                        <span style = { style.spanHHeight } >ErrorRecord Count</span>
                    </div>
                </Paper>
                {this.props.importLogs && this.props.importLogs.map((logs, index) => {
                    return (
                        <Paper style = { style.rowStyle } zDepth = { 1 } >
                            <div style = { style.colStyle } >
                                <span style = { style.spanHeight } >{cutString(logs.fileName, 15)}</span>
                            </div>
                            <div style = { style.colStyle } >
                                <span style = { style.spanHeight } >{logs.status}</span>
                            </div>
                            <div style = { style.colStyle } >
                                <span style = { style.spanHeight } >{logs.totalRecord}</span>
                            </div>
                            <div style = { style.colStyle } >
                                <span style = { style.spanHeight } >{logs.sucessCount}</span>
                            </div>
                            <div style = { style.colStyle } >
                                <span style = { style.spanHeight } >{logs.errorRecordCount}</span>
                            </div>
	                    </Paper>
	                )
	            })}
        	</div>
        </div>
    )
}