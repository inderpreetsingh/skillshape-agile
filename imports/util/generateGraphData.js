import { isEmpty, cloneDeep } from 'lodash';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';
const colors = { 'Attendance': helpers.alertColor, "Purchases": helpers.primaryColor,"Expired":helpers.black,'Cancelled':"dodgerblue","Members":helpers.cancel };
export function generateGraphData(graphData, options) {
  let data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', "August", "September", "October", "November", "December"],
    datasets: []
  };
  let maxMonth = 0;
  if (graphData && !isEmpty(graphData)) {
    let keyNames = Object.keys(graphData);
    keyNames.map((keyName) => {
      let graphValues = [];
      let currentGraphData = graphData[keyName];
      let color = colors[keyName] || helpers.alertColor;
      if (!isEmpty(currentGraphData)) {
        currentGraphData.map((obj, index) => {
          let { _id: { month }, count } = obj;
          graphValues[month - 1] = count;
          if (month > maxMonth) {
            maxMonth = month;
          }
        })
        graphValues = Array.from(graphValues, item => item || 0);
        let objForDataSets = {
          label: keyName,
          fill: false,
          lineTension: 0.1,
          backgroundColor: color,
          borderColor: color,
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: color,
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: color,
          pointHoverBorderColor: color,
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: graphValues
        };
        data.datasets.push(cloneDeep(objForDataSets));
      }
    })
  }
	console.log('TCL: generateGraphData -> data', data)
  return data;
}

