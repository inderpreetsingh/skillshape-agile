export function cutString(text, len) {
  let limit =  len || 200;
  if(text)
    return text.length < limit ? text : `${text.substr(0, limit - 1)}...`;
  return
}