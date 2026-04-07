<script lang="ts" setup>
/**
 * 进行中订单页面
 * 司机当前正在执行的订单
 */
import { onMounted, ref } from 'vue'
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
  <view class="ongoing-page min-h-screen bg-zinc-100">
    <!-- 自定义导航栏 -->
    <CustomNavbar title="进行中订单" />

    <!-- 页面内容 -->
    <view v-if="orderDetail" class="ongoing-content pt-180rpx pb-150rpx">
      <!-- 状态卡片 - 渐变背景 -->
      <view
        class="status-card mx-30rpx rounded-card p-40rpx mb-30rpx bg-gradient-to-r from-primary to-blue-400"
      >
        <view class="flex items-center gap-20rpx mb-20rpx">
          <view
            class="status-badge px-24rpx py-10rpx rounded-full text-26rpx text-white font-bold"
            :style="{ background: ORDER_STATUS_CONFIG[orderDetail.status]?.color }"
          >
            {{ ORDER_STATUS_CONFIG[orderDetail.status]?.text }}
          </view>
          <text class="text-26rpx text-white/85">{{ orderDetail.orderNo }}</text>
        </view>
        <view v-if="getStatusAction(orderDetail.status)" class="action-hint text-32rpx text-white font-bold">
          {{
            orderDetail.status === ORDER_STATUS.GRABBED
              ? '请前往装货点'
              : orderDetail.status === ORDER_STATUS.PICKED_UP
              ? '货物已装好，准备出发'
              : orderDetail.status === ORDER_STATUS.IN_TRANSIT
              ? '运输中，请注意安全'
              : orderDetail.status === ORDER_STATUS.DELIVERED
              ? '已到达目的地，确认收款'
              : ''
          }}
        </view>
      </view>

      <!-- 装货信息 -->
      <view class="info-section px-30rpx mb-30rpx">
        <view class="flex items-center mb-16rpx">
          <view class="section-dot w-16rpx h-16rpx rounded-full bg-primary mr-12rpx" />
          <text class="section-title text-32rpx font-bold text-zinc-700">装货信息</text>
        </view>
        <view class="info-card white-card p-30rpx">
          <view
            class="address-row pb-20rpx border-b border-zinc-100 flex-between items-center"
            @tap="openMap(orderDetail.loading.latitude, orderDetail.loading.longitude, orderDetail.loading.address)"
          >
            <text class="address-text text-30rpx text-zinc-700 font-bold flex-1">{{ orderDetail.loading.address }}</text>
            <TnIcon name="location-fill" size="40" color="#3b82f6" class="ml-16rpx" />
          </view>
          <view class="contact-row py-20rpx border-b border-zinc-100 flex-between">
            <text class="contact-name text-28rpx text-zinc-700">{{ orderDetail.loading.contactName }}</text>
            <text class="contact-phone text-28rpx text-primary" @tap="makePhoneCall(orderDetail.loading.contactPhone)">
              {{ orderDetail.loading.contactPhone }}
            </text>
          </view>
          <view class="time-row pt-16rpx flex-between">
            <text class="time-label text-28rpx text-zinc-500">装货时间</text>
            <text class="time-value text-28rpx text-zinc-700">{{ orderDetail.loading.scheduledTime }}</text>
          </view>
        </view>
      </view>

      <!-- 卸货信息 -->
      <view class="info-section px-30rpx mb-30rpx">
        <view class="flex items-center mb-16rpx">
          <view class="section-dot w-16rpx h-16rpx rounded-full bg-success mr-12rpx" />
          <text class="section-title text-32rpx font-bold text-zinc-700">卸货信息</text>
        </view>
        <view class="info-card white-card p-30rpx">
          <view
            class="address-row pb-20rpx border-b border-zinc-100 flex-between items-center"
            @tap="openMap(orderDetail.unloading.latitude, orderDetail.unloading.longitude, orderDetail.unloading.address)"
          >
            <text class="address-text text-30rpx text-zinc-700 font-bold flex-1">{{ orderDetail.unloading.address }}</text>
            <TnIcon name="location-fill" size="40" color="#10b981" class="ml-16rpx" />
          </view>
          <view class="contact-row py-20rpx flex-between">
            <text class="contact-name text-28rpx text-zinc-700">{{ orderDetail.unloading.contactName }}</text>
            <text class="contact-phone text-28rpx text-primary" @tap="makePhoneCall(orderDetail.unloading.contactPhone)">
              {{ orderDetail.unloading.contactPhone }}
            </text>
          </view>
        </view>
      </view>

      <!-- 费用信息 -->
      <view class="info-section px-30rpx mb-30rpx">
        <text class="section-title text-32rpx font-bold text-zinc-700 mb-16rpx block">费用信息</text>
        <view class="info-card fee-card white-card p-30rpx">
          <view class="fee-row py-12rpx flex-between">
            <text class="fee-label text-28rpx text-zinc-500">运费</text>
            <text class="fee-value text-28rpx text-orange font-bold">¥{{ orderDetail.fee.freight }}</text>
          </view>
          <view class="fee-row py-12rpx flex-between">
            <text class="fee-label text-28rpx text-zinc-500">服务费</text>
            <text class="fee-value text-28rpx text-red-500">-¥{{ orderDetail.fee.serviceFee }}</text>
          </view>
          <view class="h-1rpx bg-zinc-200 my-10rpx" />
          <view class="fee-row py-16rpx flex-between">
            <text class="fee-label text-28rpx text-zinc-500">实际收入</text>
            <text class="fee-value text-40rpx text-success font-bold">¥{{ orderDetail.fee.actualIncome }}</text>
          </view>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view v-if="getStatusAction(orderDetail.status)" class="action-section fixed bottom-0 left-0 right-0 bg-white px-30rpx py-30rpx shadow-soft">
        <view
          class="primary-btn bg-gradient-to-r from-primary to-blue-400 rounded-full py-28rpx text-center btn-press"
          @tap="handleStatusAction"
        >
          <text class="btn-text text-32rpx text-white font-bold">
            {{ getStatusAction(orderDetail.status).text }}
          </text>
        </view>
      </view>

      <!-- 底部占位 -->
      <view class="bottom-space h-150rpx" />
    </view>

    <!-- 加载中 -->
    <view v-else class="loading-state py-200rpx text-center">
      <text class="loading-text text-28rpx text-zinc-400">加载中...</text>
    </view>
  </view>
</template>

<!-- 无需额外样式，UnoCSS 原子化类名已覆盖所有样式 -->
