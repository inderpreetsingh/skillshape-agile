import React from 'react';
import DocumentTitle from 'react-document-title';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import moment from 'moment';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import {
  TableRow,
  TableCell,
} from 'material-ui/Table';

import { cutString } from '/imports/util';
import { ImportLogTable } from './importLogTable';

const style = {
    fileUploadStyle: {
    	opacity: 0,
	    position: 'absolute',
	    top: 80,
	    padding: 10,
        right: 25,
        cursor: 'pointer'
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
    	<DocumentTitle title={this.props.route.name}>
            <div>
        		<Grid container>
                    <Grid item xs={12}>
                    <div style={style.uploadFloat}>
            			<TextField type="text"
             			 hintText="Select CSV"
                         value={this.state.fileUploadName}
            			/>
            			<input type="file" accept=".csv" onChange={(e)=>{this.fileSelected(e)}} ref={(ref)=>{this.fileInputRef = ref}} style={style.fileUploadStyle} />
                        <Button raised color="accent"  onClick= {()=>{this.uploadCSV()}} >
                            Upload
                        </Button>
                    </div>
                    </Grid>
                </Grid>
        		<div>
                    <div style={{overflowX: "auto"}}>
                        {<ImportLogTable>
                                {this.props.importLogs && this.props.importLogs.map((logs, index) => {
                                    return (
                                      <TableRow selectable={false}>
                                        <TableCell title={logs.fileName} style={style.w211}>{cutString(logs.fileName, 30)}</TableCell>
                                        <TableCell style={style.w150}>{logs.status}</TableCell>
                                        <TableCell style={style.w100}>{logs.totalRecord}</TableCell>
                                        <TableCell style={style.w100}>{logs.sucessCount}</TableCell>
                                        <TableCell style={style.w100}><a href="javascript:void(0)" onClick={()=>{this.downloadErrorCSV(logs._id)}}>{logs.errorRecordCount}</a></TableCell>
                                        <TableCell style={style.w150}>{moment(logs.createdOn).format("MM/DD/YY")}</TableCell>
                                      </TableRow>
                                    )
                                })}
                          </ImportLogTable>}
                    </div>
            	</div>
            </div>
        </DocumentTitle>
    )
}
