export function openMailToInNewTab(mailToNormalized) {
    const windowRef = window.open(mailToNormalized, '_blank');
    windowRef.focus();
    windowRef.onfocus = function() {
        return;
    }
    // setTimeout(function() {
    //     windowRef.close();
    // }, 500);
}