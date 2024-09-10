// 引入 axios
import axios from "axios";

// 通过 axios 创建 request 对象, 用于发送请求到后端
const request = axios.create({
    timeout: 5000   // 设置请求超时时间
});

// 为 request 设置拦截器的处理
// (1) 可以对请求做统一的处理
// (2) 比如统一的加入 token, Content-Type 等
request.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8';
    return config;
}, error => {
    return Promise.reject(error);
});


// 为 response 设置拦截器的处理
// 可以在调用接口响应后，统一的处理返回结果
request.interceptors.response.use(response => {
    let res = response.data.data;
    // 如果返回的是文件, 就直接返回
    if (response.config.responseType === 'blob') {
        return res;
    }
    // 如果是 string, 就转成 json 对象
    if (typeof res === 'string') {
        //如果 res 不为 null, 就进行转换成 json 对象
        res = res ? JSON.parse(res) : res;
    }
    return res;
},
error => {
    console.log("err", error)
    return Promise.reject(error);
});


// 导出 request 对象, 使其可以在其他文件中使用
export default request;