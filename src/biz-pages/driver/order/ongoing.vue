<script lang="ts" setup>
/**
 * 进行中订单页面
 * 司机当前正在执行的订单
 */
import { ref, onMounted } from 'vue'
import CustomNavbar from '@/components/custom-navbar/index.vue'
import { getOrderDetailApi, updateOrderStatusApi } from '@/api/driver'
import { ORDER_STATUS, ORDER_STATUS_CONFIG } from '@/utils/const'

// 订单ID
const orderId = ref('')

// 订单详情
const orderDetail = ref(null)

// 加载状态
const loading = ref(false)

// 获取状态操作
const getStatusAction = (status) => {
  const actions = {
    [ORDER_STATUS.GRABBED]: { text: '确认到达装货点', nextStatus: ORDER_STATUS.PICKED_UP },
    [ORDER_STATUS.PICKED_UP]: { text: '确认装货出发', nextStatus: ORDER_STATUS.IN_TRANSIT },
    [ORDER_STATUS.IN_TRANSIT]: { text: '确认到达卸货点', nextStatus: ORDER_STATUS.DELIVERED },
    [ORDER_STATUS.DELIVERED]: { text: '确认收款完成', nextStatus: ORDER_STATUS.COMPLETED },
  }
  return actions[status] || null
}

// 状态操作
const handleStatusAction = async () => {
  const action = getStatusAction(orderDetail.value.status)
  if (!action) return

  uni.showModal({
    title: '确认操作',
    content: `确定"${action.text}"吗？`,
    success: async (res) => {
      if (res.confirm) {
        try {
          uni.showLoading({ title: '处理中...' })
          const result = await updateOrderStatusApi(orderId.value, action.nextStatus)
          uni.hideLoading()
          if (result.code === 200) {
            uni.showToast({ title: '操作成功', icon: 'success' })
            loadData()
          }
        } catch (e: any) {
          uni.hideLoading()
          uni.showToast({ title: e.message || '操作失败', icon: 'none' })
        }
      }
    },
  })
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const res = await getOrderDetailApi(orderId.value)
    if (res.code === 200) {
      orderDetail.value = res.data
    }
  } catch (e) {
    console.error('加载失败', e)
  } finally {
    loading.value = false
  }
}

// 拨打电话
const makePhoneCall = (phone) => {
  if (!phone) return
  uni.makePhoneCall({
    phoneNumber: phone.replace('****', '0000'),
  })
}

// 地图导航
const openMap = (latitude, longitude, address) => {
  uni.openLocation({
    latitude,
    longitude,
    name: address,
  })
}

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options || {}
  orderId.value = options.id || '1'
  loadData()
})
</script>

<template>
  <view class="ongoing-page">
    <!-- 自定义导航栏 -->
    <CustomNavbar title="进行中订单" />

    <!-- 页面内容 -->
    <view class="ongoing-content" v-if="orderDetail">
      <!-- 状态卡片 -->
      <view class="status-card">
        <view class="status-header">
          <view
            class="status-badge"
            :style="{ background: ORDER_STATUS_CONFIG[orderDetail.status]?.color }"
          >
            {{ ORDER_STATUS_CONFIG[orderDetail.status]?.text }}
          </view>
          <text class="order-no">{{ orderDetail.orderNo }}</text>
        </view>
        <view class="status-action" v-if="getStatusAction(orderDetail.status)">
          <text class="action-hint">{{
            orderDetail.status === ORDER_STATUS.GRABBED ? '请前往装货点' :
            orderDetail.status === ORDER_STATUS.PICKED_UP ? '货物已装好，准备出发' :
            orderDetail.status === ORDER_STATUS.IN_TRANSIT ? '运输中，请注意安全' :
            orderDetail.status === ORDER_STATUS.DELIVERED ? '已到达目的地，确认收款' : ''
          }}</text>
        </view>
      </view>

      <!-- 装货信息 -->
      <view class="info-section">
        <view class="section-header">
          <view class="section-dot start"></view>
          <text class="section-title">装货信息</text>
        </view>
        <view class="info-card">
          <view class="address-row" @tap="openMap(orderDetail.loading.latitude, orderDetail.loading.longitude, orderDetail.loading.address)">
            <text class="address-text">{{ orderDetail.loading.address }}</text>
            <text class="map-icon">📍</text>
          </view>
          <view class="contact-row">
            <text class="contact-name">{{ orderDetail.loading.contactName }}</text>
            <text class="contact-phone" @tap="makePhoneCall(orderDetail.loading.contactPhone)">
              {{ orderDetail.loading.contactPhone }}
            </text>
          </view>
          <view class="time-row">
            <text class="time-label">装货时间</text>
            <text class="time-value">{{ orderDetail.loading.scheduledTime }}</text>
          </view>
        </view>
      </view>

      <!-- 卸货信息 -->
      <view class="info-section">
        <view class="section-header">
          <view class="section-dot end"></view>
          <text class="section-title">卸货信息</text>
        </view>
        <view class="info-card">
          <view class="address-row" @tap="openMap(orderDetail.unloading.latitude, orderDetail.unloading.longitude, orderDetail.unloading.address)">
            <text class="address-text">{{ orderDetail.unloading.address }}</text>
            <text class="map-icon">📍</text>
          </view>
          <view class="contact-row">
            <text class="contact-name">{{ orderDetail.unloading.contactName }}</text>
            <text class="contact-phone" @tap="makePhoneCall(orderDetail.unloading.contactPhone)">
              {{ orderDetail.unloading.contactPhone }}
            </text>
          </view>
        </view>
      </view>

      <!-- 费用信息 -->
      <view class="info-section">
        <view class="section-header">
          <text class="section-title">费用信息</text>
        </view>
        <view class="info-card fee-card">
          <view class="fee-row">
            <text class="fee-label">运费</text>
            <text class="fee-value primary">¥{{ orderDetail.fee.freight }}</text>
          </view>
          <view class="fee-row">
            <text class="fee-label">服务费</text>
            <text class="fee-value danger">-¥{{ orderDetail.fee.serviceFee }}</text>
          </view>
          <view class="fee-divider"></view>
          <view class="fee-row total">
            <text class="fee-label">实际收入</text>
            <text class="fee-value highlight">¥{{ orderDetail.fee.actualIncome }}</text>
          </view>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="action-section" v-if="getStatusAction(orderDetail.status)">
        <view class="primary-btn" @tap="handleStatusAction">
          <text class="btn-text">{{ getStatusAction(orderDetail.status).text }}</text>
        </view>
      </view>

      <!-- 底部占位 -->
      <view class="bottom-space"></view>
    </view>

    <!-- 加载中 -->
    <view class="loading-state" v-else>
      <text class="loading-text">加载中...</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.ongoing-page {
  min-height: 100vh;
  background: #f4f5f7;
}

