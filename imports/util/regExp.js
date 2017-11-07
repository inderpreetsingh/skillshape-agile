"use strict";

const regexStrings = {
  email: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
  image: (/\.(gif|jpg|jpeg|tiff|png)$/i),
}

export const emailRegex = {
  email: new RegExp(regexStrings.email),
}

export const imageRegex = {
  image: new RegExp(regexStrings.image),
}