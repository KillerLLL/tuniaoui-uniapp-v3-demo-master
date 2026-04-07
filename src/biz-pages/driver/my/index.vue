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
  <view class="min-h-screen bg-gray-100">
    <!-- 自定义导航栏 -->
    <CustomNavbar title="我的" :show-back="false">
      <template #right>
        <view class="p-2 btn-press" @tap="goToSettings">
          <TnIcon name="setting" size="40" />
        </view>
      </template>
    </CustomNavbar>

    <!-- 页面内容 -->
    <view class="px-4 pb-8" style="padding-top: 180rpx">
      <!-- 个人信息卡片 - 玻璃态 -->
      <view class="glass-card mb-6 p-8 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-400 shadow-lg shadow-blue-500/30">
        <view class="flex items-center">
          <!-- 头像 -->
          <view class="w-25 h-25 bg-white/20 rounded-full flex items-center justify-center">
            <text class="text-white text-4xl font-bold">{{ userInfo.nickname?.charAt(0) || '司' }}</text>
          </view>
          <!-- 用户信息 -->
          <view class="ml-6 flex-1">
            <text class="text-white text-xl font-bold">{{ userInfo.nickname }}</text>
            <text class="text-white/80 text-sm mt-1 block">{{ userInfo.phone }}</text>
            <view v-if="userInfo.verifyStatus === 2" class="inline-flex items-center bg-white/20 px-3 py-1 rounded-xl mt-2">
              <TnIcon name="star" size="20" color="#fff" />
              <text class="text-white text-xs ml-1">已认证</text>
            </view>
          </view>
        </view>
        <!-- 车辆信息 -->
        <view v-if="userInfo.driverInfo" class="flex items-center mt-6 pt-6 border-t border-white/20">
          <text class="text-white/80 text-sm">{{ userInfo.driverInfo.carType }}</text>
          <text class="text-white text-sm ml-4 font-bold">{{ userInfo.driverInfo.carPlate }}</text>
        </view>
      </view>

      <!-- 收入概览 -->
      <view class="mb-6">
        <TnTitle title="收入概览" mode="dot" assist-color="#10b981" size="lg" />
        <!-- 收入卡片 -->
        <view class="card-press bg-white rounded-3xl p-6 shadow-sm" @tap="goToIncome">
          <view class="flex">
            <view class="flex-1 text-center" @tap.stop>
              <text class="text-gray-400 text-sm block mb-2">今日收益</text>
              <text class="text-gray-800 text-lg font-bold block">¥{{ userInfo.wallet?.todayIncome || 0 }}</text>
            </view>
            <view class="w-1 bg-gray-100" />
            <view class="flex-1 text-center" @tap.stop>
              <text class="text-gray-400 text-sm block mb-2">累计收益</text>
              <text class="text-gray-800 text-lg font-bold block">¥{{ (userInfo.wallet?.totalIncome || 0).toLocaleString() }}</text>
            </view>
            <view class="w-1 bg-gray-100" />
            <view class="flex-1 text-center" @tap.stop>
              <text class="text-gray-400 text-sm block mb-2">待结算</text>
              <text class="text-primary text-lg font-bold block">¥{{ userInfo.wallet?.pendingSettlement || 0 }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 功能菜单 -->
      <view class="mb-6">
        <TnTitle title="功能菜单" mode="dot" assist-color="#3b82f6" size="lg" />
        <view class="bg-white rounded-3xl overflow-hidden shadow-sm">
          <view
            v-for="item in menuList"
            :key="item.id"
            class="flex items-center btn-press p-8 border-b border-gray-100 last:border-b-0"
            @tap="navigateTo(item.path)"
          >
            <view class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-400 rounded-2xl flex items-center justify-center mr-5">
              <TnIcon :name="item.icon" size="36" color="#fff" />
            </view>
            <text class="flex-1 text-gray-800 text-base">{{ item.label }}</text>
            <TnIcon name="right" size="28" color="#ccc" />
          </view>
        </view>
      </view>

      <!-- 身份切换 -->
      <view class="mb-6">
        <view class="btn-press active:scale-95 transition-transform">
          <TnButton type="primary" plain shape="round" width="100%" height="96rpx" @click="goToSwitchRole">
            <TnIcon name="swap" size="36" />
            <text class="text-base font-bold ml-3">切换为货主</text>
          </TnButton>
        </view>
      </view>

      <!-- 版本信息 -->
      <view class="text-center py-6">
        <text class="text-gray-300 text-xs">物流运输 v1.0.0</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
/* UnoCSS 原子化类名覆盖 */
.glass-card {
  backdrop-filter: blur(20rpx);
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(59, 182, 255, 0.9));
}

.card-press {
  transition: transform 0.15s ease;
}

.card-press:active {
  transform: scale(0.98);
}

.btn-press {
  transition: transform 0.15s ease;
}

.btn-press:active {
  transform: scale(0.95);
}

.text-primary {
  color: #3b82f6;
}
</style>
