<script lang="ts" setup>
/**
 * 订单详情页面
 * 显示订单完整信息，支持状态操作
 */
import { ref, onMounted } from 'vue'
import CustomNavbar from '@/components/custom-navbar/index.vue'
import { getOrderDetailApi, updateOrderStatusApi, grabOrderApi } from '@/api/driver'
import { ORDER_STATUS, ORDER_STATUS_CONFIG } from '@/utils/const'

// 订单ID
const orderId = ref('')

// 订单类型（grab-抢单详情，普通-订单详情）
const orderType = ref('normal')

// 订单详情
const orderDetail = ref(null)

// 加载状态
const loading = ref(false)

// 步骤条状态
const steps = ref([
  { text: '待提货', status: 'wait' },
  { text: '已提货', status: 'wait' },
  { text: '运输中', status: 'wait' },
  { text: '已送达', status: 'wait' },
  { text: '已完成', status: 'wait' },
])

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const res = await getOrderDetailApi(orderId.value)
    if (res.code === 200) {
      orderDetail.value = res.data
      updateSteps(res.data.status)
    }
  } catch (e) {
    console.error('加载失败', e)
  } finally {
    loading.value = false
  }
}

// 更新步骤条状态
const updateSteps = (status) => {
  const statusIndex = {
    [ORDER_STATUS.GRABBED]: 0,
    [ORDER_STATUS.PICKED_UP]: 1,
    [ORDER_STATUS.IN_TRANSIT]: 2,
    [ORDER_STATUS.DELIVERED]: 3,
    [ORDER_STATUS.COMPLETED]: 4,
  }
  const currentIndex = statusIndex[status] || 0
  steps.value.forEach((step, index) => {
    if (index < currentIndex) {
      step.status = 'finish'
    } else if (index === currentIndex) {
      step.status = 'process'
    } else {
      step.status = 'wait'
    }
  })
}

// 状态操作映射
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

// 拨打电话
const makePhoneCall = (phone) => {
  if (!phone) return
  uni.makePhoneCall({
    phoneNumber: phone.replace('****', '0000'),
  })
}

// 复制文本
const copyText = (text) => {
  uni.setClipboardData({
    data: text,
    success: () => {
      uni.showToast({ title: '已复制', icon: 'success' })
    },
  })
}

// 地图导航
const openMap = (latitude, longitude, address) => {
  uni.openLocation({
    latitude,
    longitude,
    name: address,
    success: () => {},
  })
}

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options || {}
  orderId.value = options.id || '1'
  orderType.value = options.type || 'normal'
  loadData()
})
</script>

