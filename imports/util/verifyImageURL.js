export const verifyImageURL=(url, callBack)=> {
    var img = new Image();
    img.src = url;
    img.onload = function () {
          callBack(true);
    };
    img.onerror = function () {
          callBack(false);
    };
  }