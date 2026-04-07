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
  <view class="order-detail-page min-h-screen bg-zinc-100">
    <!-- 自定义导航栏 -->
    <CustomNavbar title="订单详情" />

    <!-- 页面内容 -->
    <view v-if="orderDetail" class="detail-content pt-180rpx pb-150rpx">
      <!-- 状态步骤条 - 玻璃态卡片 -->
      <view class="steps-section px-30rpx mb-30rpx">
        <view class="steps-card glass-card p-40rpx flex-between">
          <view
            v-for="(step, index) in steps"
            :key="index"
            class="step-item flex-1 flex-col-center relative"
            :class="step.status"
          >
            <view
              class="step-dot w-48rpx h-48rpx rounded-full flex-center mb-12rpx text-white text-24rpx"
              :class="{
                'bg-success': step.status === 'finish',
                'bg-primary': step.status === 'process',
                'bg-zinc-300': step.status === 'wait',
              }"
            >
              <TnIcon v-if="step.status === 'finish'" name="check" size="20" />
              <text v-else>{{ index + 1 }}</text>
            </view>
            <text
              class="text-22rpx text-center"
              :class="{
                'text-success': step.status === 'finish',
                'text-primary font-bold': step.status === 'process',
                'text-zinc-400': step.status === 'wait',
              }"
            >{{ step.text }}</text>
            <!-- 连接线 -->
            <view
              v-if="index < steps.length - 1"
              class="step-line absolute top-24rpx w-full h-4rpx -translate-y-1/2"
              :class="step.status === 'finish' ? 'bg-success' : 'bg-zinc-300'"
              :style="{ left: 'calc(50% + 30rpx)', width: 'calc(100% - 60rpx)' }"
            />
          </view>
        </view>
      </view>

      <!-- 当前状态卡片 - 渐变背景 -->
      <view
        class="status-card mx-30rpx rounded-card p-30rpx mb-30rpx bg-gradient-to-r from-primary to-blue-400"
      >
        <view class="flex-between">
          <text class="text-28rpx text-white/85">当前状态</text>
          <text class="text-36rpx font-bold" :style="{ color: ORDER_STATUS_CONFIG[orderDetail.status]?.color }">
            {{ ORDER_STATUS_CONFIG[orderDetail.status]?.text }}
          </text>
        </view>
        <view
          v-if="orderDetail.status === ORDER_STATUS.GRABBED"
          class="text-26rpx text-white/85 mt-12rpx"
        >
          请前往装货点确认到达
        </view>
      </view>

      <!-- 货物信息 -->
      <view class="info-section px-30rpx mb-30rpx">
        <TnTitle title="货物信息" mode="dot" assist-color="#3b82f6" size="lg" />
        <view class="info-card white-card mt-20rpx p-30rpx">
          <view class="flex gap-12rpx mb-20rpx">
            <TnTag type="primary" size="sm">{{ orderDetail.goods.type }}</TnTag>
            <TnTag type="warning" size="sm">{{ orderDetail.goods.weight }}</TnTag>
            <TnTag type="success" size="sm">{{ orderDetail.goods.volume }}</TnTag>
          </view>
          <view class="info-row py-16rpx border-b border-zinc-100">
            <text class="info-label text-28rpx text-zinc-500 flex-shrink-0">数量</text>
            <text class="info-value text-28rpx text-zinc-700">{{ orderDetail.goods.count }}件</text>
          </view>
          <view v-if="orderDetail.goods.remark" class="info-row py-16rpx">
            <text class="info-label text-28rpx text-zinc-500 flex-shrink-0">备注</text>
            <text class="info-value text-28rpx text-zinc-700 flex-1 ml-20rpx">{{ orderDetail.goods.remark }}</text>
          </view>
        </view>
      </view>

      <!-- 装货信息 -->
      <view class="info-section px-30rpx mb-30rpx">
        <TnTitle title="装货信息" mode="dot" assist-color="#3b82f6" size="lg" />
        <view class="info-card white-card mt-20rpx p-30rpx">
          <view class="info-row flex-col items-start py-16rpx border-b border-zinc-100">
            <text class="info-label text-28rpx text-zinc-500 mb-8rpx">装货地址</text>
            <view class="flex-between w-full">
              <text class="address-text text-28rpx text-zinc-700 flex-1">{{ orderDetail.loading.address }}</text>
              <view class="flex gap-20rpx">
                <view
                  class="action-icon-box w-56rpx h-56rpx rounded-full bg-primary/10 flex-center text-primary btn-press"
                  @tap="openMap(orderDetail.loading.latitude, orderDetail.loading.longitude, orderDetail.loading.address)"
                >
                  <TnIcon name="location-fill" size="32" />
                </view>
                <view
                  class="action-icon-box w-56rpx h-56rpx rounded-full bg-primary/10 flex-center text-primary btn-press"
                  @tap="makePhoneCall(orderDetail.loading.contactPhone)"
                >
                  <TnIcon name="phone" size="32" />
                </view>
              </view>
            </view>
          </view>
          <view class="info-row py-16rpx border-b border-zinc-100 flex-between">
            <text class="info-label text-28rpx text-zinc-500">联系人</text>
            <text class="info-value text-28rpx text-zinc-700">{{ orderDetail.loading.contactName }}</text>
          </view>
          <view class="info-row py-16rpx border-b border-zinc-100 flex-between">
            <text class="info-label text-28rpx text-zinc-500">联系电话</text>
            <text class="info-value text-28rpx text-primary" @tap="makePhoneCall(orderDetail.loading.contactPhone)">
              {{ orderDetail.loading.contactPhone }}
            </text>
          </view>
          <view class="info-row py-16rpx flex-between">
            <text class="info-label text-28rpx text-zinc-500">装货时间</text>
            <text class="info-value text-28rpx text-zinc-700">{{ orderDetail.loading.scheduledTime }}</text>
          </view>
        </view>
      </view>

      <!-- 卸货信息 -->
      <view class="info-section px-30rpx mb-30rpx">
        <TnTitle title="卸货信息" mode="dot" assist-color="#10b981" size="lg" />
        <view class="info-card white-card mt-20rpx p-30rpx">
          <view class="info-row flex-col items-start py-16rpx border-b border-zinc-100">
            <text class="info-label text-28rpx text-zinc-500 mb-8rpx">卸货地址</text>
            <view class="flex-between w-full">
              <text class="address-text text-28rpx text-zinc-700 flex-1">{{ orderDetail.unloading.address }}</text>
              <view class="flex gap-20rpx">
                <view
                  class="action-icon-box w-56rpx h-56rpx rounded-full bg-success/10 flex-center text-success btn-press"
                  @tap="openMap(orderDetail.unloading.latitude, orderDetail.unloading.longitude, orderDetail.unloading.address)"
                >
                  <TnIcon name="location-fill" size="32" />
                </view>
                <view
                  class="action-icon-box w-56rpx h-56rpx rounded-full bg-success/10 flex-center text-success btn-press"
                  @tap="makePhoneCall(orderDetail.unloading.contactPhone)"
                >
                  <TnIcon name="phone" size="32" />
                </view>
              </view>
            </view>
          </view>
          <view class="info-row py-16rpx border-b border-zinc-100 flex-between">
            <text class="info-label text-28rpx text-zinc-500">联系人</text>
            <text class="info-value text-28rpx text-zinc-700">{{ orderDetail.unloading.contactName }}</text>
          </view>
          <view class="info-row py-16rpx flex-between">
            <text class="info-label text-28rpx text-zinc-500">联系电话</text>
            <text class="info-value text-28rpx text-primary" @tap="makePhoneCall(orderDetail.unloading.contactPhone)">
              {{ orderDetail.unloading.contactPhone }}
            </text>
          </view>
        </view>
      </view>

      <!-- 费用信息 -->
      <view class="info-section px-30rpx mb-30rpx">
        <TnTitle title="费用信息" mode="dot" assist-color="#f97316" size="lg" />
        <view class="info-card white-card mt-20rpx p-30rpx">
          <view class="info-row py-12rpx flex-between">
            <text class="info-label text-28rpx text-zinc-500">运费</text>
            <text class="info-value text-28rpx text-orange font-bold">¥{{ orderDetail.fee.freight }}</text>
          </view>
          <view class="info-row py-12rpx flex-between">
            <text class="info-label text-28rpx text-zinc-500">平台服务费</text>
            <text class="info-value text-28rpx text-red-500">-¥{{ orderDetail.fee.serviceFee }}</text>
          </view>
          <view class="h-1rpx bg-zinc-200 my-10rpx" />
          <view class="info-row py-16rpx flex-between">
            <text class="info-label text-28rpx text-zinc-500">实际收入</text>
            <text class="info-value text-36rpx text-success font-bold">¥{{ orderDetail.fee.actualIncome }}</text>
          </view>
        </view>
      </view>

      <!-- 货主信息 -->
      <view class="info-section px-30rpx mb-30rpx">
        <TnTitle title="货主信息" mode="dot" assist-color="#71717a" size="lg" />
        <view class="info-card white-card mt-20rpx p-30rpx">
          <view class="info-row py-16rpx border-b border-zinc-100 flex-between">
            <text class="info-label text-28rpx text-zinc-500">货主姓名</text>
            <text class="info-value text-28rpx text-zinc-700">{{ orderDetail.shipper.name }}</text>
          </view>
          <view class="info-row py-16rpx border-b border-zinc-100 flex-between">
            <text class="info-label text-28rpx text-zinc-500">联系电话</text>
            <text class="info-value text-28rpx text-primary" @tap="makePhoneCall(orderDetail.shipper.phone)">
              {{ orderDetail.shipper.phone }}
            </text>
          </view>
          <view class="info-row py-16rpx flex-between">
            <text class="info-label text-28rpx text-zinc-500">货主评分</text>
            <view class="flex items-center">
              <TnIcon name="star" size="24" color="#ffb800" />
              <text class="text-28rpx text-zinc-700 ml-8rpx">{{ orderDetail.shipper.rating }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view v-if="getStatusAction(orderDetail.status)" class="action-section fixed bottom-0 left-0 right-0 bg-white px-30rpx py-30rpx shadow-soft">
        <TnButton
          type="primary"
          width="100%"
          height="96rpx"
          shape="round"
          shadow
          @click="handleStatusAction"
          class="btn-press"
        >
          {{ getStatusAction(orderDetail.status).text }}
        </TnButton>
      </view>
    </view>

    <!-- 加载中 -->
    <view v-else class="loading-state py-200rpx text-center">
      <text class="loading-text text-28rpx text-zinc-400">加载中...</text>
    </view>
  </view>
</template>

<!-- 无需额外样式，UnoCSS 原子化类名已覆盖所有样式 -->
