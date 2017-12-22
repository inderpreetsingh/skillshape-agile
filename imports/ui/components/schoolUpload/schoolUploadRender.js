import React from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { cutString } from '/imports/util';
import { ImportLogTable } from './importLogTable';
import moment from 'moment';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

const style = {
    fileUploadStyle: {
    	opacity: 0,
	    position: 'absolute',
	    top: 0,
	    padding: 13
    },
    uploadFloat:{
        float: 'right'
    },
    'w211': {
        width: 211
    },
    'w100': {
        width: 100
    },
    'w150': {
        width: 150
    }

};

export default function() {
    return (
    	<div className = "content" >
    		<div style={{display: "inline-block",width:'100%'}}>
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
                <div style={{overflowX: "auto"}}>
                    <ImportLogTable>
                            {this.props.importLogs && this.props.importLogs.map((logs, index) => {
                                return (
                                  <TableRow selectable={false}>
                                    <TableRowColumn style={style.w211}>{cutString(logs.fileName, 15)}</TableRowColumn>
                                    <TableRowColumn style={style.w150}>{logs.status}</TableRowColumn>
                                    <TableRowColumn style={style.w100}>{logs.totalRecord}</TableRowColumn>
                                    <TableRowColumn style={style.w100}>{logs.sucessCount}</TableRowColumn>
                                    <TableRowColumn style={style.w100}><a href="javascript:void(0)" onClick={()=>{this.downloadErrorCSV(logs._id)}}>{logs.errorRecordCount}</a></TableRowColumn>
                                    <TableRowColumn style={style.w150}>{moment(logs.createdOn).format("MM/DD/YY")}</TableRowColumn>
                                  </TableRow>
                                )
                            })}
                      </ImportLogTable>
                </div>
        	</div>
        </div>
    )
}
