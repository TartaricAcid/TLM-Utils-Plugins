import {dirname as _dirname} from "path";

// 5.x 的 Blockbench 需要授权才可以使用 fs 模块，4.x 的 Blockbench 则不需要授权
export const PLUGINS_FS = Blockbench.isNewerThan("4.99") ? requireNativeModule("fs") : fs;

/**
 * Create folders recursively
 * @param {String} dirname Folders name
 */
export function mkdirs(dirname) {
    if (PLUGINS_FS.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirs(_dirname(dirname))) {
            PLUGINS_FS.mkdirSync(dirname);
            return true;
        }
    }
}