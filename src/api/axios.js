import axios from 'axios';
import { message as Message } from '../components/message/index.js';
import { deepClone } from '../utils/index.js';
import router from '../router/index.js';

const Service = axios.create({
    baseUrl: `http://${process.env.VUE_APP_NODE_HOST}:${process.env.VUE_APP_NODE_PORT}`,
    timeout: 30 * 1000
})

// 请求拦截
Service.interceptors.request.use(
    config => {
        // 设置请求头
        let token = localStorage.getItem('Platform-token');
        if (token) {
            config.headers['Authorization'] = token;
        } else {
            // TODO: goto login
        }
        // console.log('config:', config)
        return config;
    },
    error => {
        console.log('请求拦截:', error)
    }
)

// 响应拦截
Service.interceptors.response.use(
    response => {
        let { status } = response;
        if (status == 200) {
            let { code, data, msg: message } = response.data;
            if (code == 200) {
                return [null, {...data, message}];
            } else if (code == '401') { // 鉴权失败，退出登录
                console.log('鉴权失败，退出登录')
                localStorage.clear()
                router.push({
                    path:'/admin/login'
                })
                return [true, {...data, message}];
            } else {
                Message({
                    type: 'warning',
                    message,
                    center: false
                })
                let err = {message}
                return [err, {...data, message}];
            }
        } else {
            console.log('网络请求失败！:', response)
            let err = {message}
            return [err, null];
        }
    },
    error => {
        /**
         * code = ERR_NETWORK 网络错误
         */
        Message({
            type: 'error',
            message: error.message
        })
        // Message.stop();
        // Message.error('111111111')
        // Message.error('22222222')

        // Message.error('33333333333')
        // Message.error('444444444')
        // Message.error('555555555')
        // setTimeout(() => {
        //     Message.error('1s 后提示！')
        // }, 1000);
        return [error, null];
    }
)


export default (options) => {
    // 处理poet get 传参不同问题
    let params = deepClone(options.params);
    let data = deepClone(options.data);
    if (options.method == 'get') {
        delete options.data;
        options.params = params || data;
    } else {
        delete options.params;
        options.params = data || params;
    }
    return Service(options);
};