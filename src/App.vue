<template>
  <div>
    <!-- 头部 -->
    <Header />

    <!-- 主体 -->
    <div style="display: flex">
      <!-- 侧边栏 -->
      <Aside />
      <!-- 内容区域, 这部分由 HomeView.vue 组件来的 -->
      <!-- flex 属性代码除了 Aside 外, 空间全占了 -->
      <router-view style="flex: 1" />
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header";
import Aside from "@/components/Aside";

export default {
  name: "Layout",
  components: {
    Header,  // 省略了 "Header": Header
    Aside
  }
}
</script>

<style></style>
