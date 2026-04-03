<script lang="ts" setup>
/**
 * 货主端个人中心页面
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

// 功能菜单
const menuList = [
  {
    id: 1,
    icon: 'setting',
    label: '设置',
    path: '/biz-pages/driver/my/settings',
  },
  { id: 2, icon: 'service', label: '客服与帮助', path: '' },
  { id: 3, icon: 'info', label: '关于我们', path: '' },
]

// 跳转到页面
const navigateTo = (path) => {
  if (!path) {
    uni.showToast({ title: '功能开发中', icon: 'none' })
    return
  }
  uni.navigateTo({ url: path })
}

// 跳转到设置
const goToSettings = () => {
  navigateTo('/biz-pages/driver/my/settings')
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
  <view class="my-page">
    <!-- 自定义导航栏 -->
    <CustomNavbar title="我的" :show-back="false">
      <template #right>
        <view class="navbar-right" @tap="goToSettings">
          <TnIcon name="setting" size="40" />
        </view>
      </template>
    </CustomNavbar>

    <!-- 页面内容 -->
    <view class="my-content">
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

      <!-- 功能菜单 -->
      <view class="menu-section">
        <view class="menu-list">
          <view
            v-for="item in menuList"
            :key="item.id"
            class="menu-item"
            @tap="navigateTo(item.path)"
          >
            <view class="menu-icon-box">
              <TnIcon :name="item.icon" size="36" color="#fff" />
            </view>
            <text class="menu-label">{{ item.label }}</text>
            <TnIcon name="right" size="28" color="#ccc" />
          </view>
        </view>
      </view>

      <!-- 身份切换 -->
      <view class="switch-section">
        <TnButton
          type="success"
          plain
          shape="round"
          width="100%"
          height="96rpx"
          @click="goToSwitchRole"
        >
          <TnIcon name="swap" size="36" />
          <text class="switch-text">切换为司机</text>
        </TnButton>
      </view>

      <!-- 版本信息 -->
      <view class="version-info">
        <text class="version-text">物流运输 v1.0.0</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.my-page {
  min-height: 100vh;
  background: #f4f5f7;
}

.navbar-right {
  padding: 10rpx;

  .settings-icon {
    font-size: 40rpx;
  }
}

.my-content {
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

.menu-section {
  margin-bottom: 30rpx;
}

.menu-list {
  background: #fff;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 32rpx 30rpx;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  .menu-icon-box {
    width: 64rpx;
    height: 64rpx;
    background: linear-gradient(135deg, #00b578, #00d68f);
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20rpx;
  }

  .menu-label {
    flex: 1;
    font-size: 30rpx;
    color: #333;
  }
}

.switch-section {
  margin-bottom: 30rpx;

  :deep(.tn-button) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .switch-text {
    font-size: 30rpx;
    font-weight: bold;
    margin-left: 12rpx;
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
