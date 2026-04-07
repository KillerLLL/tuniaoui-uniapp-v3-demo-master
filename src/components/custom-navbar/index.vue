<script lang="ts" setup>
/**
 * 自定义导航栏组件
 * 支持首页模式（无返回按钮）和子页面模式（有返回按钮）
 */
import { ref, computed } from 'vue'

interface Props {
  // 页面标题
  title?: string
  // 是否显示返回按钮
  showBack?: boolean
  // 导航栏背景色
  bgColor?: string
  // 文字颜色
  textColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  showBack: true,
  bgColor: '#FFFFFF',
  textColor: '#333333',
})

// 获取手机状态栏高度
const statusBarHeight = ref(20)
// #ifdef MP-WEIXIN
const systemInfo = uni.getSystemInfoSync()
statusBarHeight.value = systemInfo.statusBarHeight || 20
// #endif

// 计算导航栏高度
const navbarHeight = computed(() => {
  return statusBarHeight.value + 44
})

// 返回处理
const handleBack = () => {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack()
  } else {
    // 如果是顶级页面，跳转到首页
    uni.reLaunch({ url: '/biz-pages/driver/index' })
  }
}
</script>

<template>
  <view
    class="custom-navbar fixed top-0 left-0 right-0 z-999"
    :style="{ backgroundColor: bgColor }"
  >
    <!-- 状态栏占位 -->
    <view :style="{ height: statusBarHeight + 'px' }" />
    <!-- 导航栏主体 -->
    <view
      class="navbar-content h-11 flex items-center px-6 relative"
      :style="{ color: textColor }"
    >
      <!-- 返回按钮 -->
      <view
        v-if="showBack"
        class="back-btn flex items-center p-2 -m-2 z-1 rounded-sm btn-press"
        @tap="handleBack"
      >
        <TnIcon name="left" size="18" />
        <text class="back-text text-sm ml-1">返回</text>
      </view>
      <!-- 左侧插槽 -->
      <slot name="left" />
      <!-- 标题 -->
      <text
        class="navbar-title flex-1 text-center text-base font-bold absolute left-1/2 -translate-x-1/2"
        :class="{ 'has-back': showBack }"
      >
        {{ title }}
      </text>
      <!-- 右侧插槽 -->
      <slot name="right" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
/* 使用 UnoCSS 原子化类名，保留必要的作用域样式 */

// 玻璃态背景效果（通过 UnoCSS glass-card 类实现）
:deep(.glass-card) {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20rpx);
  -webkit-backdrop-filter: blur(20rpx);
}

// 导航栏阴影
:deep(.navbar-shadow) {
  box-shadow: 0 1rpx 0 rgba(0, 0, 0, 0.05);
}
</style>
