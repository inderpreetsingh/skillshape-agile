export const capitalizeString = (str) => {
   return str.toLowerCase().replace(/\b\w/g, letter => letter.toUpperCase());
}
