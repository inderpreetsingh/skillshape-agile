import {get,uniq} from 'lodash';
export const  packageCoverProvider = purchaseData => {
    let packageType,packageId,covers=[],methodName;
    purchaseData.map((obj,index)=>{
        packageType = get(obj,'packageType','MP');
        packageId = get(obj,'packageId','');
        if(packageType == "MP"){
            methodName = 'monthlyPricing.getCover';
                  }
        else if(packageType == "CP"){
            methodName = 'classPricing.getCover';
        }else{
            methodName = "enrollmentFee.getCover";
        }
        Meteor.call(methodName,packageId,(err,res)=>{
            if(res){
                res.map((obj1,index1)=>{
                    covers.push(obj1.name);
                })
                obj.covers = uniq(covers);
            }
        })
    })
    return purchaseData;
  };