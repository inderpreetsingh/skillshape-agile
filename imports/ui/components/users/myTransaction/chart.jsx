import React from 'react';
import {Line} from 'react-chartjs-2';
import {generateGraphData} from "/imports/util";
export const ChartComponent = (props) => {
    const {graphData} = props;
    let data = generateGraphData(graphData);
	console.log('TCL: ChartComponent -> data', data)
    return <div >
        <Line data={data} />
    </div>
}