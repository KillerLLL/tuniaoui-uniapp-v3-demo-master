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
  { label: '待结算', value: '¥128.00' },
  { label: '今日收入', value: '¥356.00' },
  { label: '已提现', value: '¥2,560' },
])

// 进行中的订单
const ongoingOrder = ref<any>(null)

// 快捷入口
const quickActions = [
  { id: 1, label: '我要接单', icon: 'car', path: '/biz-pages/driver/grab/index' },
  { id: 2, label: '我的订单', icon: 'order', path: '/biz-pages/driver/order/list' },
  { id: 3, label: '我的钱包', icon: 'wallet', path: '/biz-pages/driver/my/wallet' },
  { id: 4, label: '车辆管理', icon: 'car-fill', path: '/biz-pages/driver/my/vehicle' },
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
        { label: '待结算', value: `¥${wallet.pendingSettlement || 0}` },
        { label: '今日收入', value: `¥${wallet.todayIncome || 0}` },
        { label: '已提现', value: `¥${(wallet.totalIncome || 0).toLocaleString()}` },
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
  <view class="driver-home">
    <!-- 顶部导航栏 -->
    <view class="top-navbar">
      <view class="navbar-left" @tap="goToSwitchRole">
        <view class="role-tag">
          <TnIcon name="identity" />
          <text class="role-text">司机</text>
        </view>
      </view>
      <view class="navbar-right" @tap="goToMessage">
        <TnIcon name="sound" size="44" />
        <TnBadge :value="3" absolute />
      </view>
    </view>

    <!-- 页面内容 -->
    <view class="home-content">
      <!-- 个人信息卡片 -->
      <view class="user-card">
        <view class="user-info">
          <view class="avatar-box">
            <TnIcon name="people" size="50" color="#fff" />
          </view>
          <view class="user-detail">
            <text class="nickname">{{ userInfo.nickname }}</text>
            <text class="phone">{{ userInfo.phone }}</text>
            <view class="verify-tag" v-if="userInfo.verifyStatus === 2">
              <TnIcon name="verify" size="20" color="#fff" />
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
            <view class="quick-icon-box">
              <TnIcon :name="item.icon" size="48" />
            </view>
            <text class="quick-label">{{ item.label }}</text>
          </view>
        </view>
      </view>

      <!-- 进行中订单 -->
      <view class="order-section">
        <view class="section-title">
          <text class="title-text">进行中订单</text>
          <text class="title-more" @tap="navigateTo('/biz-pages/driver/order/list')">
            查看全部
            <TnIcon name="right" size="24" />
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
              <view class="point-icon-box start">
                <TnIcon name="start" size="24" />
              </view>
              <text class="point-text">{{ ongoingOrder.loadingAddress }}</text>
            </view>
            <view class="route-line"></view>
            <view class="route-point">
              <view class="point-icon-box end">
                <TnIcon name="location-fill" size="24" />
              </view>
              <text class="point-text">{{ ongoingOrder.unloadingAddress }}</text>
            </view>
          </view>
          <view class="order-footer">
            <text class="order-freight">运费: ¥{{ ongoingOrder.freight }}</text>
            <text class="action-text">查看详情</text>
            <TnIcon name="right" size="24" color="#007AFF" />
          </view>
        </view>
        <view class="order-empty" v-else>
          <TnEmpty mode="order" />
          <text class="empty-text">暂无进行中的订单</text>
          <view class="empty-btn" @tap="navigateTo('/biz-pages/driver/grab/index')">
            <TnButton theme="primary" size="sm">去抢单</TnButton>
          </view>
        </view>
      </view>

      <!-- 公告 -->
      <view class="notice-section">
        <view class="notice-card">
          <view class="notice-icon-box">
            <TnIcon name="sound" size="36" color="#007AFF" />
          </view>
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
  background: #f5f6f8;
}

.top-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  padding-top: 80rpx;
  background: linear-gradient(135deg, #007AFF, #00B4FF);
}

.navbar-left {
  .role-tag {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
    padding: 10rpx 24rpx;
    border-radius: 20rpx;
    font-size: 26rpx;
    font-weight: bold;

    .role-text {
      margin-left: 8rpx;
    }
  }
}

.navbar-right {
  position: relative;
  padding: 10rpx;
}

.home-content {
  padding: 30rpx;
}

// 用户卡片
.user-card {
  background: linear-gradient(135deg, #007AFF, #00B4FF);
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

        .verify-text {
          font-size: 20rpx;
          color: #fff;
          margin-left: 6rpx;
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
    display: flex;
    align-items: center;
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

    .quick-icon-box {
      width: 88rpx;
      height: 88rpx;
      background: linear-gradient(135deg, #007AFF, #00B4FF);
      border-radius: 24rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12rpx;
      color: #fff;
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

      .point-icon-box {
        width: 40rpx;
        height: 40rpx;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12rpx;

        &.start {
          background: #e6f0ff;
          color: #007AFF;
        }

        &.end {
          background: #e6fff0;
          color: #00B578;
        }
      }

      .point-text {
        font-size: 28rpx;
        color: #333;
        flex: 1;
        line-height: 40rpx;
      }
    }

    .route-line {
      width: 4rpx;
      height: 30rpx;
      background: #ddd;
      margin-left: 18rpx;
      margin-top: 8rpx;
      margin-bottom: 8rpx;
    }
  }

  .order-footer {
    display: flex;
    align-items: center;
    margin-top: 20rpx;

    .order-freight {
      font-size: 32rpx;
      color: #FF7A00;
      font-weight: bold;
    }

    .action-text {
      flex: 1;
      text-align: right;
      color: #007AFF;
      font-size: 28rpx;
    }
  }
}

.order-empty {
  background: #fff;
  border-radius: 24rpx;
  padding: 60rpx 30rpx;
  text-align: center;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

  .empty-text {
    font-size: 28rpx;
    color: #999;
    display: block;
    margin: 24rpx 0;
  }

  .empty-btn {
    display: inline-block;
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

  .notice-icon-box {
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