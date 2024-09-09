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

// 导出 request 对象, 使其可以在其他文件中使用
export default request;