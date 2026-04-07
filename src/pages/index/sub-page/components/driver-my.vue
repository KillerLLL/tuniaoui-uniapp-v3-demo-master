<script lang="ts" setup>
/**
 * 个人中心 - Tabbar子页面
 */
import { ref, onMounted } from 'vue'
import { getUserInfoApi } from '@/api/driver'

// 用户信息
const userInfo = ref<any>({
  nickname: '李师傅',
  avatar: '',
  phone: '138****8888',
  verifyStatus: 2,
  driverInfo: {
    carType: '中型货车',
    carPlate: '京A12345',
  },
  wallet: {
    todayIncome: 356.00,
    totalIncome: 12560.00,
    pendingSettlement: 1280.00,
  },
})

// 功能菜单列表
const menuList = [
  { id: 1, icon: 'wallet', label: '我的钱包', path: '/biz-pages/driver/my/wallet', gradient: 'from-primary-500 to-primary-600' },
  { id: 2, icon: 'ticket', label: '发票管理', path: '/biz-pages/driver/my/invoice', gradient: 'from-success-500 to-success-600' },
  { id: 3, icon: 'car-fill', label: '车辆管理', path: '/biz-pages/driver/my/vehicle', gradient: 'from-warning-500 to-warning-600' },
  { id: 4, icon: 'coupon', label: '优惠券', path: '/biz-pages/driver/my/coupon', gradient: 'from-danger-500 to-danger-600' },
  { id: 5, icon: 'service', label: '客服与帮助', path: '', gradient: 'from-zinc-500 to-zinc-600' },
  { id: 6, icon: 'setting', label: '设置', path: '/biz-pages/driver/my/settings', gradient: 'from-zinc-400 to-zinc-500' },
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
const navigateTo = (path: string) => {
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

// 跳转到我的收入
const goToIncome = () => {
  navigateTo('/biz-pages/driver/my/income')
}

// 跳转到身份切换
const goToSwitchRole = () => {
  uni.navigateTo({ url: '/biz-pages/driver/common/switch-role' })
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <view class="my-page min-h-screen bg-zinc-100">
    <!-- 顶部渐变背景 -->
    <view class="top-bg">
      <view class="top-gradient" />
    </view>

    <!-- 顶部导航栏 -->
    <view class="navbar-glass fixed top-0 left-0 right-0 z-50 safe-top">
      <view class="navbar-inner flex-end h-100rpx pr-30rpx">
        <view
          class="settings-btn flex-center w-70rpx h-70rpx bg-white/20 backdrop-blur-md rounded-full card-press"
          @tap="goToSettings"
        >
          <TnIcon name="setting" size="40rpx" color="#fff" />
        </view>
      </view>
    </view>

    <!-- 页面内容 -->
    <view class="my-content pb-180rpx">
      <!-- 个人信息卡片 -->
      <view class="user-card-glass mx-30rpx mt-180rpx relative z-10">
        <view class="card-decoration absolute -top-40rpx -right-40rpx w-200rpx h-200rpx bg-gradient-to-br from-white/20 to-transparent rounded-full" />

        <view class="user-info-row flex items-center">
          <!-- 头像 -->
          <view class="avatar-container">
            <view class="avatar-ring">
              <view class="avatar-inner flex-center">
                <text class="text-white text-44rpx font-bold">
                  {{ userInfo.nickname?.charAt(0) || '司' }}
                </text>
              </view>
            </view>
            <view class="online-dot absolute bottom-4rpx right-4rpx" />
          </view>

          <!-- 用户信息 -->
          <view class="user-detail ml-30rpx flex-1">
            <view class="flex items-center gap-16rpx">
              <text class="text-white text-36rpx font-bold">{{ userInfo.nickname }}</text>
              <view
                v-if="userInfo.verifyStatus === 2"
                class="verify-badge flex items-center gap-4rpx bg-white/25 backdrop-blur-sm px-12rpx py-4rpx rounded-full"
              >
                <TnIcon name="star" size="20rpx" color="#fbbf24" />
                <text class="text-white text-20rpx">已认证</text>
              </view>
            </view>
            <text class="text-white/70 text-24rpx mt-8rpx block">{{ userInfo.phone }}</text>
          </view>
        </view>

        <!-- 车辆信息 -->
        <view
          v-if="userInfo.driverInfo"
          class="car-info-row mt-24rpx pt-24rpx border-t border-white/20"
        >
          <view class="flex items-center gap-8rpx">
            <TnIcon name="car" size="28rpx" color="rgba(255,255,255,0.85)" />
            <text class="text-white/85 text-26rpx">{{ userInfo.driverInfo.carType }}</text>
            <text class="text-white text-26rpx font-bold ml-16rpx">{{ userInfo.driverInfo.carPlate }}</text>
          </view>
        </view>
      </view>

      <!-- 收入概览 -->
      <view
        class="income-card-glass mx-30rpx mt-30rpx rounded-24rpx p-30rpx relative z-10 card-press"
        @tap="goToIncome"
      >
        <view class="grid grid-cols-3 gap-20rpx">
          <view class="text-center">
            <text class="text-white/70 text-24rpx block">今日收益</text>
            <text class="text-white text-36rpx font-bold mt-8rpx block">¥{{ userInfo.wallet?.todayIncome || 0 }}</text>
          </view>
          <view class="text-center border-x border-white/20">
            <text class="text-white/70 text-24rpx block">累计收益</text>
            <text class="text-white text-36rpx font-bold mt-8rpx block">¥{{ (userInfo.wallet?.totalIncome || 0).toLocaleString() }}</text>
          </view>
          <view class="text-center">
            <text class="text-white/70 text-24rpx block">待结算</text>
            <text class="text-warning-300 text-36rpx font-bold mt-8rpx block">¥{{ userInfo.wallet?.pendingSettlement || 0 }}</text>
          </view>
        </view>
      </view>

      <!-- 功能菜单 -->
      <view class="menu-section mx-30rpx mt-30rpx relative z-10">
        <view class="menu-list glass-card rounded-24rpx overflow-hidden">
          <view
            v-for="(item, index) in menuList"
            :key="item.id"
            class="menu-item flex items-center p-32rpx"
            :class="index !== menuList.length - 1 ? 'border-b border-zinc-100/50' : ''"
            @tap="navigateTo(item.path)"
          >
            <view
              class="menu-icon w-64rpx h-64rpx rounded-16rpx flex-center mr-20rpx"
              :class="`bg-gradient-to-br ${item.gradient}`"
            >
              <TnIcon :name="item.icon" size="36rpx" color="#fff" />
            </view>
            <text class="flex-1 text-zinc-800 text-30rpx">{{ item.label }}</text>
            <TnIcon name="right" size="28rpx" color="#ccc" />
          </view>
        </view>
      </view>

      <!-- 身份切换 -->
      <view class="switch-section mx-30rpx mt-30rpx relative z-10">
        <view
          class="switch-btn glass-card rounded-24rpx p-32rpx flex-center gap-12rpx card-press"
          @tap="goToSwitchRole"
        >
          <TnIcon name="swap" size="36rpx" color="#3b82f6" />
          <text class="text-primary-500 text-30rpx font-bold">切换为货主</text>
        </view>
      </view>

      <!-- 版本信息 -->
      <view class="version-info mt-60rpx text-center">
        <text class="text-zinc-400 text-24rpx">物流运输 v1.0.0</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
// 顶部渐变背景
.top-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 450rpx;
  z-index: 1;
  overflow: hidden;

  .top-gradient {
    width: 100%;
    height: 100%;
    background: linear-gradient(
      135deg,
      #3b82f6 0%,
      #6366f1 50%,
      #8b5cf6 100%
    );
    border-radius: 0 0 80rpx 80rpx;
  }
}

// 导航栏玻璃态
.navbar-glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.2);
}

// 用户卡片玻璃态
.user-card-glass {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1rpx solid rgba(255, 255, 255, 0.25);
  border-radius: 32rpx;
  padding: 40rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

// 头像容器
.avatar-container {
  position: relative;

  .avatar-ring {
    width: 110rpx;
    height: 110rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.1));
    padding: 4rpx;

    .avatar-inner {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: linear-gradient(135deg, #3b82f6, #6366f1);
    }
  }

  .online-dot {
    width: 20rpx;
    height: 20rpx;
    background: #10b981;
    border-radius: 50%;
    border: 4rpx solid #fff;
  }
}

// 收入卡片玻璃态
.income-card-glass {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

// 玻璃态卡片
.glass-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1rpx solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.08);
}
</style>
