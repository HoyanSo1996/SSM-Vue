import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引用全局配置
// import '@/assets/css/global.css'、

// 引用 Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 国际化配置
import zhCn from 'element-plus/es/locale/lang/zh-cn'


createApp(App).use(store).use(router).use(ElementPlus, {locale: zhCn,}).mount('#app')
