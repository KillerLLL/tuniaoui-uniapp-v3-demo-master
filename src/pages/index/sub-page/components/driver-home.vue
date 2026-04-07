<script lang="ts" setup>
/**
 * 司机端首页 - Tabbar子页面
 */
import { ref, onMounted } from 'vue'
import { getUserInfoApi, getOngoingOrderApi } from '@/api/driver'
import { ORDER_STATUS_CONFIG } from '@/utils/const'

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
})

// 收入数据
const incomeData = ref([
  { label: '待结算', value: '¥128.00', key: 'pendingSettlement', color: 'warning' },
  { label: '今日收入', value: '¥356.00', key: 'todayIncome', color: 'success' },
  { label: '已提现', value: '¥2,560', key: 'totalIncome', color: 'primary' },
])

// 进行中的订单
const ongoingOrder = ref<any>(null)

// 快捷入口
const quickActions = [
  { id: 1, label: '我要接单', icon: 'car-fill', path: '/biz-pages/driver/grab/index', gradient: 'from-primary-500 to-primary-600' },
  { id: 2, label: '我的订单', icon: 'order', path: '/biz-pages/driver/order/list', gradient: 'from-success-500 to-success-600' },
  { id: 3, label: '我的钱包', icon: 'wallet', path: '/biz-pages/driver/my/wallet', gradient: 'from-warning-500 to-warning-600' },
  { id: 4, label: '车辆管理', icon: 'car', path: '/biz-pages/driver/my/vehicle', gradient: 'from-danger-500 to-danger-600' },
]

// 公告列表
const noticeList = [
  '平台新功能上线，抢单更便捷',
  '春节期间运费调整公告',
]

// 加载数据
const loadData = async () => {
  try {
    const [userRes, orderRes] = await Promise.all([
      getUserInfoApi(),
      getOngoingOrderApi(),
    ])
    if (userRes.code === 200) {
      userInfo.value = userRes.data
      const wallet = userRes.data.wallet || {}
      incomeData.value = [
        { label: '待结算', value: `¥${wallet.pendingSettlement || 0}`, key: 'pendingSettlement', color: 'warning' },
        { label: '今日收入', value: `¥${wallet.todayIncome || 0}`, key: 'todayIncome', color: 'success' },
        { label: '已提现', value: `¥${(wallet.totalIncome || 0).toLocaleString()}`, key: 'totalIncome', color: 'primary' },
      ]
    }
    if (orderRes.code === 200) {
      ongoingOrder.value = orderRes.data
    }
  } catch (e) {
    console.error('加载数据失败', e)
  }
}

// 跳转到页面
const navigateTo = (path: string) => {
  uni.navigateTo({ url: path })
}

// 查看订单详情
const goToOrderDetail = () => {
  if (ongoingOrder.value) {
    uni.navigateTo({ url: `/biz-pages/driver/order/ongoing?id=${ongoingOrder.value.id}` })
  }
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
  loadData()
})
</script>

