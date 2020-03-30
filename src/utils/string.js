/**
 * 检查字符串对象是否为空
 * @param {String} str 字符串
 */
export function isEmpty(str) {
    if (typeof str == "undefined" || str == null || trim(str) == "") {
        return true;
    } else {
        return false;
    }
}

/**
 * 剔除字符串前后的空格
 * @param {String} str 字符串
 */
export function trim(str) {
    return str.replace(/^\s+|\s+$/g, '');
}