export const  inputRestriction = (e)=> {
    let t = e.target.value;
    return (t.indexOf(".") >= 0) ? (t.substr(0, t.indexOf(".")) + t.substr(t.indexOf("."), 3)) : t;
  }