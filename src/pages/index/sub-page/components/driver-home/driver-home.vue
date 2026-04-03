<script setup>
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import TnIcon from '@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue'
import TnBadge from '@tuniao/tnui-vue3-uniapp/components/badge/src/badge.vue'
import TnNoticeBar from '@tuniao/tnui-vue3-uniapp/components/notice-bar/src/notice-bar.vue'

import { getDriverInfoApi, getIncomeOverviewApi, getAnnouncementsApi } from '@/api/driver'
import { getOrderListApi } from '@/api/order'

// 司机信息
const driverInfo = ref({})
// 收入概览
const incomeData = ref({ pendingSettlement: 0, todayIncome: 0, totalWithdrawn: 0 })
// 进行中订单
const currentOrder = ref(null)
// 公告数据
const announcements = ref([])
// 消息未读数
const unreadCount = ref(3)

// 快捷导航
const quickNavList = [
  { icon: 'wallet', name: '钱包', color: '#007AFF', url: '/biz-pages/driver/wallet/index' },
  { icon: 'order', name: '全部订单', color: '#00B578', path: 'order', pageIndex: 2 },
  { icon: 'car', name: '车辆管理', color: '#FF7A00', url: '/biz-pages/driver/vehicle/index' },
  { icon: 'ticket', name: '发票', color: '#7B61FF', url: '/biz-pages/driver/invoice/index' },
  { icon: 'service', name: '客服', color: '#00B578', url: '/biz-pages/driver/customer-service/index' },
  { icon: 'coupon', name: '优惠券', color: '#FF4C4C', url: '/biz-pages/driver/coupon/index' },
]

// 跳转快捷导航
const onNavClick = (item) => {
  if (item.path) {
    // 跳转到Tab页
    uni.$emit('switchTab', item.pageIndex)
  } else if (item.url) {
    uni.navigateTo({ url: item.url })
  }
}

// 跳转订单详情
const goToOrderDetail = (order) => {
  uni.navigateTo({ url: `/biz-pages/driver/order-detail/index?id=${order.id}` })
}

// 跳转消息页
const goToMessage = () => {
  uni.navigateTo({ url: '/biz-pages/driver/message/index' })
}

