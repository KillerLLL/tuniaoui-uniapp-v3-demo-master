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
  <view class="custom-navbar" :style="{ backgroundColor: bgColor }">
    <!-- 状态栏占位 -->
    <view :style="{ height: statusBarHeight + 'px' }" />
    <!-- 导航栏主体 -->
    <view
      class="navbar-content"
      :style="{ height: '44px', color: textColor }"
    >
      <!-- 返回按钮 -->
      <view v-if="showBack" class="back-btn" @tap="handleBack">
        <text class="back-icon">←</text>
        <text class="back-text">返回</text>
      </view>
      <!-- 左侧插槽 -->
      <slot name="left" />
      <!-- 标题 -->
      <text class="navbar-title" :class="{ 'has-back': showBack }">
        {{ title }}
      </text>
      <!-- 右侧插槽 -->
      <slot name="right" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.custom-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;

  .navbar-content {
    display: flex;
    align-items: center;
    padding: 0 30rpx;
    position: relative;
  }

  .back-btn {
    display: flex;
    align-items: center;
    padding: 10rpx 0;
    z-index: 1;

    .back-icon {
      font-size: 32rpx;
      font-weight: bold;
    }

    .back-text {
      font-size: 28rpx;
      margin-left: 4rpx;
    }
  }

  .navbar-title {
    flex: 1;
    text-align: center;
    font-size: 32rpx;
    font-weight: bold;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);

    &.has-back {
      // 有返回按钮时居中
    }
  }
}
</style>
