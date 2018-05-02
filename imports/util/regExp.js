"use strict";

const regexStrings = {
    email: /^[^@\s]+@[^@\s]+$/,
    image: (/\.(gif|jpg|jpeg|tiff|png)$/i),
    phone: /^\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/g,
}

export const emailRegex = {
  email: new RegExp(regexStrings.email),
}

export const imageRegex = {
  image: new RegExp(regexStrings.image),
}

export const phoneRegex = {
  phone: new RegExp(regexStrings.phone),
}