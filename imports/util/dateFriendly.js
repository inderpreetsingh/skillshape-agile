"use strict";

import { isDate } from "lodash"
import moment from "moment"

/**
 * @memberof util
 * @function
 * @exports
 * @param {Date|String} value
 * @param {String} format - "MMM D, h:mm a"
 * @returns {String}
 * @example
 * import {dateFriendly} from "@/util"
 *
 * <h3>{dateFriendly(this.props.createdAt)}</h3>
 */
export function dateFriendly (value, format = "MMM D, h:mm a") {
  if (!value) {
    return undefined
  }

  if (!isDate(value))
    value = new Date(value)
  return moment(value).format(format)
}
