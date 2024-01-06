import axios from '../axios.js';
/**
 * 新增project
 * @param {*} data
 * @returns
 */
export const addProject = data => {
    return axios({
        url: '/api/projects/add',
        method: 'post',
        data
    })
}

/**
 * 获取项目列表
 * @param {*} data
 * @returns
 */
export const getProjectList = data => {
    return axios({
        url: '/api/projects/get',
        method: 'get',
        data
    })
}

/**
 * 删除项目
 * @param {*} data
 * @returns
 */
export const delProject = data => {
    return axios({
        url: '/api/projects/delete',
        method: 'post',
        data
    })
}

/**
 * 获取报错列表
 * @param {*} data
 * @returns
 */
export const getTableData = data => {
    return axios({
        url: '/api/getErrorList',
        method: 'get',
        data
    })
}

/**
 * 获取录屏信息
 * @param {*} data
 * @returns
 */
export const getPlayRecord = data => {
    return axios({
        url: '/api/getRecordScreenId',
        method: 'get',
        data
    })
}

/**
 * 获取源码map信息
 * @param {*} data
 * @returns
 */
export const getSourceMap = data => {
    return axios({
        url: '/api/getmap',
        method: 'get',
        data
    })
}
