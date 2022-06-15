const dateRegEx = /^\d{4}-\d{2}-\d{2}$/

/**
 * Verifies if the `dateStr` represents a valid date and formatted to yyyy/mm/dd.
 *
 * @param {string} dateStr
 *
 * @return {boolean} the validation result.
 * */
export const isValidDateStr = (dateStr: string): boolean => {
  // Because the format of the target verification is not the standard ISO format,
  // here we first try to convert it to ISO format.
  // See here for more details: https://zh.wikipedia.org/zh-tw/ISO_8601.
  // The reason why we don't(can't) use `String.prototype.replaceALl` is because
  // we don't want to declare the project ECMA versions.
  const expectISODateStr = dateStr
    .trim()
    // The first '/'
    .replace('/', '-')
    // The second '/'
    .replace('/', '-')

  if (!expectISODateStr.match(dateRegEx)) {
    return false
  }

  const date = new Date(expectISODateStr)
  if (Number.isNaN(date)) {
    return false
  }

  try {
    return date.toISOString().startsWith(expectISODateStr)
  } catch (e) {
    return false
  }
}
