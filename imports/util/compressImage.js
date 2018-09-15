import imageCompression from 'browser-image-compression';
 base64ImageToBlob= async (str)=> {
    // extract content type and base64 payload from original string
    let pos = str.indexOf(';base64,');
    let type = str.substring(5, pos);
    let b64 = str.substr(pos + 8);
    // decode base64
    let imageContent = await atob(b64);
    // create an ArrayBuffer and a view (as unsigned 8-bit)
    let buffer =await new ArrayBuffer(imageContent.length);
    let view = await new Uint8Array(buffer);
    // fill the view, using the decoded base64
    for(let n = 0; n < imageContent.length; n++) {
      view[n] = imageContent.charCodeAt(n);
    }
    // convert ArrayBuffer to Blob
    let blob = await new Blob([buffer], { type: type });
    return blob;
  }
urlToFile =  (src, fileName, mimeType) => {
   return new Promise((resolve,reject)=>{
        Meteor.call('urlToBase64.urlToBase64',src,(err,res)=>{
        base64ImageToBlob(res).then((blob)=>{
        let file = new File([blob], fileName, {type: mimeType, lastModified: Date.now()});
        resolve(file);
        }) 
        })
    })
}
export const compressImage = async (file,url,useUrl) => {
    try {
        if(useUrl && url){
            let fileObject = await urlToFile(url, 'new.jpg', 'image/jpg');
            file=fileObject;
        }
        const maxSizeMB = [0.4, 0.04], maxWidthOrHeight = [500, 120];
        let compressedFiles = [];
        for (let i = 0; i < maxSizeMB.length; i++) {
            let compressedFile = await imageCompression(file, maxSizeMB[i], maxWidthOrHeight[i])
            compressedFiles.push(compressedFile);
        }
        return compressedFiles;
    } catch (error) {
        return error;
    }


}