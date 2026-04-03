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
        <TnButton
          type="primary"
          plain
          shape="round"
          width="100%"
          height="auto"
          @click="switchToRole('driver')"
        >
          <view class="role-card driver">
            <view class="role-icon-box">
              <TnIcon name="car-fill" size="48" color="#fff" />
            </view>
            <view class="role-info">
              <text class="role-name">司机</text>
              <text class="role-desc">承接货源、运输货物</text>
            </view>
            <view class="role-check">
              <TnIcon name="check" size="32" color="#00b578" />
            </view>
          </view>
        </TnButton>

        <TnButton
          type="success"
          plain
          shape="round"
          width="100%"
          height="auto"
          @click="switchToRole('shipper')"
        >
          <view class="role-card shipper">
            <view class="role-icon-box">
              <TnIcon name="express" size="48" color="#fff" />
            </view>
            <view class="role-info">
              <text class="role-name">货主</text>
              <text class="role-desc">发布货源、管理订单</text>
            </view>
            <view class="role-check">
              <TnIcon name="check" size="32" color="#00b578" />
            </view>
          </view>
        </TnButton>
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
  :deep(.tn-button) {
    margin-bottom: 30rpx;
  }

  .role-card {
    background: #fff;
    border-radius: 24rpx;
    padding: 40rpx;
    display: flex;
    align-items: center;
    border: 4rpx solid transparent;

    &.driver {
      border-color: #007aff;
    }

    &.shipper {
      border-color: #00b578;
    }

    .role-icon-box {
      width: 100rpx;
      height: 100rpx;
      background: linear-gradient(135deg, #007aff, #00b4ff);
      border-radius: 24rpx;
      display: flex;
      align-items: center;
      justify-content: center;
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
    }

    &.driver .role-check {
      background: #e6f0ff;
    }

    &.shipper .role-check {
      background: #e6fff0;
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
