
Meteor.methods({
    'test.notification':function () {
        try{
            return Meteor.call("classInterest.getClassInterest",{userId:this.userId,classTimeId:"nEYbGZr2GRMXkmGw5",classTypeId:"Lmg8xwxztxnSWEJ7f"})            
        }
        catch(error){
			console.log('error in test methods', error)
        }
    }
})