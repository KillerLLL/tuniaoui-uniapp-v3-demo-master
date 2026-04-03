<script setup>
import { ref, onMounted } from 'vue'
import TnIcon from '@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue'

const props = defineProps({
  title: { type: String, default: '' },
  showBack: { type: Boolean, default: true },
  bgColor: { type: String, default: '#007AFF' },
  textColor: { type: String, default: '#fff' },
})

const statusBarHeight = ref(0)

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 0
})

const goBack = () => {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack({ delta: 1 })
  } else {
    uni.reLaunch({ url: '/pages/index/index' })
  }
}
</script>

<template>
  <view class="custom-navbar">
    <!-- 状态栏占位 -->
    <view :style="{ height: statusBarHeight + 'px' }" />
    <!-- 导航栏内容 -->
    <view
      class="navbar-content"
      :style="{ backgroundColor: bgColor, color: textColor }"
    >
      <view v-if="showBack" class="navbar-back" @tap="goBack">
        <TnIcon name="left" :color="textColor" size="44" />
      </view>
      <view class="navbar-title">
        <text class="title-text">{{ title }}</text>
      </view>
      <view class="navbar-right">
        <slot />
      </view>
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
    height: 88rpx;
    padding: 0 30rpx;
    position: relative;

    .navbar-back {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 10rpx;
    }

    .navbar-title {
      flex: 1;
      display: flex;
      align-items: center;

      .title-text {
        font-size: 34rpx;
        font-weight: bold;
      }
    }

    .navbar-right {
      display: flex;
      align-items: center;
    }
  }
}
</style>
