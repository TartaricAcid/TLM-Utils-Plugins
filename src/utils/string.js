/**
 * 检查字符串对象是否为空
 * @param {String} str 字符串
 */
export function isEmpty(str) {
    return typeof str == "undefined" || str == null || str.trim() === "";
}