import {get,uniq,filter} from 'lodash';
perClassPackageMaker = purchaseData =>{
    let latest = [],newObj = {},pId,uId;
    purchaseData.map((obj,index)=>{
        if(get(obj,'packageType','MP') == 'CP'){
            pId = obj.packageId;
            uId = obj.userId;
            purchaseData.map((obj1,index)=>{
                if(pId == obj1.packageId && uId == obj1.userId){
                    newObj = {
                        packageStatus : obj1.packageStatus,
                        endDate : obj1.endDate,
                        noClasses : obj1.noClasses,
                        _id: obj1._id
                    }
                    latest.push(newObj);
                }
            })  
            obj.combinedData = uniq(latest);    
        }
    })
    return filter(purchaseData,(o)=>{ return get(o,'packageType','MP') == 'CP' && o.packageStatus=='active' || get(o,'packageType','MP') == 'MP' || get(o,'packageType','MP') == 'EP'});
}
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
    
    return perClassPackageMaker(purchaseData);
  };