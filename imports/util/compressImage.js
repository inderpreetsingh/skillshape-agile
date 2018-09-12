import imageCompression from 'browser-image-compression';
export const compressImage = async (file) => {
    try {

        const maxSizeMB = [0.1, 0.01], maxWidthOrHeight = [300, 40];
        let compressedFiles = [];
        for (let i = 0; i < maxSizeMB.length; i++) {
            let compressedFile = await imageCompression(file, maxSizeMB[i], maxWidthOrHeight[i])
            console.log('TCL: compressImage -> compressedFile', compressedFile);
            compressedFiles.push(compressedFile);
        }
        return compressedFiles;
    } catch (error) {
        console.log('TCL: }catch -> error', error);
    }


}