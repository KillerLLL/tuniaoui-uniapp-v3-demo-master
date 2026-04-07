<script lang="ts" setup>
/**
 * 设置页面
 */
import CustomNavbar from '@/components/custom-navbar/index.vue'

// 设置项列表
const settingsList = [
  { id: 1, icon: 'sound', label: '消息通知', type: 'switch' },
  { id: 2, icon: 'lock', label: '隐私设置', type: 'arrow' },
  { id: 3, icon: 'question', label: '帮助与反馈', type: 'arrow' },
  { id: 4, icon: 'file', label: '用户协议', type: 'arrow' },
  { id: 5, icon: 'lock', label: '隐私政策', type: 'arrow' },
  { id: 6, icon: 'info', label: '关于我们', type: 'arrow' },
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
  <view class="min-h-screen bg-gray-100">
    <!-- 自定义导航栏 -->
    <CustomNavbar title="设置" />

    <!-- 页面内容 -->
    <view class="px-4 pb-8" style="padding-top: 180rpx">
      <!-- 设置列表 -->
      <view class="bg-white rounded-3xl overflow-hidden mb-6 shadow-sm">
        <view
          v-for="item in settingsList"
          :key="item.id"
          class="settings-item btn-press flex items-center p-6 border-b border-gray-100 last:border-b-0"
        >
          <view class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-400 rounded-2xl flex items-center justify-center mr-5">
            <TnIcon :name="item.icon" size="36" color="#fff" />
          </view>
          <text class="flex-1 text-gray-800 text-sm">{{ item.label }}</text>
          <TnIcon v-if="item.type === 'arrow'" name="right" size="28" color="#ccc" />
          <switch v-else class="transform scale-80" :checked="true" />
        </view>
      </view>

      <!-- 退出登录 -->
      <view class="mb-6">
        <view class="btn-press">
          <TnButton type="danger" plain width="100%" height="96rpx" @click="handleLogout">
            退出登录
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
.btn-press {
  transition: transform 0.15s ease;
}

.btn-press:active {
  transform: scale(0.95);
}
</style>
