import {isEmpty,pullAt} from 'lodash';
export function generateGraphData(graphData, options) {
   let data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July',"August","September" ,"October" ,"November","December"],
        datasets: [
          {
            label: 'Purchases',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
          }
        ]
      };
    let graphValues = [];
    let maxMonth = 0;
    if(graphData && !isEmpty(graphData)){
        graphData.map((obj,index)=>{
            let {_id:{month},count} = obj;
            graphValues[month-1] = count;
            if(month> maxMonth){
                maxMonth = month;
            }
        })
    }
    graphValues = Array.from(graphValues, item => item || 0)
    data.datasets[0].data = graphValues;
    return data;
  }