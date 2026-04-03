<script setup>
import { ref } from 'vue'
import TnIcon from '@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue'
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'
import { logoutApi } from '@/api/user'

defineOptions({
  options: {
    virtualHost: true,
  },
})

// 消息通知开关状态
const notificationEnabled = ref(true)

// 菜单列表配置
const menuList = ref([
  {
    key: 'notification',
    label: '消息通知',
    type: 'switch',
    icon: 'notice',
  },
  {
    key: 'clearCache',
    label: '清除缓存',
    type: 'arrow',
    icon: 'delete',
  },
  {
    key: 'about',
    label: '关于我们',
    type: 'arrow',
    icon: 'about',
  },
  {
    key: 'logout',
    label: '退出登录',
    type: 'arrow',
    icon: 'logout',
    color: '#FF4C4C',
  },
])

// 消息通知开关切换
const handleSwitchChange = (val) => {
  notificationEnabled.value = val
  uni.showToast({
    title: val ? '已开启通知' : '已关闭通知',
    icon: 'none',
  })
}

// 清除缓存
const handleClearCache = () => {
  uni.showModal({
    title: '提示',
    content: '确定要清除缓存吗？',
    success: (res) => {
      if (res.confirm) {
        // 保留登录信息，清除其他缓存
        const token = uni.getStorageSync('token')
        const userInfo = uni.getStorageSync('userInfo')
        uni.clearStorageSync()
        if (token) uni.setStorageSync('token', token)
        if (userInfo) uni.setStorageSync('userInfo', userInfo)
        uni.showToast({ title: '缓存已清除', icon: 'success' })
      }
    },
  })
}

// 关于我们
const handleAbout = () => {
  uni.showModal({
    title: '关于我们',
    content: '物流运输平台 v1.0.0',
    showCancel: false,
  })
}

// 退出登录
const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await logoutApi()
        } catch (e) {
          // 接口失败也继续退出流程
        }
        // 清空本地存储
        uni.clearStorageSync()
        // 跳转登录页
        uni.reLaunch({ url: '/biz-pages/login/index' })
      }
    },
  })
}

// 菜单点击处理
const handleMenuTap = (item) => {
  switch (item.key) {
    case 'clearCache':
      handleClearCache()
      break
    case 'about':
      handleAbout()
      break
    case 'logout':
      handleLogout()
      break
    default:
      break
  }
}
</script>

<template>
  <view class="setting-page">
    <CustomNavbar title="设置" bgColor="#fff" />

    <view class="page-content">
      <!-- 菜单列表 -->
      <view class="menu-section">
        <view
          v-for="item in menuList"
          :key="item.key"
          class="menu-item"
          @tap="handleMenuTap(item)"
        >
          <!-- 左侧图标和标题 -->
          <view class="menu-left">
            <TnIcon
              :name="item.icon"
              :color="item.color || '#333'"
              size="40"
            />
            <text class="menu-label" :style="{ color: item.color || '#333' }">
              {{ item.label }}
            </text>
          </view>

          <!-- 右侧操作区 -->
          <view class="menu-right">
            <!-- switch类型：消息通知开关 -->
            <switch
              v-if="item.type === 'switch'"
              :checked="notificationEnabled"
              color="#007AFF"
              @change="(e) => handleSwitchChange(e.detail.value)"
            />
            <!-- arrow类型：右箭头 -->
            <TnIcon
              v-if="item.type === 'arrow'"
              name="right"
              color="#ccc"
              size="32"
            />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.setting-page {
  min-height: 100vh;
  background: #f4f5f7;

  .page-content {
    padding-top: calc(var(--status-bar-height) + 88rpx + 30rpx);
  }

  .menu-section {
    margin: 0 24rpx;
    background: #fff;
    border-radius: 16rpx;
    overflow: hidden;

    .menu-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 28rpx 24rpx;
      border-bottom: 1rpx solid #f5f5f5;

      &:last-child {
        border-bottom: none;
      }

      .menu-left {
        display: flex;
        align-items: center;

        .menu-label {
          font-size: 30rpx;
          margin-left: 16rpx;
        }
      }

      .menu-right {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