<template>
  <view class="driver-home min-h-screen bg-zinc-100">
    <!-- 顶部渐变背景 -->
    <view class="top-bg">
      <view class="top-gradient" />
    </view>

    <!-- 顶部导航栏 -->
    <view class="navbar-glass fixed top-0 left-0 right-0 z-50 safe-top">
      <view class="navbar-inner flex-between h-100rpx px-30rpx">
        <!-- 左侧角色切换 -->
        <view
          class="role-btn flex-center gap-8rpx bg-white/20 backdrop-blur-md rounded-20rpx px-20rpx py-10rpx card-press"
          @tap="goToSwitchRole"
        >
          <TnIcon name="people" size="32rpx" color="#fff" />
          <text class="text-white text-26rpx font-bold">司机</text>
        </view>

        <!-- 中间问候语 -->
        <view class="text-center">
          <text class="text-white/90 text-28rpx">早安，{{ userInfo.nickname }}</text>
        </view>

        <!-- 右侧消息通知 -->
        <view
          class="msg-btn relative flex-center w-70rpx h-70rpx bg-white/20 backdrop-blur-md rounded-full card-press"
          @tap="goToMessage"
        >
          <TnIcon name="sound" size="36rpx" color="#fff" />
          <view class="absolute -top-4rpx -right-4rpx w-32rpx h-32rpx bg-danger-500 rounded-full flex-center">
            <text class="text-white text-20rpx font-bold">3</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 页面内容 -->
    <view class="home-content pb-180rpx">
      <!-- 用户信息玻璃态卡片 -->
      <view class="user-card-glass mx-30rpx mt-200rpx relative z-10">
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

          <!-- 车辆信息 -->
          <view
            v-if="userInfo.driverInfo"
            class="car-info-box bg-white/15 backdrop-blur-sm rounded-20rpx px-16rpx py-12rpx"
          >
            <view class="flex items-center gap-8rpx">
              <TnIcon name="car" size="28rpx" color="#fff" />
              <text class="text-white text-22rpx">{{ userInfo.driverInfo.carType }}</text>
            </view>
            <text class="text-white text-24rpx font-bold mt-4rpx block">
              {{ userInfo.driverInfo.carPlate }}
            </text>
          </view>
        </view>
      </view>

      <!-- 收入三卡片 -->
      <view class="income-cards mx-30rpx mt-30rpx grid grid-cols-3 gap-20rpx relative z-10">
        <view
          v-for="(item, index) in incomeData"
          :key="index"
          class="income-card-glass rounded-20rpx p-20rpx text-center card-press"
          :class="index === 1 ? 'active-card' : ''"
        >
          <text class="text-white/70 text-24rpx block">{{ item.label }}</text>
          <text
            class="text-white text-36rpx font-bold mt-8rpx block"
            :class="index === 1 ? 'text-42rpx' : ''"
          >
            {{ item.value }}
          </text>
          <view
            v-if="index === 1"
            class="income-indicator absolute bottom-0 left-1/2 -translate-x-1/2 w-60rpx h-6rpx bg-white rounded-full"
          />
        </view>
      </view>

      <!-- 快捷功能网格 -->
      <view class="quick-section mx-30rpx mt-30rpx relative z-10">
        <view class="section-title flex items-center gap-12rpx mb-20rpx">
          <view class="title-dot w-12rpx h-12rpx bg-primary-500 rounded-full" />
          <text class="text-zinc-800 text-30rpx font-bold">快捷功能</text>
        </view>
        <view class="quick-grid glass-card rounded-24rpx p-30rpx">
          <view class="grid grid-cols-4 gap-20rpx">
            <view
              v-for="item in quickActions"
              :key="item.id"
              class="quick-item flex flex-col items-center card-press"
              @tap="navigateTo(item.path)"
            >
              <view
                class="quick-icon w-90rpx h-90rpx rounded-20rpx flex-center mb-12rpx"
                :class="`bg-gradient-to-br ${item.gradient} shadow-lg`"
              >
                <TnIcon :name="item.icon" size="44rpx" color="#fff" />
              </view>
              <text class="text-zinc-700 text-24rpx">{{ item.label }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 进行中订单 -->
      <view class="order-section mx-30rpx mt-30rpx relative z-10">
        <view class="section-header flex-between mb-20rpx">
          <view class="flex items-center gap-12rpx">
            <view class="title-dot w-12rpx h-12rpx bg-success-500 rounded-full" />
            <text class="text-zinc-800 text-30rpx font-bold">进行中订单</text>
          </view>
          <view
            class="more-btn flex items-center gap-4rpx card-press px-10rpx py-6rpx rounded-lg"
            @tap="navigateTo('/biz-pages/driver/order/list')"
          >
            <text class="text-zinc-500 text-24rpx">查看全部</text>
            <TnIcon name="right" size="24rpx" color="#999" />
          </view>
        </view>

        <!-- 有订单时 -->
        <view
          v-if="ongoingOrder"
          class="order-card-glass rounded-24rpx p-30rpx card-press"
          @tap="goToOrderDetail"
        >
          <view class="flex-between mb-20rpx">
            <text class="text-zinc-500 text-24rpx">订单号: {{ ongoingOrder.orderNo }}</text>
            <view
              class="status-tag px-16rpx py-6rpx rounded-full"
              :class="
                ORDER_STATUS_CONFIG[ongoingOrder.status]?.color === '#00B578'
                  ? 'bg-success-500/10'
                  : 'bg-warning-500/10'
              "
            >
              <text
                class="text-22rpx font-medium"
                :class="
                  ORDER_STATUS_CONFIG[ongoingOrder.status]?.color === '#00B578'
                    ? 'text-success-500'
                    : 'text-warning-500'
                "
              >
                {{ ORDER_STATUS_CONFIG[ongoingOrder.status]?.text || '未知' }}
              </text>
            </view>
          </view>

          <!-- 路线 -->
          <view class="route-section py-20rpx border-y border-zinc-100/50">
            <view class="flex items-start gap-16rpx">
              <view class="point-icon w-44rpx h-44rpx bg-primary-500/10 rounded-full flex-center">
                <TnIcon name="start" size="26rpx" color="#3b82f6" />
              </view>
              <view class="flex-1">
                <text class="text-zinc-800 text-28rpx">装货: {{ ongoingOrder.loadingAddress }}</text>
              </view>
            </view>
            <view class="route-line w-2rpx h-30rpx bg-zinc-300 ml-21rpx my-8rpx" />
            <view class="flex items-start gap-16rpx">
              <view class="point-icon w-44rpx h-44rpx bg-success-500/10 rounded-full flex-center">
                <TnIcon name="location-fill" size="26rpx" color="#10b981" />
              </view>
              <view class="flex-1">
                <text class="text-zinc-800 text-28rpx">卸货: {{ ongoingOrder.unloadingAddress }}</text>
              </view>
            </view>
          </view>

          <!-- 底部 -->
          <view class="flex-between mt-20rpx">
            <view>
              <text class="text-zinc-500 text-24rpx">运费</text>
              <text class="text-warning-500 text-40rpx font-bold ml-8rpx">
                ¥{{ ongoingOrder.freight }}
              </text>
            </view>
            <view class="flex items-center gap-6rpx text-primary-500">
              <text class="text-28rpx">查看详情</text>
              <TnIcon name="right" size="26rpx" color="#3b82f6" />
            </view>
          </view>
        </view>

        <!-- 无订单时 -->
        <view v-else class="order-empty-glass rounded-24rpx p-60rpx text-center">
          <view class="empty-icon w-120rpx h-120rpx mx-auto mb-30rpx bg-zinc-100 rounded-full flex-center">
            <TnIcon name="order" size="60rpx" color="#999" />
          </view>
          <text class="text-zinc-500 text-28rpx block mb-30rpx">暂无进行中的订单</text>
          <view
            class="inline-block bg-gradient-to-r from-primary-500 to-primary-600 text-white px-40rpx py-16rpx rounded-full text-28rpx font-medium shadow-lg shadow-primary-500/30 btn-press"
            @tap="navigateTo('/biz-pages/driver/grab/index')"
          >
            去抢单
          </view>
        </view>
      </view>

      <!-- 公告区域 -->
      <view class="notice-section mx-30rpx mt-30rpx mb-30rpx relative z-10">
        <view class="notice-glass rounded-24rpx p-24rpx flex items-center gap-16rpx">
          <view class="notice-icon w-56rpx h-56rpx bg-primary-500/10 rounded-full flex-center shrink-0">
            <TnIcon name="sound" size="32rpx" color="#3b82f6" />
          </view>
          <swiper
            class="notice-swiper flex-1 h-56rpx"
            vertical
            autoplay
            circular
            interval="3000"
          >
            <swiper-item v-for="(notice, index) in noticeList" :key="index">
              <text class="text-zinc-600 text-26rpx leading-56rpx text-ellipsis">
                {{ notice }}
              </text>
            </swiper-item>
          </swiper>
        </view>
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
  height: 500rpx;
  z-index: 1;
  overflow: hidden;

  .top-gradient {
    width: 100%;
    height: 100%;
    background: linear-gradient(
      135deg,
      #3b82f6 0%,
      #6366f1 25%,
      #8b5cf6 50%,
      #a855f7 75%,
      #c084fc 100%
    );
    border-radius: 0 0 100rpx 100rpx;
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
  position: relative;
  overflow: hidden;

  &.active-card {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.4);
  }
}

// 玻璃态卡片
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
}

// 订单卡片玻璃态
.order-card-glass {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1rpx solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.08);
}

// 无订单空状态
.order-empty-glass {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1rpx solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.08);
}

// 公告玻璃态
.notice-glass {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1rpx solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
}

// 路由连接线
.route-line {
  background: linear-gradient(to bottom, #d1d5db, #e5e7eb);
}

// 快捷图标渐变阴影
.quick-icon {
  box-shadow: 0 8rpx 16rpx rgba(59, 130, 246, 0.3);

  &.bg-gradient-to-br {
    &.from-success-500 {
      box-shadow: 0 8rpx 16rpx rgba(16, 185, 129, 0.3);
    }
    &.from-warning-500 {
      box-shadow: 0 8rpx 16rpx rgba(245, 158, 11, 0.3);
    }
    &.from-danger-500 {
      box-shadow: 0 8rpx 16rpx rgba(239, 68, 68, 0.3);
    }
  }
}
</style>
