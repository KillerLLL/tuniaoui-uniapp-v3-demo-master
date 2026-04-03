<script lang="ts" setup>
/**
 * 货主端首页
 */
import { onMounted, ref } from 'vue'
import CustomNavbar from '@/components/custom-navbar/index.vue'
import { getShipperInfoApi } from '@/api/shipper'

// 用户信息
const userInfo = ref({
  nickname: '王货主',
  companyName: '北京物流有限公司',
  phone: '136****8888',
  verifyStatus: 2,
})

// 快捷入口
const quickActions = [
  {
    id: 1,
    label: '发布货源',
    icon: 'upload',
    path: '/biz-pages/shipper/publish/index',
  },
  {
    id: 2,
    label: '我的货源',
    icon: 'express',
    path: '/biz-pages/shipper/publish/list',
  },
  {
    id: 3,
    label: '我的订单',
    icon: 'order',
    path: '/biz-pages/shipper/order/list',
  },
  {
    id: 4,
    label: '身份切换',
    icon: 'swap',
    path: '/biz-pages/driver/common/switch-role',
  },
]

// 跳转到页面
const navigateTo = (path) => {
  uni.navigateTo({ url: path })
}

// 跳转到消息
const goToMessage = () => {
  uni.navigateTo({ url: '/biz-pages/driver/my/message' })
}

// 跳转到身份切换
const goToSwitchRole = () => {
  uni.navigateTo({ url: '/biz-pages/driver/common/switch-role' })
}

onMounted(() => {
  getShipperInfoApi().then((res) => {
    if (res.code === 200) {
      userInfo.value = res.data
    }
  })
})
</script>

<template>
  <view class="shipper-home">
    <!-- 自定义导航栏 -->
    <CustomNavbar :show-back="false">
      <template #left>
        <view class="navbar-left" @tap="goToSwitchRole">
          <text class="role-tag">货主</text>
        </view>
      </template>
      <template #right>
        <view class="navbar-right" @tap="goToMessage">
          <TnIcon name="sound" size="40" />
          <TnBadge
            value="3"
            type="danger"
            absolute
            :absolute-config="{ top: '-10rpx', right: '-10rpx' }"
          />
        </view>
      </template>
    </CustomNavbar>

    <!-- 页面内容 -->
    <view class="home-content">
      <!-- 个人信息卡片 -->
      <view class="user-card">
        <view class="user-info">
          <view class="avatar-box">
            <text class="avatar-text">{{
              userInfo.nickname?.charAt(0) || '货'
            }}</text>
          </view>
          <view class="user-detail">
            <text class="nickname">{{ userInfo.nickname }}</text>
            <text class="company">{{ userInfo.companyName }}</text>
            <view v-if="userInfo.verifyStatus === 2" class="verify-tag">
              <text class="verify-text">已认证</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 快捷功能 -->
      <view class="quick-section">
        <TnTitle title="快捷功能" mode="dot" assist-color="#00B578" size="lg" />
        <view class="quick-grid">
          <view
            v-for="item in quickActions"
            :key="item.id"
            class="quick-item"
            @tap="navigateTo(item.path)"
          >
            <view class="quick-icon-box">
              <TnIcon :name="item.icon" size="40" color="#fff" />
            </view>
            <text class="quick-label">{{ item.label }}</text>
          </view>
        </view>
      </view>

      <!-- 公告 -->
      <view class="notice-section">
        <view class="notice-card">
          <view class="notice-icon-box">
            <TnIcon name="sound" size="36" color="#007aff" />
          </view>
          <view class="notice-text">
            <text>欢迎使用物流运输平台</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.shipper-home {
  min-height: 100vh;
  background: #f4f5f7;
}

.navbar-left {
  display: flex;
  align-items: center;

  .role-tag {
    background: linear-gradient(135deg, #00b578, #00d68f);
    color: #fff;
    padding: 8rpx 20rpx;
    border-radius: 20rpx;
    font-size: 24rpx;
    font-weight: bold;
  }
}

.navbar-right {
  position: relative;

  .message-icon {
    font-size: 40rpx;
  }
}

.home-content {
  padding: 180rpx 30rpx 30rpx;
}

.user-card {
  background: linear-gradient(135deg, #00b578, #00d68f);
  border-radius: 24rpx;
  padding: 40rpx;
  margin-bottom: 30rpx;

  .user-info {
    display: flex;
    align-items: center;

    .avatar-box {
      width: 100rpx;
      height: 100rpx;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      .avatar-text {
        font-size: 40rpx;
        color: #fff;
        font-weight: bold;
      }
    }

    .user-detail {
      margin-left: 24rpx;

      .nickname {
        font-size: 36rpx;
        color: #fff;
        font-weight: bold;
      }

      .company {
        font-size: 26rpx;
        color: rgba(255, 255, 255, 0.85);
        margin-top: 8rpx;
        display: block;
      }

      .verify-tag {
        display: inline-block;
        background: rgba(255, 255, 255, 0.2);
        padding: 4rpx 12rpx;
        border-radius: 12rpx;
        margin-top: 10rpx;

        .verify-text {
          font-size: 20rpx;
          color: #fff;
        }
      }
    }
  }
}

.quick-section {
  margin-bottom: 30rpx;

  :deep(.tn-title) {
    margin-bottom: 20rpx;
  }
}

.quick-grid {
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

  .quick-item {
    display: flex;
    flex-direction: column;
    align-items: center;

    .quick-icon-box {
      width: 80rpx;
      height: 80rpx;
      background: linear-gradient(135deg, #00b578, #00d68f);
      border-radius: 20rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12rpx;
    }

    .quick-label {
      font-size: 24rpx;
      color: #333;
    }
  }
}

.notice-section {
  margin-bottom: 30rpx;
}

.notice-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 24rpx 30rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

  .notice-icon-box {
    margin-right: 16rpx;
  }

  .notice-text {
    flex: 1;

    text {
      font-size: 26rpx;
      color: #666;
    }
  }
}
</style>