// 格式化金额
const formatMoney = (val) => {
  if (!val && val !== 0) return '0.00'
  return val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 加载数据
const loadData = async () => {
  try {
    const [driverRes, incomeRes, announceRes] = await Promise.all([
      getDriverInfoApi(),
      getIncomeOverviewApi(),
      getAnnouncementsApi(),
    ])
    driverInfo.value = driverRes.data
    incomeData.value = incomeRes.data
    announcements.value = announceRes.data
  } catch (e) {
    console.error('加载首页数据失败', e)
  }

  // 获取进行中订单
  try {
    const orderRes = await getOrderListApi({ filterInProgress: true })
    if (orderRes.data.list.length > 0) {
      currentOrder.value = orderRes.data.list[0]
    }
  } catch (e) {
    console.error('加载订单数据失败', e)
  }
}

onMounted(() => {
  loadData()
})

onShow(() => {
  loadData()
})
</script>

// #ifdef MP-WEIXIN
<script>
export default {
  options: {
    virtualHost: true,
  },
}
</script>
// #endif

<template>
  <view class="driver-home">
    <!-- 顶部区域：渐变背景 -->
    <view class="header-area">
      <view class="header-content">
        <view class="user-info">
          <!-- 头像 -->
          <view class="avatar-box">
            <TnIcon name="my-fill" color="#fff" size="48" />
          </view>
          <!-- 用户信息 -->
          <view class="user-detail">
            <view class="name-row">
              <text class="nickname">{{ driverInfo.nickname || '司机用户' }}</text>
              <view v-if="driverInfo.verified" class="verified-tag">
                <TnIcon name="success" color="#fff" size="24" />
                <text class="verified-text">已认证</text>
              </view>
            </view>
            <text class="phone">{{ driverInfo.phone || '' }}</text>
          </view>
        </view>
        <!-- 消息铃铛 -->
        <view class="message-btn" @tap="goToMessage">
          <TnBadge :value="unreadCount" :max="99">
            <view class="bell-icon">
              <TnIcon name="notice" color="#fff" size="44" />
            </view>
          </TnBadge>
        </view>
      </view>
    </view>

    <!-- 收入概览卡片 -->
    <view class="income-card">
      <view class="income-item">
        <text class="income-amount">{{ formatMoney(incomeData.pendingSettlement) }}</text>
        <text class="income-label">待结算(元)</text>
      </view>
      <view class="income-divider" />
      <view class="income-item">
        <text class="income-amount highlight">{{ formatMoney(incomeData.todayIncome) }}</text>
        <text class="income-label">今日收入(元)</text>
      </view>
      <view class="income-divider" />
      <view class="income-item">
        <text class="income-amount">{{ formatMoney(incomeData.totalWithdrawn) }}</text>
        <text class="income-label">已提现(元)</text>
      </view>
    </view>

    <!-- 快捷入口 -->
    <view class="quick-nav">
      <view
        v-for="(item, index) in quickNavList"
        :key="index"
        class="nav-item"
        @tap="onNavClick(item)"
      >
        <view class="nav-icon" :style="{ backgroundColor: item.color }">
          <TnIcon :name="item.icon" color="#fff" size="44" />
        </view>
        <text class="nav-name">{{ item.name }}</text>
      </view>
    </view>

    <!-- 公告轮播 -->
    <view v-if="announcements.length" class="notice-area">
      <TnNoticeBar :data="announcements" left-icon="sound" right-icon="right" />
    </view>

    <!-- 进行中订单 -->
    <view v-if="currentOrder" class="current-order">
      <view class="section-title">
        <text class="title-text">进行中的订单</text>
        <view class="title-more" @tap="onNavClick(quickNavList[1])">
          <text class="more-text">全部订单</text>
          <TnIcon name="right" color="#999" size="28" />
        </view>
      </view>
      <view class="order-card" @tap="goToOrderDetail(currentOrder)">
        <view class="order-header">
          <text class="order-status">运输中</text>
          <text class="order-id">{{ currentOrder.id }}</text>
        </view>
        <view class="order-route">
          <view class="route-point">
            <view class="dot blue" />
            <text class="address">{{ currentOrder.pickupAddress }}</text>
          </view>
          <view class="route-arrow">
            <TnIcon name="arrow-down" color="#ccc" size="28" />
          </view>
          <view class="route-point">
            <view class="dot green" />
            <text class="address">{{ currentOrder.deliveryAddress }}</text>
          </view>
        </view>
        <view class="order-footer">
          <text class="cargo">{{ currentOrder.cargoType }} {{ currentOrder.cargoWeight }}</text>
          <text class="fee">¥{{ currentOrder.totalFee?.toFixed(2) }}</text>
        </view>
        <view class="order-action">
          <view class="action-btn">
            <text class="action-text">查看详情</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.driver-home {
  min-height: 100vh;
  background: #f4f5f7;
  padding-bottom: 200rpx;

  // 顶部区域
  .header-area {
    background: linear-gradient(135deg, #007AFF, #00B4FF);
    padding: 40rpx 30rpx 80rpx;

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .user-info {
      display: flex;
      align-items: center;

      .avatar-box {
        width: 96rpx;
        height: 96rpx;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.25);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .user-detail {
        margin-left: 24rpx;

        .name-row {
          display: flex;
          align-items: center;

          .nickname {
            font-size: 34rpx;
            font-weight: bold;
            color: #fff;
          }

          .verified-tag {
            display: flex;
            align-items: center;
            margin-left: 16rpx;
            padding: 4rpx 12rpx;
            background: rgba(255, 255, 255, 0.25);
            border-radius: 20rpx;

            .verified-text {
              font-size: 22rpx;
              color: #fff;
              margin-left: 4rpx;
            }
          }
        }

        .phone {
          font-size: 26rpx;
          color: rgba(255, 255, 255, 0.85);
          margin-top: 8rpx;
        }
      }
    }

    .message-btn {
      .bell-icon {
        width: 72rpx;
        height: 72rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  // 收入概览卡片
  .income-card {
    display: flex;
    align-items: center;
    margin: -40rpx 30rpx 0;
    padding: 36rpx 20rpx;
    background: #fff;
    border-radius: 24rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
    position: relative;
    z-index: 2;

    .income-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;

      .income-amount {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;

        &.highlight {
          color: #007AFF;
        }
      }

      .income-label {
        font-size: 22rpx;
        color: #999;
        margin-top: 8rpx;
      }
    }

    .income-divider {
      width: 1rpx;
      height: 60rpx;
      background: #f0f0f0;
    }
  }

  // 快捷入口
  .quick-nav {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20rpx;
    padding: 30rpx;
    margin: 24rpx 30rpx 0;
    background: #fff;
    border-radius: 24rpx;

    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;

      .nav-icon {
        width: 88rpx;
        height: 88rpx;
        border-radius: 24rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 12rpx;
      }

      .nav-name {
        font-size: 24rpx;
        color: #333;
      }
    }
  }

  // 公告轮播
  .notice-area {
    margin: 24rpx 30rpx 0;
    border-radius: 16rpx;
    overflow: hidden;
  }

  // 进行中订单
  .current-order {
    margin: 24rpx 30rpx 0;

    .section-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20rpx;

      .title-text {
        font-size: 30rpx;
        font-weight: bold;
        color: #333;
      }

      .title-more {
        display: flex;
        align-items: center;

        .more-text {
          font-size: 24rpx;
          color: #999;
          margin-right: 4rpx;
        }
      }
    }

    .order-card {
      background: #fff;
      border-radius: 24rpx;
      padding: 30rpx;
      box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

      .order-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20rpx;

        .order-status {
          font-size: 26rpx;
          color: #007AFF;
          font-weight: bold;
          padding: 6rpx 16rpx;
          background: rgba(0, 122, 255, 0.1);
          border-radius: 8rpx;
        }

        .order-id {
          font-size: 24rpx;
          color: #999;
        }
      }

      .order-route {
        .route-point {
          display: flex;
          align-items: center;
          padding: 8rpx 0;

          .dot {
            width: 16rpx;
            height: 16rpx;
            border-radius: 50%;
            margin-right: 16rpx;

            &.blue {
              background: #007AFF;
            }

            &.green {
              background: #00B578;
            }
          }

          .address {
            font-size: 28rpx;
            color: #333;
          }
        }

        .route-arrow {
          margin-left: 4rpx;
          padding: 4rpx 0;
        }
      }

      .order-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 20rpx;
        padding-top: 20rpx;
        border-top: 1rpx solid #f0f0f0;

        .cargo {
          font-size: 26rpx;
          color: #666;
        }

        .fee {
          font-size: 32rpx;
          font-weight: bold;
          color: #FF7A00;
        }
      }

      .order-action {
        display: flex;
        justify-content: flex-end;
        margin-top: 20rpx;

        .action-btn {
          padding: 14rpx 36rpx;
          background: linear-gradient(135deg, #007AFF, #00B4FF);
          border-radius: 32rpx;

          .action-text {
            font-size: 26rpx;
            color: #fff;
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style>
