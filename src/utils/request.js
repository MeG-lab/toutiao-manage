// 封装基于 axios 的请求模块
import axios from "axios"
// 创建一个 axios 实例 ，说白了就是复制了一个 axios
// 通过这个实例去发请求，把需要的配置给这个实例来处理
import JSONbigint from "json-bigint"
import router from '@/router'
import { Message } from 'element-ui'
const request = axios.create({
    baseURL: "http://api-toutiao-web.itheima.net", // 请求基础路径
    transformResponse: [function (data) {
        try {
            return JSONbigint.parse(data);
        } catch (err) {
            return data
        }
    }],
})
// 请求拦截器
request.interceptors.request.use(
    // 所有请求会经过这里
    function (config) {
        // console.log(config);
        // 可以在允许请求出去之前定制统一的业务处理
        // 例如:统一的设置token
        // 把 JSON 字符串还原会原来的数据对象
        const user = JSON.parse(window.localStorage.getItem('user'));
        // 如果有登录用户的信息,则统一设置 token
        if (user) {
            config.headers.Authorization = `Bearer ${user.token}`
        }
        // 当这里 return config 之后请求才会真正的发出去
        return config;
    },
    // 请求失败,会经过这里
    function (error) {
        return Promise.reject(error);
    });

// 响应拦截器
request.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    const status = error.response
    if (error.response && status === 401) {
        // 跳转到登录页面
        // 清除本地存储中的用户登录状态
        window.localStorage.removeItem('user')
        router.push('/login')
        Message('登录状态无效，请重新登录')
    } else if (status === 403) {
        // token 未携带或过期
        Message({
            type: 'warning',
            message: '没有操作权限'
        })
    } else if (status === 400) {
        // 客户端错误
        Message.error('请求参数错误')
    } else if (status >= 500) {
        // 服务端错误
        Message.error('服务端内部异常，请稍后重试')
    }
    return Promise.reject(error);
});
// 导出请求方法
export default request
// 谁要使用谁就加载 request 模块
