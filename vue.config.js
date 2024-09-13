const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

// 配置完后需要重启
module.exports = {
  devServer:{
    // 设置启动端口
    port: 10000, 
    // 解决跨域问题
    proxy: {      // 设置代理
        '/api': {   // 设置拦截器, 拦截器格式: 斜杆+拦截器名字, 名字可以自己定
        target: 'http://localhost:8080/SSM-Backend',  // 设置代理要替换的目标地址
        changeOrign: true,    // 设置是否同源, true 代表拦截器允许跨域
        pathRewrite: {        // 路径重写
          '/api': ''          // 选择忽略拦截器里面的单词
        }
      }
    }
  }
}