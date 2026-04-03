<script lang="ts" setup>
/**
 * 身份切换页面
 */
import CustomNavbar from '@/components/custom-navbar/index.vue'

// 切换身份
const switchToRole = (role) => {
  uni.showModal({
    title: '确认切换',
    content: `确定切换为${role === 'driver' ? '司机' : '货主'}身份吗？`,
    success: (res) => {
      if (res.confirm) {
        uni.setStorageSync('currentRole', role)
        if (role === 'driver') {
          uni.reLaunch({ url: '/biz-pages/driver/index' })
        } else {
          uni.reLaunch({ url: '/biz-pages/shipper/index' })
        }
      }
    },
  })
}
</script>

<template>
  <view class="switch-role-page">
    <!-- 自定义导航栏 -->
    <CustomNavbar title="身份切换" />

    <!-- 页面内容 -->
    <view class="role-content">
      <view class="role-title">
        <text class="title-text">选择身份</text>
        <text class="title-hint">切换身份后将进入对应的端</text>
      </view>

      <!-- 角色选择 -->
      <view class="role-list">
        <view class="role-card driver" @tap="switchToRole('driver')">
          <view class="role-icon">🚚</view>
          <view class="role-info">
            <text class="role-name">司机</text>
            <text class="role-desc">承接货源、运输货物</text>
          </view>
          <view class="role-check">
            <text>✓</text>
          </view>
        </view>

        <view class="role-card shipper" @tap="switchToRole('shipper')">
          <view class="role-icon">📦</view>
          <view class="role-info">
            <text class="role-name">货主</text>
            <text class="role-desc">发布货源、管理订单</text>
          </view>
          <view class="role-check">
            <text>✓</text>
          </view>
        </view>
      </view>

      <!-- 提示 -->
      <view class="tips-section">
        <text class="tips-text">当前为司机身份，点击货主卡片可切换</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.switch-role-page {
  min-height: 100vh;
  background: #f4f5f7;
}

.role-content {
  padding: 180rpx 30rpx 30rpx;
}

.role-title {
  text-align: center;
  margin-bottom: 50rpx;

  .title-text {
    font-size: 40rpx;
    color: #333;
    font-weight: bold;
    display: block;
    margin-bottom: 16rpx;
  }

  .title-hint {
    font-size: 26rpx;
    color: #999;
  }
}

.role-list {
  .role-card {
    background: #fff;
    border-radius: 24rpx;
    padding: 40rpx;
    margin-bottom: 30rpx;
    display: flex;
    align-items: center;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
    border: 4rpx solid transparent;
    transition: all 0.2s;

    &.driver {
      border-color: #007aff;
    }

    &.shipper {
      border-color: #00b578;
    }

    .role-icon {
      font-size: 80rpx;
      margin-right: 30rpx;
    }

    .role-info {
      flex: 1;

      .role-name {
        font-size: 36rpx;
        color: #333;
        font-weight: bold;
        display: block;
        margin-bottom: 10rpx;
      }

      .role-desc {
        font-size: 26rpx;
        color: #999;
      }
    }

    .role-check {
      width: 60rpx;
      height: 60rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;

      text {
        font-size: 36rpx;
        color: #fff;
      }
    }

    &.driver .role-check {
      background: #007aff;
    }

    &.shipper .role-check {
      background: #00b578;
    }
  }
}

.tips-section {
  text-align: center;
  margin-top: 40rpx;

  .tips-text {
    font-size: 26rpx;
    color: #999;
  }
}
</style>
