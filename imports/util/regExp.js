"use strict";

export const emailRegexStrings = {
  email: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
}

export const emailRegex = {
  email: new RegExp(emailRegexStrings.email),
}
