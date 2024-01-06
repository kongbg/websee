class BaseController {
    /**
     * @description: 统一处理成功返回格式
     * @param {*} data  返回的数据
     * @param {string} msg 提示信息
     * @param {number} code 状态码
     */
    static renderJsonSuccess (code = 200, msg = '', data = {}) {
        return {
            code: code,
            msg: msg,
            data: data
        }
    }
    /**
     * @description: 统一处理失败返回格式
     * @param {*} data  返回的数据
     * @param {string} msg 提示信息
     * @param {number} code 状态码
     */
    static renderJsonWarn (code = 400, msg = '', data = null) {
        return {
            code: code,
            msg: msg,
            data: data
        }
    }
    /**
     * @description: 统一处理服务端错误返回格式
     * @param {*} data  返回的数据
     * @param {string} msg 提示信息
     * @param {number} code 状态码
     */
    static renderJsonError (code = 500, msg = '', data = null) {
        return {
            code: code,
            msg: msg,
            data: data
        }
    }
}

module.exports = BaseController;