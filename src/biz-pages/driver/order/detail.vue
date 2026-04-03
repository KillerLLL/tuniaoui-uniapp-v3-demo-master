<script lang="ts" setup>
/**
 * 订单详情页面
 * 显示订单完整信息，支持状态操作
 */
import { onMounted, ref } from 'vue'
import CustomNavbar from '@/components/custom-navbar/index.vue'
import {
  getOrderDetailApi,
  grabOrderApi,
  updateOrderStatusApi,
} from '@/api/driver'
import { ORDER_STATUS, ORDER_STATUS_CONFIG } from '@/utils/const'

// 订单ID
const orderId = ref('')

// 订单类型（grab-抢单详情，普通-订单详情）
const orderType = ref('normal')

// 订单详情
const orderDetail = ref<any>(null)

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
const updateSteps = (status: number) => {
  const statusIndex: Record<number, number> = {
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
const getStatusAction = (status: number) => {
  const actions: Record<number, { text: string; nextStatus: number }> = {
    [ORDER_STATUS.GRABBED]: {
      text: '确认到达装货点',
      nextStatus: ORDER_STATUS.PICKED_UP,
    },
    [ORDER_STATUS.PICKED_UP]: {
      text: '确认装货出发',
      nextStatus: ORDER_STATUS.IN_TRANSIT,
    },
    [ORDER_STATUS.IN_TRANSIT]: {
      text: '确认到达卸货点',
      nextStatus: ORDER_STATUS.DELIVERED,
    },
    [ORDER_STATUS.DELIVERED]: {
      text: '确认收款完成',
      nextStatus: ORDER_STATUS.COMPLETED,
    },
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
          const result = await updateOrderStatusApi(
            orderId.value,
            action.nextStatus
          )
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
const makePhoneCall = (phone: string) => {
  if (!phone) return
  uni.makePhoneCall({
    phoneNumber: phone.replace('****', '0000'),
  })
}

// 复制文本
const copyText = (text: string) => {
  uni.setClipboardData({
    data: text,
    success: () => {
      uni.showToast({ title: '已复制', icon: 'success' })
    },
  })
}

// 地图导航
const openMap = (latitude: number, longitude: number, address: string) => {
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
    <view v-if="orderDetail" class="detail-content">
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
              <TnIcon v-if="step.status === 'finish'" name="check" size="20" />
              <text v-else-if="step.status === 'process'">{{ index + 1 }}</text>
              <text v-else>{{ index + 1 }}</text>
            </view>
            <text class="step-text">{{ step.text }}</text>
            <view v-if="index < steps.length - 1" class="step-line" />
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
        <view
          v-if="orderDetail.status === ORDER_STATUS.GRABBED"
          class="status-hint"
        >
          请前往装货点确认到达
        </view>
      </view>

      <!-- 货物信息 -->
      <view class="info-section">
        <TnTitle title="货物信息" mode="dot" assist-color="#007AFF" size="lg" />
        <view class="info-card">
          <view class="goods-tags">
            <TnTag type="primary" size="sm">{{ orderDetail.goods.type }}</TnTag>
            <TnTag type="warning" size="sm">{{
              orderDetail.goods.weight
            }}</TnTag>
            <TnTag type="success" size="sm">{{
              orderDetail.goods.volume
            }}</TnTag>
          </view>
          <view class="info-row">
            <text class="info-label">数量</text>
            <text class="info-value">{{ orderDetail.goods.count }}件</text>
          </view>
          <view v-if="orderDetail.goods.remark" class="info-row">
            <text class="info-label">备注</text>
            <text class="info-value remark">{{
              orderDetail.goods.remark
            }}</text>
          </view>
        </view>
      </view>

      <!-- 装货信息 -->
      <view class="info-section">
        <TnTitle title="装货信息" mode="dot" assist-color="#007AFF" size="lg" />
        <view class="info-card">
          <view class="info-row address-row">
            <text class="info-label">装货地址</text>
            <view class="address-info">
              <text class="address-text">{{
                orderDetail.loading.address
              }}</text>
              <view class="address-actions">
                <view
                  class="action-icon-box"
                  @tap="
                    openMap(
                      orderDetail.loading.latitude,
                      orderDetail.loading.longitude,
                      orderDetail.loading.address
                    )
                  "
                >
                  <TnIcon name="location-fill" size="32" />
                </view>
                <view
                  class="action-icon-box"
                  @tap="makePhoneCall(orderDetail.loading.contactPhone)"
                >
                  <TnIcon name="phone" size="32" />
                </view>
              </view>
            </view>
          </view>
          <view class="info-row">
            <text class="info-label">联系人</text>
            <text class="info-value">{{
              orderDetail.loading.contactName
            }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">联系电话</text>
            <text
              class="info-value link"
              @tap="makePhoneCall(orderDetail.loading.contactPhone)"
            >
              {{ orderDetail.loading.contactPhone }}
            </text>
          </view>
          <view class="info-row">
            <text class="info-label">装货时间</text>
            <text class="info-value">{{
              orderDetail.loading.scheduledTime
            }}</text>
          </view>
        </view>
      </view>

      <!-- 卸货信息 -->
      <view class="info-section">
        <TnTitle title="卸货信息" mode="dot" assist-color="#00B578" size="lg" />
        <view class="info-card">
          <view class="info-row address-row">
            <text class="info-label">卸货地址</text>
            <view class="address-info">
              <text class="address-text">{{
                orderDetail.unloading.address
              }}</text>
              <view class="address-actions">
                <view
                  class="action-icon-box"
                  @tap="
                    openMap(
                      orderDetail.unloading.latitude,
                      orderDetail.unloading.longitude,
                      orderDetail.unloading.address
                    )
                  "
                >
                  <TnIcon name="location-fill" size="32" />
                </view>
                <view
                  class="action-icon-box"
                  @tap="makePhoneCall(orderDetail.unloading.contactPhone)"
                >
                  <TnIcon name="phone" size="32" />
                </view>
              </view>
            </view>
          </view>
          <view class="info-row">
            <text class="info-label">联系人</text>
            <text class="info-value">{{
              orderDetail.unloading.contactName
            }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">联系电话</text>
            <text
              class="info-value link"
              @tap="makePhoneCall(orderDetail.unloading.contactPhone)"
            >
              {{ orderDetail.unloading.contactPhone }}
            </text>
          </view>
        </view>
      </view>

      <!-- 费用信息 -->
      <view class="info-section">
        <TnTitle title="费用信息" mode="dot" assist-color="#FF7A00" size="lg" />
        <view class="info-card">
          <view class="info-row">
            <text class="info-label">运费</text>
            <text class="info-value primary"
              >¥{{ orderDetail.fee.freight }}</text
            >
          </view>
          <view class="info-row">
            <text class="info-label">平台服务费</text>
            <text class="info-value danger"
              >-¥{{ orderDetail.fee.serviceFee }}</text
            >
          </view>
          <view class="info-divider" />
          <view class="info-row total">
            <text class="info-label">实际收入</text>
            <text class="info-value highlight"
              >¥{{ orderDetail.fee.actualIncome }}</text
            >
          </view>
        </view>
      </view>

      <!-- 货主信息 -->
      <view class="info-section">
        <TnTitle title="货主信息" mode="dot" assist-color="#999999" size="lg" />
        <view class="info-card">
          <view class="info-row">
            <text class="info-label">货主姓名</text>
            <text class="info-value">{{ orderDetail.shipper.name }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">联系电话</text>
            <text
              class="info-value link"
              @tap="makePhoneCall(orderDetail.shipper.phone)"
            >
              {{ orderDetail.shipper.phone }}
            </text>
          </view>
          <view class="info-row">
            <text class="info-label">货主评分</text>
            <view class="info-value">
              <TnIcon name="star" size="24" color="#ffb800" />
              <text class="rating-text">{{ orderDetail.shipper.rating }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view v-if="getStatusAction(orderDetail.status)" class="action-section">
        <TnButton
          type="primary"
          width="100%"
          height="96rpx"
          shape="round"
          shadow
          @click="handleStatusAction"
        >
          {{ getStatusAction(orderDetail.status).text }}
        </TnButton>
      </view>

      <!-- 底部占位 -->
      <view class="bottom-space" />
    </view>

    <!-- 加载中 -->
    <view v-else class="loading-state">
      <text class="loading-text">加载中...</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.order-detail-page {
  min-height: 100vh;
  background: #f5f6f8;
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

.info-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-top: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.goods-tags {
  display: flex;
  gap: 12rpx;
  margin-bottom: 20rpx;
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

    .rating-text {
      margin-left: 8rpx;
      color: #333;
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

      .action-icon-box {
        width: 56rpx;
        height: 56rpx;
        background: #f0f7ff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #007aff;
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
