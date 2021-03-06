import {get,uniq,filter,isEmpty,compact} from 'lodash';
perClassPackageMaker = purchaseData =>{
    let latest = [],newObj = {},pId,uId;
    purchaseData.map((obj,index)=>{
        if(get(obj,'packageType','MP') == 'CP' || get(obj,'payAsYouGo',false) || get(obj,'payUpFront',false)){
            pId = obj.packageId;
            uId = obj.userId;
            newObj = {}
            purchaseData.map((obj1,index)=>{
                if(pId == obj1.packageId && uId == obj1.userId){
                    newObj = {
                        packageStatus : obj1.packageStatus,
                        endDate : obj1.endDate,
                        noClasses : obj1.noClasses,
                        _id: obj1._id
                    }
                    if(!isEmpty(newObj))
                    latest.push(newObj);
                }
                newObj = {};
            })  
            obj.combinedData = uniq(latest);    
            latest = [];
        }
    })
    return filter(purchaseData,(o)=>{ return get(o,'packageStatus','inActive')=='active'});
}
export const  packageCoverProvider = (purchaseData,from) => {
	purchaseData = compact(purchaseData);
    let packageType,packageId,covers=[],methodName;
    if(!isEmpty(purchaseData)){
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
    }
    return from?purchaseData:perClassPackageMaker(purchaseData);
  };