.ongoing-content {
  padding: 180rpx 30rpx 0;
}

// 状态卡片
.status-card {
  background: linear-gradient(135deg, #007aff, #00b4ff);
  border-radius: 24rpx;
  padding: 40rpx;
  margin-bottom: 30rpx;

  .status-header {
    display: flex;
    align-items: center;
    gap: 20rpx;

    .status-badge {
      padding: 10rpx 24rpx;
      border-radius: 30rpx;
      font-size: 26rpx;
      color: #fff;
      font-weight: bold;
    }

    .order-no {
      font-size: 26rpx;
      color: rgba(255, 255, 255, 0.85);
    }
  }

  .status-action {
    margin-top: 20rpx;

    .action-hint {
      font-size: 32rpx;
      color: #fff;
      font-weight: bold;
    }
  }
}

// 信息区块
.info-section {
  margin-bottom: 30rpx;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;

  .section-dot {
    width: 16rpx;
    height: 16rpx;
    border-radius: 50%;
    margin-right: 12rpx;

    &.start {
      background: #007aff;
    }

    &.end {
      background: #00b578;
    }
  }

  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
  }
}

.info-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.address-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;

  .address-text {
    flex: 1;
    font-size: 30rpx;
    color: #333;
    font-weight: bold;
  }

  .map-icon {
    font-size: 40rpx;
    margin-left: 16rpx;
  }
}

.contact-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;

  .contact-name {
    font-size: 28rpx;
    color: #333;
  }

  .contact-phone {
    font-size: 28rpx;
    color: #007aff;
  }
}

.time-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16rpx;

  .time-label {
    font-size: 28rpx;
    color: #999;
  }

  .time-value {
    font-size: 28rpx;
    color: #333;
  }
}

// 费用卡片
.fee-card {
  .fee-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12rpx 0;

    .fee-label {
      font-size: 28rpx;
      color: #666;
    }

    .fee-value {
      font-size: 28rpx;
      color: #333;

      &.primary {
        color: #ff7a00;
        font-weight: bold;
      }

      &.danger {
        color: #ff4c4c;
      }

      &.highlight {
        color: #00b578;
        font-size: 40rpx;
        font-weight: bold;
      }
    }

    &.total {
      padding-top: 16rpx;
    }
  }

  .fee-divider {
    height: 1rpx;
    background: #f0f0f0;
    margin: 10rpx 0;
  }
}

// 操作按钮
.action-section {
  padding: 30rpx;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.primary-btn {
  background: linear-gradient(135deg, #007aff, #00b4ff);
  border-radius: 48rpx;
  padding: 28rpx 0;
  text-align: center;

  .btn-text {
    color: #fff;
    font-size: 32rpx;
    font-weight: bold;
  }
}

.bottom-space {
  height: 150rpx;
}

// 加载状态
.loading-state {
  padding: 200rpx 0;
  text-align: center;

  .loading-text {
    font-size: 28rpx;
    color: #999;
  }
}
</style>
