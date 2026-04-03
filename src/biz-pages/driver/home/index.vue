<script lang="ts" setup>
/**
 * 司机端首页
 * 包含：个人信息、收入概览、快捷入口、进行中订单、公告
 */
import { ref, onMounted } from 'vue'
import CustomNavbar from '@/components/custom-navbar/index.vue'
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

// 钱包信息
const wallet = ref({
  balance: 1280.00,
  todayIncome: 356.00,
  totalIncome: 12560.00,
  pendingSettlement: 1280.00,
})

// 进行中的订单
const ongoingOrder = ref(null)

// 收入数据
const incomeData = ref([
  { label: '待结算', value: '¥128.00', key: 'pendingSettlement' },
  { label: '今日收入', value: '¥356.00', key: 'todayIncome' },
  { label: '已提现', value: '¥2,560', key: 'totalIncome' },
])

// 快捷入口
const quickActions = [
  { id: 1, label: '我要接单', icon: '🚚', path: '/biz-pages/driver/grab/index' },
  { id: 2, label: '我的订单', icon: '📋', path: '/biz-pages/driver/order/list' },
  { id: 3, label: '我的钱包', icon: '💰', path: '/biz-pages/driver/my/wallet' },
  { id: 4, label: '车辆管理', icon: '🚗', path: '/biz-pages/driver/my/vehicle' },
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
      wallet.value = userRes.data.wallet || wallet.value
      // 更新收入数据
      incomeData.value = [
        { label: '待结算', value: `¥${userRes.data.wallet?.pendingSettlement || 0}`, key: 'pendingSettlement' },
        { label: '今日收入', value: `¥${userRes.data.wallet?.todayIncome || 0}`, key: 'todayIncome' },
        { label: '已提现', value: `¥${(userRes.data.wallet?.totalIncome || 0).toLocaleString()}`, key: 'totalIncome' },
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
const navigateTo = (path) => {
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
  <view class="driver-home">
    <!-- 自定义导航栏 -->
    <CustomNavbar :show-back="false">
      <template #left>
        <view class="navbar-left" @tap="goToSwitchRole">
          <text class="role-tag">司机</text>
        </view>
      </template>
      <template #right>
        <view class="navbar-right" @tap="goToMessage">
          <text class="message-icon">🔔</text>
          <view class="message-badge">3</view>
        </view>
      </template>
    </CustomNavbar>

    <!-- 页面内容 -->
    <view class="home-content">
      <!-- 个人信息卡片 -->
      <view class="user-card">
        <view class="user-info">
          <view class="avatar-box">
            <text class="avatar-text">{{ userInfo.nickname?.charAt(0) || '司' }}</text>
          </view>
          <view class="user-detail">
            <text class="nickname">{{ userInfo.nickname }}</text>
            <text class="phone">{{ userInfo.phone }}</text>
            <view class="verify-tag" v-if="userInfo.verifyStatus === 2">
              <text class="verify-icon">⭐</text>
              <text class="verify-text">已认证</text>
            </view>
          </view>
        </view>
        <view class="car-info" v-if="userInfo.driverInfo">
          <text class="car-text">{{ userInfo.driverInfo.carType }}</text>
          <text class="plate-text">{{ userInfo.driverInfo.carPlate }}</text>
        </view>
      </view>

      <!-- 今日收入 -->
      <view class="income-section">
        <view class="income-card">
          <view
            v-for="(item, index) in incomeData"
            :key="index"
            class="income-item"
          >
            <text class="income-label">{{ item.label }}</text>
            <text class="income-value">{{ item.value }}</text>
          </view>
        </view>
      </view>

      <!-- 快捷功能 -->
      <view class="quick-section">
        <view class="section-title">
          <text class="title-text">快捷功能</text>
        </view>
        <view class="quick-grid">
          <view
            v-for="item in quickActions"
            :key="item.id"
            class="quick-item"
            @tap="navigateTo(item.path)"
          >
            <text class="quick-icon">{{ item.icon }}</text>
            <text class="quick-label">{{ item.label }}</text>
          </view>
        </view>
      </view>

      <!-- 进行中订单 -->
      <view class="order-section">
        <view class="section-title">
          <text class="title-text">进行中订单</text>
          <text class="title-more" @tap="navigateTo('/biz-pages/driver/order/list')">
            查看全部 →
          </text>
        </view>
        <view class="order-card" v-if="ongoingOrder" @tap="goToOrderDetail">
          <view class="order-header">
            <text class="order-no">订单号: {{ ongoingOrder.orderNo }}</text>
            <view
              class="order-status"
              :style="{ background: ORDER_STATUS_CONFIG[ongoingOrder.status]?.color || '#999' }"
            >
              {{ ORDER_STATUS_CONFIG[ongoingOrder.status]?.text || '未知' }}
            </view>
          </view>
          <view class="order-route">
            <view class="route-point">
              <text class="point-icon">○</text>
              <text class="point-text">{{ ongoingOrder.loadingAddress }}</text>
            </view>
            <view class="route-line"></view>
            <view class="route-point">
              <text class="point-icon">●</text>
              <text class="point-text">{{ ongoingOrder.unloadingAddress }}</text>
            </view>
          </view>
          <view class="order-footer">
            <text class="order-freight">运费: ¥{{ ongoingOrder.freight }}</text>
            <view class="order-action">
              <text class="action-text">查看详情</text>
            </view>
          </view>
        </view>
        <view class="order-empty" v-else>
          <text class="empty-icon">📋</text>
          <text class="empty-text">暂无进行中的订单</text>
          <view class="empty-btn" @tap="navigateTo('/biz-pages/driver/grab/index')">
            <text class="btn-text">去抢单</text>
          </view>
        </view>
      </view>

      <!-- 公告 -->
      <view class="notice-section">
        <view class="notice-card">
          <text class="notice-icon">📢</text>
          <swiper class="notice-swiper" vertical autoplay circular interval="3000">
            <swiper-item v-for="(notice, index) in noticeList" :key="index">
              <text class="notice-text">{{ notice }}</text>
            </swiper-item>
          </swiper>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.driver-home {
  min-height: 100vh;
  background: #f4f5f7;
}

.navbar-left {
  display: flex;
  align-items: center;

  .role-tag {
    background: linear-gradient(135deg, #007aff, #00b578);
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

  .message-badge {
    position: absolute;
    top: -8rpx;
    right: -8rpx;
    background: #ff4c4c;
    color: #fff;
    font-size: 18rpx;
    padding: 2rpx 8rpx;
    border-radius: 10rpx;
  }
}

.home-content {
  padding: 30rpx;
  padding-top: 180rpx;
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

// 收入卡片
.income-section {
  margin-bottom: 30rpx;
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
    }

    .income-value {
      font-size: 36rpx;
      color: #333;
      font-weight: bold;
      margin-top: 10rpx;
      display: block;
    }
  }
}

// 快捷功能
.quick-section {
  margin-bottom: 30rpx;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;

  .title-text {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
  }

  .title-more {
    font-size: 26rpx;
    color: #999;
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

    .quick-icon {
      font-size: 48rpx;
      margin-bottom: 12rpx;
    }

    .quick-label {
      font-size: 24rpx;
      color: #333;
    }
  }
}

// 进行中订单
.order-section {
  margin-bottom: 30rpx;
}

.order-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;

    .order-no {
      font-size: 26rpx;
      color: #666;
    }

    .order-status {
      padding: 6rpx 16rpx;
      border-radius: 20rpx;
      font-size: 22rpx;
      color: #fff;
    }
  }

  .order-route {
    padding: 20rpx 0;
    border-top: 1rpx solid #f0f0f0;
    border-bottom: 1rpx solid #f0f0f0;

    .route-point {
      display: flex;
      align-items: flex-start;

      .point-icon {
        font-size: 24rpx;
        color: #007aff;
        margin-right: 12rpx;
      }

      .point-text {
        font-size: 28rpx;
        color: #333;
        flex: 1;
      }
    }

    .route-line {
      width: 4rpx;
      height: 30rpx;
      background: #ddd;
      margin-left: 8rpx;
      margin-top: 8rpx;
      margin-bottom: 8rpx;
    }
  }

  .order-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20rpx;

    .order-freight {
      font-size: 32rpx;
      color: #ff7a00;
      font-weight: bold;
    }

    .order-action {
      .action-text {
        color: #007aff;
        font-size: 28rpx;
      }
    }
  }
}

.order-empty {
  background: #fff;
  border-radius: 24rpx;
  padding: 60rpx 30rpx;
  text-align: center;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

  .empty-icon {
    font-size: 80rpx;
    display: block;
    margin-bottom: 20rpx;
  }

  .empty-text {
    font-size: 28rpx;
    color: #999;
    display: block;
    margin-bottom: 30rpx;
  }

  .empty-btn {
    display: inline-block;
    background: linear-gradient(135deg, #007aff, #00b4ff);
    padding: 16rpx 40rpx;
    border-radius: 30rpx;

    .btn-text {
      color: #fff;
      font-size: 28rpx;
    }
  }
}

// 公告
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

  .notice-icon {
    font-size: 36rpx;
    margin-right: 16rpx;
  }

  .notice-swiper {
    flex: 1;
    height: 40rpx;

    .notice-text {
      font-size: 26rpx;
      color: #666;
      line-height: 40rpx;
    }
  }
}
</style>
