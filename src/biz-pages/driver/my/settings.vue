<script lang="ts" setup>
/**
 * 设置页面
 */
import CustomNavbar from '@/components/custom-navbar/index.vue'

// 设置项列表
const settingsList = [
  { id: 1, icon: '🔔', label: '消息通知', type: 'switch' },
  { id: 2, icon: '🔒', label: '隐私设置', type: 'arrow' },
  { id: 3, icon: '❓', label: '帮助与反馈', type: 'arrow' },
  { id: 4, icon: '📜', label: '用户协议', type: 'arrow' },
  { id: 5, icon: '🔐', label: '隐私政策', type: 'arrow' },
  { id: 6, icon: 'ℹ️', label: '关于我们', type: 'arrow' },
]

// 退出登录
const handleLogout = () => {
  uni.showModal({
    title: '确认退出',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        uni.removeStorageSync('token')
        uni.removeStorageSync('userInfo')
        uni.reLaunch({ url: '/biz-pages/login/index' })
      }
    },
  })
}
</script>

<template>
  <view class="settings-page">
    <!-- 自定义导航栏 -->
    <CustomNavbar title="设置" />

    <!-- 页面内容 -->
    <view class="settings-content">
      <!-- 设置列表 -->
      <view class="settings-list">
        <view
          v-for="item in settingsList"
          :key="item.id"
          class="settings-item"
        >
          <text class="settings-icon">{{ item.icon }}</text>
          <text class="settings-label">{{ item.label }}</text>
          <text class="settings-arrow" v-if="item.type === 'arrow'">→</text>
          <switch class="settings-switch" v-else :checked="true" />
        </view>
      </view>

      <!-- 退出登录 -->
      <view class="logout-section">
        <view class="logout-btn" @tap="handleLogout">
          <text class="logout-text">退出登录</text>
        </view>
      </view>

      <!-- 版本信息 -->
      <view class="version-info">
        <text class="version-text">物流运输 v1.0.0</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.settings-page {
  min-height: 100vh;
  background: #f4f5f7;
}

.settings-content {
  padding: 180rpx 30rpx 30rpx;
}

.settings-list {
  background: #fff;
  border-radius: 24rpx;
  overflow: hidden;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.settings-item {
  display: flex;
  align-items: center;
  padding: 32rpx 30rpx;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  .settings-icon {
    font-size: 40rpx;
    margin-right: 20rpx;
  }

  .settings-label {
    flex: 1;
    font-size: 30rpx;
    color: #333;
  }

  .settings-arrow {
    font-size: 28rpx;
    color: #ccc;
  }

  .settings-switch {
    transform: scale(0.8);
  }
}

.logout-section {
  margin-bottom: 30rpx;
}

.logout-btn {
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  text-align: center;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

  .logout-text {
    font-size: 30rpx;
    color: #ff4c4c;
  }
}

.version-info {
  text-align: center;
  padding: 30rpx 0;

  .version-text {
    font-size: 24rpx;
    color: #ccc;
  }
}
</style>
