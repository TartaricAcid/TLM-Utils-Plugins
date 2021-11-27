/**
 * Check if the string is empty
 * @param {String} str Test string
 */
export function isEmpty(str) {
    return !str || (typeof str === "string" && str.trim() === "");
}
