import {dirname as _dirname} from "path";

/**
 * 递归创建文件夹
 * @param {String} dirname 文件夹
 */
export function mkdirs(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirs(_dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}