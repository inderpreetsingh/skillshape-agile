import imageCompression from 'browser-image-compression';
srcToFile = async (src, fileName, mimeType) => {
    let res = await fetch(src)
    let buf = await res.arrayBuffer();
    let final = await new File([buf], fileName, { type: mimeType });
    return final;
}
export const compressImage = async (file,url,useUrl) => {
    try {
        if(useUrl && url){
            let fileObject = await srcToFile(url, 'new.jpg', 'image/jpg');
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
    console.log('TCL: }catch -> error', error);
    }


}