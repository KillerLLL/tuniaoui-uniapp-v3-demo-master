<script lang="ts" setup>
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import TnIcon from '@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue'

// 登录状态
const isLoggedIn = ref(false)
const userInfo = ref<any>(null)

// 获取本地登录信息
const checkLogin = () => {
  const token = uni.getStorageSync('token')
  const info = uni.getStorageSync('userInfo')
  isLoggedIn.value = !!token
  if (info) {
    try {
      userInfo.value = JSON.parse(info)
    } catch {
      userInfo.value = null
    }
  }
}

// 跳转登录页
const goLogin = () => {
  uni.navigateTo({ url: '/biz-pages/login/index' })
}

// 退出登录
const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        uni.removeStorageSync('token')
        uni.removeStorageSync('userInfo')
        isLoggedIn.value = false
        userInfo.value = null
        uni.showToast({ title: '已退出登录', icon: 'success' })
      }
    },
  })
}

// 菜单列表
const menuList = [
  { icon: 'order', title: '我的收藏', color: '#ff6b35' },
  { icon: 'clock', title: '浏览记录', color: '#007aff' },
  { icon: 'link', title: '关于项目', color: '#00b578' },
  { icon: 'chat', title: '意见反馈', color: '#e8485e' },
  { icon: 'set-fill', title: '设置', color: '#666' },
]

// 菜单点击
const onMenuClick = (item: any) => {
  uni.showToast({ title: item.title, icon: 'none' })
}

onShow(() => {
  checkLogin()
})
</script>

// #ifdef MP-WEIXIN
<script lang="ts">
export default {
  options: {
    virtualHost: true,
  },
}
</script>
// #endif

<template>
  <view class="mine-page">
    <!-- 顶部用户信息区域 -->
    <view class="header-area">
      <view class="user-section">
        <!-- 未登录 -->
        <template v-if="!isLoggedIn">
          <view class="avatar-box" @tap="goLogin">
            <TnIcon name="my" color="#fff" size="48" />
          </view>
          <view class="user-info" @tap="goLogin">
            <text class="nickname">点击登录</text>
            <text class="desc">登录后查看更多内容</text>
          </view>
        </template>
        <!-- 已登录 -->
        <template v-else>
          <view class="avatar-box logged">
            <TnIcon name="my-fill" color="#007aff" size="48" />
          </view>
          <view class="user-info">
            <text class="nickname">{{ userInfo?.nickname || '用户' }}</text>
            <text class="desc">欢迎使用 TuniaoUI</text>
          </view>
        </template>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section tn-white_bg">
      <view
        v-for="(item, index) in menuList"
        :key="index"
        class="menu-item"
        @tap="onMenuClick(item)"
      >
        <view class="menu-left">
          <view class="menu-icon" :style="{ backgroundColor: item.color }">
            <TnIcon :name="item.icon" color="#fff" size="34" />
          </view>
          <text class="menu-title">{{ item.title }}</text>
        </view>
        <TnIcon name="right" color="#ccc" size="28" />
      </view>
    </view>

    <!-- 退出登录按钮 -->
    <view v-if="isLoggedIn" class="logout-area">
      <view class="logout-btn" @tap="handleLogout">
        <text class="logout-text">退出登录</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.mine-page {
  min-height: 100vh;
  background: #f4f5f7;
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));

  // 顶部区域
  .header-area {
    padding: 60rpx 30rpx 40rpx;
    background: linear-gradient(135deg, #007aff, #00b578);

    .user-section {
      display: flex;
      align-items: center;

      .avatar-box {
        width: 110rpx;
        height: 110rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.25);
        border-radius: 50%;
        flex-shrink: 0;

        &.logged {
          background: #fff;
        }
      }

      .user-info {
        margin-left: 24rpx;
        display: flex;
        flex-direction: column;

        .nickname {
          font-size: 36rpx;
          font-weight: bold;
          color: #fff;
        }

        .desc {
          margin-top: 8rpx;
          font-size: 26rpx;
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }
  }

  // 菜单区域
  .menu-section {
    margin: 30rpx;
    border-radius: 24rpx;
    overflow: hidden;

    .menu-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 30rpx;
      border-bottom: 1rpx solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .menu-left {
        display: flex;
        align-items: center;

        .menu-icon {
          width: 60rpx;
          height: 60rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14rpx;
          margin-right: 20rpx;
        }

        .menu-title {
          font-size: 30rpx;
          color: #333;
        }
      }
    }
  }

  // 退出登录
  .logout-area {
    padding: 0 30rpx;

    .logout-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 88rpx;
      background: #fff;
      border-radius: 24rpx;

      .logout-text {
        font-size: 30rpx;
        color: #e8485e;
      }
    }
  }
}
</style>
