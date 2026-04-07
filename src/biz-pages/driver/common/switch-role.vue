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
  <view class="switch-role-page min-h-screen bg-gray-100">
    <!-- 自定义导航栏 -->
    <CustomNavbar title="身份切换" />

    <!-- 页面内容 -->
    <view class="role-content px-6 pt-45">
      <!-- 标题区域 -->
      <view class="text-center mb-12">
        <text class="title-text text-2xl font-bold text-gray-800 block mb-2">选择身份</text>
        <text class="title-hint text-sm text-gray-400">切换身份后将进入对应的端</text>
      </view>

      <!-- 角色选择列表 -->
      <view class="role-list">
        <!-- 司机卡片 -->
        <view
          class="role-card driver glass-card rounded-2xl p-8 flex items-center mb-6 card-press"
          @tap="switchToRole('driver')"
        >
          <view class="role-icon-box w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center mr-6">
            <TnIcon name="car-fill" size="24" color="#fff" />
          </view>
          <view class="role-info flex-1">
            <text class="role-name text-lg font-bold text-gray-800 block mb-1">司机</text>
            <text class="role-desc text-sm text-gray-400">承接货源、运输货物</text>
          </view>
          <view class="role-check w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <TnIcon name="check" size="16" color="#3b82f6" />
          </view>
        </view>

        <!-- 货主卡片 -->
        <view
          class="role-card shipper glass-card rounded-2xl p-8 flex items-center mb-6 card-press"
          @tap="switchToRole('shipper')"
        >
          <view class="role-icon-box w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center mr-6">
            <TnIcon name="express" size="24" color="#fff" />
          </view>
          <view class="role-info flex-1">
            <text class="role-name text-lg font-bold text-gray-800 block mb-1">货主</text>
            <text class="role-desc text-sm text-gray-400">发布货源、管理订单</text>
          </view>
          <view class="role-check w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <TnIcon name="check" size="16" color="#10b981" />
          </view>
        </view>
      </view>

      <!-- 提示信息 -->
      <view class="tips-section text-center mt-10">
        <text class="tips-text text-sm text-gray-400">当前为司机身份，点击货主卡片可切换</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
/* 使用 UnoCSS 原子化类名 */

/* 玻璃态卡片效果 */
.glass-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20rpx);
  -webkit-backdrop-filter: blur(20rpx);
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

/* 卡片按压效果 */
.card-press {
  transition: transform 0.2s ease, opacity 0.2s ease;

  &:active {
    transform: scale(0.98);
    opacity: 0.9;
  }
}

/* 渐变背景图标盒子 */
.role-icon-box {
  box-shadow: 0 4rpx 12rpx rgba(59, 130, 246, 0.3);
}

.shipper .role-icon-box {
  box-shadow: 0 4rpx 12rpx rgba(16, 185, 129, 0.3);
}
</style>
