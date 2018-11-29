import {get,uniq} from 'lodash';
export const  packageCoverProvider = purchaseData => {
    let packageType,packageId,covers=[];
    purchaseData.map((obj,index)=>{
        packageType = get(obj,'packageType','MP');
        packageId = get(obj,'packageId','');
        if(packageType == "MP"){
            Meteor.call('monthlyPricing.getCover',packageId,(err,res)=>{
				if(res){
                    res.map((obj1,index1)=>{
                        covers.push(obj1.name);
                    })
                    obj.covers = uniq(covers);
                }
            })
        }
        else if(packageType == "CP"){

        }else{

        }
    })
    return purchaseData;
  };