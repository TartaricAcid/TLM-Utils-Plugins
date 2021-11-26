/**
 * Check if the string is empty
 * @param {String} str Test string
 */
export function isEmpty(str) {
    return typeof str == "undefined" || str == null || str.trim() === "";
}