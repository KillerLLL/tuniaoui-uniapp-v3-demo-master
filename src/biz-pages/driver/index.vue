<script lang="ts" setup>
/**
 * 司机端入口页面
 * 包含 Tabbar 底部导航
 */
import { ref } from 'vue'

// 当前 Tabbar 索引
const currentIndex = ref(0)

// Tabbar 配置
const tabbarList = [
  {
    name: 'home',
    text: '首页',
    icon: 'home',
    activeIcon: 'home-fill',
    path: '/biz-pages/driver/home/index',
  },
  {
    name: 'grab',
    text: '抢单',
    icon: 'order',
    activeIcon: 'order-fill',
    path: '/biz-pages/driver/grab/index',
  },
  {
    name: 'order',
    text: '订单',
    icon: 'list',
    activeIcon: 'list-fill',
    path: '/biz-pages/driver/order/list',
  },
  {
    name: 'my',
    text: '我的',
    icon: 'my',
    activeIcon: 'my-fill',
    path: '/biz-pages/driver/my/index',
  },
]

// Tabbar 点击处理
const handleTabbarChange = (index) => {
  if (currentIndex.value === index) return
  currentIndex.value = index
  uni.switchTab({ url: tabbarList[index].path })
}
</script>

<template>
  <view class="driver-container">
    <!-- 页面插槽 -->
    <slot />
    <!-- 底部 Tabbar -->
    <view class="driver-tabbar">
      <view
        v-for="(item, index) in tabbarList"
        :key="item.name"
        class="tabbar-item"
        :class="{ active: currentIndex === index }"
        @tap="handleTabbarChange(index)"
      >
        <view class="tabbar-icon-box">
          <TnIcon
            :name="currentIndex === index ? item.activeIcon : item.icon"
            size="44"
          />
        </view>
        <text class="tabbar-text">{{ item.text }}</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.driver-container {
  min-height: 100vh;
  background: #f4f5f7;
  padding-bottom: 120rpx;
}

.driver-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120rpx;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.06);
  z-index: 999;

  .tabbar-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10rpx 30rpx;
    transition: all 0.2s;

    .tabbar-icon-box {
      margin-bottom: 6rpx;
      color: #999;
    }

    .tabbar-text {
      font-size: 22rpx;
      color: #999;
    }

    &.active {
      .tabbar-icon-box {
        color: #007aff;
      }

      .tabbar-text {
        color: #007aff;
        font-weight: bold;
      }
    }
  }
}
</style>
