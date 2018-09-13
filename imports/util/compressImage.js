import imageCompression from 'browser-image-compression';
export const compressImage = async (file) => {
    try {

        const maxSizeMB = [0.4, 0.04], maxWidthOrHeight = [500, 120];
        let compressedFiles = [];
        for (let i = 0; i < maxSizeMB.length; i++) {
            let compressedFile = await imageCompression(file, maxSizeMB[i], maxWidthOrHeight[i])
            compressedFiles.push(compressedFile);
        }
        return compressedFiles;
    } catch (error) {
    }


}