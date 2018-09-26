import accounting from '/imports/util/accounting.js'

export const  inputRestriction = (e)=> {
    let t = e.target.value;
    return (t.indexOf(".") >= 0) ? (t.substr(0, t.indexOf(".")) + t.substr(t.indexOf("."), 3)) : t;
  }

export const formatMoney = (cost,currency) =>{
  let options ;
  if(currency=='€'){
    options={
      symbol : currency,
      decimal : ",",
      thousand: ".",
    }
  }else{
  options={
      symbol : currency
    };
  }
  return accounting.formatMoney(cost,options)
}