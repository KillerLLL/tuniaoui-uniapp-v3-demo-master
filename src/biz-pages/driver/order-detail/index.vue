<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import TnIcon from '@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue'
import TnButton from '@tuniao/tnui-vue3-uniapp/components/button/src/button.vue'
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'
import { ORDER_STATUS_MAP, ORDER_STATUS } from '@/utils/const'
import { getOrderDetailApi, updateOrderStatusApi } from '@/api/order'

// 微信小程序 virtualHost 配置
defineOptions({
  options: {
    virtualHost: true,
  },
})

const orderId = ref('')
const orderDetail = ref(null)
const loading = ref(true)

// 步骤条配置
const stepList = [
  { key: '待提货', icon: 'time' },
  { key: '已提货', icon: 'success' },
  { key: '运输中', icon: 'transport' },
  { key: '已送达', icon: 'map' },
  { key: '已完成', icon: 'success' },
]

// 当前步骤索引（对应订单 status）
const currentStep = computed(() => {
  if (!orderDetail.value) return 0
  return orderDetail.value.status
})

// 状态头部配置
const statusConfig = computed(() => {
  if (!orderDetail.value) return {}
  return ORDER_STATUS_MAP[orderDetail.value.status] || {}
})

// 底部按钮配置：根据状态显示不同按钮
const actionButtons = computed(() => {
  if (!orderDetail.value) return []
  const status = orderDetail.value.status
  const buttons = []
  if (status === ORDER_STATUS.PENDING) {
    buttons.push({ text: '确认提货', status: ORDER_STATUS.PICKED_UP, type: 'primary' })
  } else if (status === ORDER_STATUS.TRANSIT) {
    buttons.push({ text: '确认送达', status: ORDER_STATUS.DELIVERED, type: 'primary' })
  } else if (status === ORDER_STATUS.DELIVERED) {
    buttons.push({ text: '确认完成', status: ORDER_STATUS.COMPLETED, type: 'primary' })
  }
  return buttons
})

// 获取步骤样式
const getStepClass = (index) => {
  if (index < currentStep.value) return 'step-done'
  if (index === currentStep.value) return 'step-active'
  return 'step-pending'
}

// 获取连接线样式
const getLineClass = (index) => {
  if (index < currentStep.value) return 'line-done'
  return 'line-pending'
}

// 页面加载时获取订单ID
onLoad((options) => {
  orderId.value = options.id
  fetchOrderDetail()
})

