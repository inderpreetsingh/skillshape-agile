export const downloadingFunction = (content, fileName, mimeType) => {
    var a = document.createElement('a');
    mimeType = mimeType || 'application/octet-stream';

   if (navigator.msSaveBlob) {
        navigator.msSaveBlob(new Blob([content], {
            type: mimeType
        }), fileName);
    } else if (URL && 'download' in a) {
        a.href = URL.createObjectURL(new Blob([content], {
            type: mimeType
        }));
        a.setAttribute('download', fileName);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else {
        location.href = 'data:application/octet-stream,' + encodeURIComponent(content);
    }
};