<template>
  <view class="order-detail-page">
    <!-- 自定义导航栏 -->
    <CustomNavbar title="订单详情" />

    <!-- 页面内容 -->
    <view class="detail-content" v-if="orderDetail">
      <!-- 状态步骤条 -->
      <view class="steps-section">
        <view class="steps-card">
          <view
            v-for="(step, index) in steps"
            :key="index"
            class="step-item"
            :class="step.status"
          >
            <view class="step-dot">
              <text v-if="step.status === 'finish'">✓</text>
              <text v-else-if="step.status === 'process'">{{ index + 1 }}</text>
              <text v-else>{{ index + 1 }}</text>
            </view>
            <text class="step-text">{{ step.text }}</text>
            <view class="step-line" v-if="index < steps.length - 1"></view>
          </view>
        </view>
      </view>

      <!-- 当前状态卡片 -->
      <view class="status-card">
        <view class="status-info">
          <text class="status-label">当前状态</text>
          <text
            class="status-value"
            :style="{ color: ORDER_STATUS_CONFIG[orderDetail.status]?.color }"
          >
            {{ ORDER_STATUS_CONFIG[orderDetail.status]?.text }}
          </text>
        </view>
        <view class="status-hint" v-if="orderDetail.status === ORDER_STATUS.GRABBED">
          请前往装货点确认到达
        </view>
      </view>

      <!-- 货物信息 -->
      <view class="info-section">
        <view class="section-title">
          <text class="title-text">货物信息</text>
        </view>
        <view class="info-card">
          <view class="info-row">
            <text class="info-label">货物类型</text>
            <text class="info-value">{{ orderDetail.goods.type }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">重量</text>
            <text class="info-value">{{ orderDetail.goods.weight }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">体积</text>
            <text class="info-value">{{ orderDetail.goods.volume }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">数量</text>
            <text class="info-value">{{ orderDetail.goods.count }}件</text>
          </view>
          <view class="info-row" v-if="orderDetail.goods.remark">
            <text class="info-label">备注</text>
            <text class="info-value remark">{{ orderDetail.goods.remark }}</text>
          </view>
        </view>
      </view>

      <!-- 装货信息 -->
      <view class="info-section">
        <view class="section-title">
          <text class="title-text">装货信息</text>
        </view>
        <view class="info-card">
          <view class="info-row address-row">
            <text class="info-label">装货地址</text>
            <view class="address-info">
              <text class="address-text">{{ orderDetail.loading.address }}</text>
              <view class="address-actions">
                <text class="action-icon" @tap="openMap(orderDetail.loading.latitude, orderDetail.loading.longitude, orderDetail.loading.address)">
                  📍
                </text>
                <text class="action-icon" @tap="makePhoneCall(orderDetail.loading.contactPhone)">
                  📞
                </text>
              </view>
            </view>
          </view>
          <view class="info-row">
            <text class="info-label">联系人</text>
            <text class="info-value">{{ orderDetail.loading.contactName }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">联系电话</text>
            <text class="info-value link" @tap="makePhoneCall(orderDetail.loading.contactPhone)">
              {{ orderDetail.loading.contactPhone }}
            </text>
          </view>
          <view class="info-row">
            <text class="info-label">装货时间</text>
            <text class="info-value">{{ orderDetail.loading.scheduledTime }}</text>
          </view>
        </view>
      </view>

      <!-- 卸货信息 -->
      <view class="info-section">
        <view class="section-title">
          <text class="title-text">卸货信息</text>
        </view>
        <view class="info-card">
          <view class="info-row address-row">
            <text class="info-label">卸货地址</text>
            <view class="address-info">
              <text class="address-text">{{ orderDetail.unloading.address }}</text>
              <view class="address-actions">
                <text class="action-icon" @tap="openMap(orderDetail.unloading.latitude, orderDetail.unloading.longitude, orderDetail.unloading.address)">
                  📍
                </text>
                <text class="action-icon" @tap="makePhoneCall(orderDetail.unloading.contactPhone)">
                  📞
                </text>
              </view>
            </view>
          </view>
          <view class="info-row">
            <text class="info-label">联系人</text>
            <text class="info-value">{{ orderDetail.unloading.contactName }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">联系电话</text>
            <text class="info-value link" @tap="makePhoneCall(orderDetail.unloading.contactPhone)">
              {{ orderDetail.unloading.contactPhone }}
            </text>
          </view>
        </view>
      </view>

      <!-- 费用信息 -->
      <view class="info-section">
        <view class="section-title">
          <text class="title-text">费用信息</text>
        </view>
        <view class="info-card">
          <view class="info-row">
            <text class="info-label">运费</text>
            <text class="info-value primary">¥{{ orderDetail.fee.freight }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">平台服务费</text>
            <text class="info-value danger">-¥{{ orderDetail.fee.serviceFee }}</text>
          </view>
          <view class="info-divider"></view>
          <view class="info-row total">
            <text class="info-label">实际收入</text>
            <text class="info-value highlight">¥{{ orderDetail.fee.actualIncome }}</text>
          </view>
        </view>
      </view>

      <!-- 货主信息 -->
      <view class="info-section">
        <view class="section-title">
          <text class="title-text">货主信息</text>
        </view>
        <view class="info-card">
          <view class="info-row">
            <text class="info-label">货主姓名</text>
            <text class="info-value">{{ orderDetail.shipper.name }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">联系电话</text>
            <text class="info-value link" @tap="makePhoneCall(orderDetail.shipper.phone)">
              {{ orderDetail.shipper.phone }}
            </text>
          </view>
          <view class="info-row">
            <text class="info-label">货主评分</text>
            <text class="info-value">⭐ {{ orderDetail.shipper.rating }}</text>
          </view>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="action-section" v-if="getStatusAction(orderDetail.status)">
        <view
          class="primary-btn"
          @tap="handleStatusAction"
        >
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
.order-detail-page {
  min-height: 100vh;
  background: #f4f5f7;
}

.detail-content {
  padding: 180rpx 30rpx 0;
}

// 步骤条
.steps-section {
  margin-bottom: 30rpx;
}

.steps-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 40rpx 30rpx;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;

  .step-dot {
    width: 48rpx;
    height: 48rpx;
    border-radius: 50%;
    background: #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24rpx;
    color: #fff;
    margin-bottom: 12rpx;
  }

  .step-text {
    font-size: 22rpx;
    color: #999;
    text-align: center;
  }

  .step-line {
    position: absolute;
    top: 24rpx;
    left: calc(50% + 30rpx);
    width: calc(100% - 60rpx);
    height: 4rpx;
    background: #ddd;
  }

  &.finish {
    .step-dot {
      background: #00b578;
    }

    .step-text {
      color: #00b578;
    }

    .step-line {
      background: #00b578;
    }
  }

  &.process {
    .step-dot {
      background: #007aff;
    }

    .step-text {
      color: #007aff;
      font-weight: bold;
    }
  }
}

// 状态卡片
.status-card {
  background: linear-gradient(135deg, #007aff, #00b4ff);
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;

  .status-info {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .status-label {
      font-size: 28rpx;
      color: rgba(255, 255, 255, 0.85);
    }

    .status-value {
      font-size: 36rpx;
      font-weight: bold;
    }
  }

  .status-hint {
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.85);
    margin-top: 12rpx;
  }
}

// 信息区块
.info-section {
  margin-bottom: 30rpx;
}

.section-title {
  margin-bottom: 16rpx;

  .title-text {
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

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  .info-label {
    font-size: 28rpx;
    color: #999;
    flex-shrink: 0;
  }

  .info-value {
    font-size: 28rpx;
    color: #333;
    text-align: right;

    &.primary {
      color: #ff7a00;
      font-weight: bold;
    }

    &.danger {
      color: #ff4c4c;
    }

    &.highlight {
      color: #00b578;
      font-size: 36rpx;
      font-weight: bold;
    }

    &.link {
      color: #007aff;
    }

    &.remark {
      flex: 1;
      margin-left: 20rpx;
    }
  }

  &.total {
    padding-top: 20rpx;
  }
}

.info-divider {
  height: 1rpx;
  background: #f0f0f0;
  margin: 10rpx 0;
}

.address-row {
  flex-direction: column;

  .address-info {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-top: 8rpx;

    .address-text {
      flex: 1;
      font-size: 28rpx;
      color: #333;
    }

    .address-actions {
      display: flex;
      gap: 20rpx;

      .action-icon {
        font-size: 36rpx;
        padding: 8rpx;
      }
    }
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