// 获取订单详情
const fetchOrderDetail = async () => {
  if (!orderId.value) return
  loading.value = true
  try {
    const res = await getOrderDetailApi(orderId.value)
    orderDetail.value = res.data
  } catch (e) {
    uni.showToast({ title: '获取订单详情失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 更新订单状态
const handleAction = async (btn) => {
  uni.showModal({
    title: '提示',
    content: `确认${btn.text}？`,
    success: async (res) => {
      if (res.confirm) {
        try {
          await updateOrderStatusApi(orderId.value, btn.status)
          uni.showToast({ title: `${btn.text}成功`, icon: 'success' })
          // 刷新详情
          fetchOrderDetail()
        } catch (e) {
          uni.showToast({ title: '操作失败，请重试', icon: 'none' })
        }
      }
    },
  })
}
</script>

<template>
  <view class="order-detail-page">
    <!-- 自定义导航栏 -->
    <CustomNavbar title="订单详情" />

    <!-- 导航栏占位 -->
    <view class="navbar-placeholder" />

    <!-- 加载中 -->
    <view v-if="loading" class="loading-wrap">
      <TnIcon name="loading" size="60" color="#007AFF" />
      <text class="loading-text">加载中...</text>
    </view>

    <template v-if="!loading && orderDetail">
      <!-- 状态头部卡片 -->
      <view class="status-header" :style="{ background: statusConfig.color || '#007AFF' }">
        <text class="status-text">{{ statusConfig.label || '未知状态' }}</text>
        <text class="order-no">订单号：{{ orderDetail.id }}</text>
        <text class="order-time">{{ orderDetail.createTime }}</text>
      </view>

      <!-- 步骤条 -->
      <view class="step-bar">
        <view
          v-for="(step, index) in stepList"
          :key="index"
          class="step-item"
        >
          <!-- 连接线（第一个步骤不显示） -->
          <view
            v-if="index > 0"
            class="step-line"
            :class="getLineClass(index)"
          />
          <!-- 圆形节点 -->
          <view class="step-node" :class="getStepClass(index)">
            <TnIcon
              :name="index <= currentStep ? 'success' : 'time'"
              size="24"
              :color="index <= currentStep ? '#fff' : '#ccc'"
            />
          </view>
          <!-- 步骤标题 -->
          <text class="step-title" :class="getStepClass(index)">
            {{ step.key }}
          </text>
        </view>
      </view>

      <!-- 路线信息卡片 -->
      <view class="card route-card">
        <view class="route-item">
          <view class="route-dot dot-start" />
          <view class="route-info">
            <text class="route-label">起点</text>
            <text class="route-address">{{ orderDetail.pickupAddress }}</text>
            <text class="route-contact">{{ orderDetail.pickupContact }}</text>
          </view>
        </view>
        <view class="route-line-wrap">
          <view class="route-line-inner" />
          <text class="route-distance">{{ orderDetail.distance }}</text>
        </view>
        <view class="route-item">
          <view class="route-dot dot-end" />
          <view class="route-info">
            <text class="route-label">终点</text>
            <text class="route-address">{{ orderDetail.deliveryAddress }}</text>
            <text class="route-contact">{{ orderDetail.deliveryContact }}</text>
          </view>
        </view>
      </view>

      <!-- 货物信息卡片 -->
      <view class="card">
        <view class="card-title">
          <TnIcon name="order" size="36" color="#007AFF" />
          <text class="card-title-text">货物信息</text>
        </view>
        <view class="info-row">
          <text class="info-label">货物类型</text>
          <text class="info-value">{{ orderDetail.cargoType }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">重量</text>
          <text class="info-value">{{ orderDetail.cargoWeight }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">体积</text>
          <text class="info-value">{{ orderDetail.cargoVolume }}</text>
        </view>
        <view v-if="orderDetail.cargoRemark" class="info-row">
          <text class="info-label">备注</text>
          <text class="info-value">{{ orderDetail.cargoRemark }}</text>
        </view>
      </view>

      <!-- 费用信息卡片 -->
      <view class="card">
        <view class="card-title">
          <TnIcon name="money" size="36" color="#FF7A00" />
          <text class="card-title-text">费用信息</text>
        </view>
        <view class="info-row">
          <text class="info-label">运费</text>
          <text class="info-value">¥{{ orderDetail.fee.toFixed(2) }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">附加费</text>
          <text class="info-value">¥{{ orderDetail.extraFee.toFixed(2) }}</text>
        </view>
        <view class="info-row total-row">
          <text class="info-label">合计</text>
          <text class="info-value total-value">¥{{ orderDetail.totalFee.toFixed(2) }}</text>
        </view>
      </view>

      <!-- 底部占位（为固定操作栏留空间） -->
      <view class="bottom-placeholder" />

      <!-- 底部固定操作栏 -->
      <view v-if="actionButtons.length" class="bottom-bar">
        <view class="bottom-bar-inner">
          <view
            v-for="(btn, idx) in actionButtons"
            :key="idx"
            class="action-btn"
            :class="btn.type === 'primary' ? 'btn-primary' : 'btn-default'"
            @tap="handleAction(btn)"
          >
            <text class="action-btn-text">{{ btn.text }}</text>
          </view>
        </view>
      </view>
    </template>
  </view>
</template>

<style lang="scss" scoped>
.order-detail-page {
  min-height: 100vh;
  background: #f4f5f7;
  padding-bottom: env(safe-area-inset-bottom);
}

.navbar-placeholder {
  padding-top: calc(var(--status-bar-height) + 88rpx + 30rpx);
}

// 加载状态
.loading-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 200rpx;

  .loading-text {
    margin-top: 20rpx;
    font-size: 28rpx;
    color: #999;
  }
}

// 状态头部卡片
.status-header {
  margin: 0 24rpx 24rpx;
  padding: 40rpx 30rpx;
  border-radius: 20rpx;
  display: flex;
  flex-direction: column;

  .status-text {
    font-size: 44rpx;
    font-weight: bold;
    color: #fff;
  }

  .order-no {
    margin-top: 16rpx;
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.9);
  }

  .order-time {
    margin-top: 8rpx;
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.75);
  }
}

// 步骤条
.step-bar {
  display: flex;
  align-items: flex-start;
  margin: 0 24rpx 24rpx;
  padding: 30rpx 20rpx;
  background: #fff;
  border-radius: 20rpx;

  .step-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }

  .step-node {
    width: 48rpx;
    height: 48rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 2;

    &.step-done {
      background: #00b578;
    }

    &.step-active {
      background: #007aff;
    }

    &.step-pending {
      background: #eee;
    }
  }

  // 连接线（绝对定位在节点之间）
  .step-line {
    position: absolute;
    top: 24rpx;
    left: -50%;
    right: 50%;
    height: 4rpx;
    z-index: 1;

    &.line-done {
      background: #00b578;
    }

    &.line-pending {
      background: #eee;
    }
  }

  .step-title {
    margin-top: 12rpx;
    font-size: 22rpx;

    &.step-done {
      color: #00b578;
    }

    &.step-active {
      color: #007aff;
      font-weight: bold;
    }

    &.step-pending {
      color: #ccc;
    }
  }
}

// 通用卡片样式
.card {
  margin: 0 24rpx 24rpx;
  padding: 30rpx;
  background: #fff;
  border-radius: 20rpx;
}

// 路线信息卡片
.route-card {
  .route-item {
    display: flex;
    align-items: flex-start;
  }

  .route-dot {
    width: 24rpx;
    height: 24rpx;
    border-radius: 50%;
    margin-top: 8rpx;
    margin-right: 20rpx;
    flex-shrink: 0;

    &.dot-start {
      background: #007aff;
    }

    &.dot-end {
      background: #00b578;
    }
  }

  .route-info {
    flex: 1;
    display: flex;
    flex-direction: column;

    .route-label {
      font-size: 24rpx;
      color: #999;
    }

    .route-address {
      margin-top: 8rpx;
      font-size: 30rpx;
      color: #333;
      font-weight: 500;
    }

    .route-contact {
      margin-top: 8rpx;
      font-size: 26rpx;
      color: #666;
    }
  }

  .route-line-wrap {
    display: flex;
    align-items: center;
    margin: 20rpx 0 20rpx 10rpx;
    padding-left: 2rpx;

    .route-line-inner {
      width: 2rpx;
      height: 40rpx;
      background: #ddd;
    }

    .route-distance {
      margin-left: 20rpx;
      font-size: 24rpx;
      color: #007aff;
    }
  }
}

// 卡片标题
.card-title {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;

  .card-title-text {
    margin-left: 12rpx;
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
  }
}

// 信息行
.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  .info-label {
    font-size: 28rpx;
    color: #999;
  }

  .info-value {
    font-size: 28rpx;
    color: #333;
  }

  &.total-row {
    .total-value {
      font-size: 34rpx;
      font-weight: bold;
      color: #ff7a00;
    }
  }
}

// 底部占位
.bottom-placeholder {
  height: 140rpx;
}

// 底部固定操作栏
.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background: #fff;
  box-shadow: 0 -2rpx 20rpx rgba(0, 0, 0, 0.06);
  padding-bottom: env(safe-area-inset-bottom);

  .bottom-bar-inner {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 16rpx 30rpx;
  }

  .action-btn {
    min-width: 240rpx;
    height: 80rpx;
    border-radius: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 20rpx;

    &.btn-primary {
      background: linear-gradient(135deg, #007aff, #00b4ff);

      .action-btn-text {
        color: #fff;
      }
    }

    &.btn-default {
      background: #f5f5f5;

      .action-btn-text {
        color: #666;
      }
    }

    .action-btn-text {
      font-size: 30rpx;
      font-weight: 500;
    }
  }
}
</style>
