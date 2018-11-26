import moment from "moment";


export const calcContractEnd = (data) => {
    const { startDate, contractLength } = data;
    const startDateMomentObj = moment(startDate);
    const contractEndDate = startDateMomentObj.add(contractLength, 'M');
    const currentDate = moment();
    return contractEndDate.diff(currentDate, 'days');
} 