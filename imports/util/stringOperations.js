
/**
 * addDelimiter adds a delimiter in the String
 * @param {string} str : on which we wants to add delimiter
 * @param {string} delimiter : which we wants to use on the string
 * @return {string} After applying the delimiter returning the string
 */

export const addDelimiter = (str,delimiter = '_') => {
  return str.split(' ').join(delimiter);
}

/**
 * capitalizeString makes first letter of the string capital
 * @param {string} str : which we wants to make first letter capital
 * @return {string} After making the first letter capital returning the string
 */

export const capitalizeString = (str) => {
   if(!str){
     return str;
   }
   return str.toLowerCase().replace(/\b\w/g, letter => letter.toUpperCase());
}
