<script lang="ts" setup>
/**
 * 个人中心页面（我的）
 * 包含个人信息、收入概览、功能菜单、身份切换
 */
import { onMounted, ref } from 'vue'
import CustomNavbar from '@/components/custom-navbar/index.vue'
import { getUserInfoApi } from '@/api/driver'

// 用户信息
const userInfo = ref({
  nickname: '李师傅',
  avatar: '',
  phone: '138****8888',
  verifyStatus: 2,
  driverInfo: {
    carType: '中型货车',
    carPlate: '京A12345',
  },
  wallet: {
    todayIncome: 356.0,
    totalIncome: 12560.0,
    pendingSettlement: 1280.0,
  },
})

// 功能菜单列表
const menuList = [
  {
    id: 1,
    icon: 'wallet',
    label: '我的钱包',
    path: '/biz-pages/driver/my/wallet',
  },
  {
    id: 2,
    icon: 'ticket',
    label: '发票管理',
    path: '/biz-pages/driver/my/invoice',
  },
  {
    id: 3,
    icon: 'car-fill',
    label: '车辆管理',
    path: '/biz-pages/driver/my/vehicle',
  },
  {
    id: 4,
    icon: 'coupon',
    label: '优惠券',
    path: '/biz-pages/driver/my/coupon',
  },
  { id: 5, icon: 'service', label: '客服与帮助', path: '' },
  {
    id: 6,
    icon: 'setting',
    label: '设置',
    path: '/biz-pages/driver/my/settings',
  },
]

// 加载数据
const loadData = async () => {
  try {
    const res = await getUserInfoApi()
    if (res.code === 200) {
      userInfo.value = res.data
    }
  } catch (e) {
    console.error('加载失败', e)
  }
}

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

// 跳转到我的收入
const goToIncome = () => {
  uni.navigateTo({ url: '/biz-pages/driver/my/income' })
}

onMounted(() => {
  loadData()
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
              userInfo.nickname?.charAt(0) || '司'
            }}</text>
          </view>
          <view class="user-detail">
            <text class="nickname">{{ userInfo.nickname }}</text>
            <text class="phone">{{ userInfo.phone }}</text>
            <view v-if="userInfo.verifyStatus === 2" class="verify-tag">
              <TnIcon name="star" size="20" color="#fff" />
              <text class="verify-text">已认证</text>
            </view>
          </view>
        </view>
        <view v-if="userInfo.driverInfo" class="car-info">
          <text class="car-text">{{ userInfo.driverInfo.carType }}</text>
          <text class="plate-text">{{ userInfo.driverInfo.carPlate }}</text>
        </view>
      </view>

      <!-- 收入概览 -->
      <view class="income-section">
        <TnTitle title="收入概览" mode="dot" assist-color="#00B578" size="lg" />
        <view class="income-card" @tap="goToIncome">
          <view class="income-item" @tap.stop>
            <text class="income-label">今日收益</text>
            <text class="income-value"
              >¥{{ userInfo.wallet?.todayIncome || 0 }}</text
            >
          </view>
          <view class="income-divider" />
          <view class="income-item" @tap.stop>
            <text class="income-label">累计收益</text>
            <text class="income-value"
              >¥{{ (userInfo.wallet?.totalIncome || 0).toLocaleString() }}</text
            >
          </view>
          <view class="income-divider" />
          <view class="income-item" @tap.stop>
            <text class="income-label">待结算</text>
            <text class="income-value primary"
              >¥{{ userInfo.wallet?.pendingSettlement || 0 }}</text
            >
          </view>
        </view>
      </view>

      <!-- 功能菜单 -->
      <view class="menu-section">
        <TnTitle title="功能菜单" mode="dot" assist-color="#007AFF" size="lg" />
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
          type="primary"
          plain
          shape="round"
          width="100%"
          height="96rpx"
          @click="goToSwitchRole"
        >
          <TnIcon name="swap" size="36" />
          <text class="switch-text">切换为货主</text>
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

// 用户卡片
.user-card {
  background: linear-gradient(135deg, #007aff, #00b4ff);
  border-radius: 24rpx;
  padding: 40rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 8rpx 30rpx rgba(0, 122, 255, 0.3);

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

      .phone {
        font-size: 26rpx;
        color: rgba(255, 255, 255, 0.85);
        margin-top: 8rpx;
        display: block;
      }

      .verify-tag {
        display: inline-flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.2);
        padding: 4rpx 12rpx;
        border-radius: 12rpx;
        margin-top: 10rpx;

        .verify-icon {
          font-size: 20rpx;
        }

        .verify-text {
          font-size: 20rpx;
          color: #fff;
          margin-left: 4rpx;
        }
      }
    }
  }

  .car-info {
    display: flex;
    align-items: center;
    margin-top: 24rpx;
    padding-top: 24rpx;
    border-top: 1rpx solid rgba(255, 255, 255, 0.2);

    .car-text {
      font-size: 26rpx;
      color: rgba(255, 255, 255, 0.85);
    }

    .plate-text {
      font-size: 26rpx;
      color: #fff;
      margin-left: 16rpx;
      font-weight: bold;
    }
  }
}

// 收入概览
.income-section {
  margin-bottom: 30rpx;

  :deep(.tn-title) {
    margin-bottom: 20rpx;
  }
}

.income-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

  .income-item {
    flex: 1;
    text-align: center;

    .income-label {
      font-size: 26rpx;
      color: #999;
      display: block;
      margin-bottom: 10rpx;
    }

    .income-value {
      font-size: 32rpx;
      color: #333;
      font-weight: bold;
      display: block;

      &.primary {
        color: #ff7a00;
      }
    }
  }

  .income-divider {
    width: 1rpx;
    background: #f0f0f0;
  }
}

// 功能菜单
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
    background: linear-gradient(135deg, #007aff, #00b4ff);
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

// 身份切换
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

// 版本信息
.version-info {
  text-align: center;
  padding: 30rpx 0;

  .version-text {
    font-size: 24rpx;
    color: #ccc;
  }
}
</style>
