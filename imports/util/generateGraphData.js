import {isEmpty,cloneDeep} from 'lodash';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

export function generateGraphData(graphData, options) {
   let data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July',"August","September" ,"October" ,"November","December"],
        datasets: [
          
        ]
      };

      
    let graphValues = [];
    let maxMonth = 0;
    let objForDataSets = {
      label: 'Purchases',
      fill: false,
      lineTension: 0.1,
      backgroundColor: helpers.primaryColor,
      borderColor: helpers.primaryColor,
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: helpers.primaryColor,
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: helpers.primaryColor,
      pointHoverBorderColor: helpers.primaryColor,
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
    };
    if(graphData && !isEmpty(graphData)){
        let {purchases,attendance} = graphData; 
    // code for purchases graph
    if(!isEmpty(purchases)){
      purchases.map((obj,index)=>{
          let {_id:{month},count} = obj;
          graphValues[month-1] = count;
          if(month> maxMonth){
              maxMonth = month;
          }
      })
      graphValues = Array.from(graphValues, item => item || 0)
      objForDataSets.data = graphValues;
      data.datasets.push(cloneDeep(objForDataSets));
    }
    // code for attendance graph
    if(!isEmpty(attendance)){
      attendance.map((obj,index)=>{
        let {_id:{month},count} = obj;
        graphValues[month-1] = count;
        if(month> maxMonth){
            maxMonth = month;
        }
    })
    graphValues = Array.from(graphValues, item => item || 0)
    objForDataSets.backgroundColor = helpers.alertColor,
    objForDataSets.borderColor = helpers.alertColor,
    objForDataSets.pointBorderColor = helpers.alertColor,
    objForDataSets.pointHoverBackgroundColor = helpers.alertColor,
    objForDataSets.pointHoverBorderColor = helpers.alertColor,
    objForDataSets.label = 'Attendance'
    objForDataSets.data = graphValues;
    data.datasets.push(cloneDeep(objForDataSets));
    }
    }
    return data;
  }