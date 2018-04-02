export const imageExists = (imageUrl) => {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageUrl;
    });
}
