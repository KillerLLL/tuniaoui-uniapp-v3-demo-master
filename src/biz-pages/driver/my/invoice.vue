<script lang="ts" setup>
/**
 * 发票管理页面
 */
import { onMounted, ref } from 'vue'
import CustomNavbar from '@/components/custom-navbar/index.vue'
import { getInvoiceListApi } from '@/api/driver'

// 发票列表
const invoiceList = ref([])

// 加载数据
const loadData = async () => {
  try {
    const res = await getInvoiceListApi()
    if (res.code === 200) {
      invoiceList.value = res.data
    }
  } catch (e) {
    console.error('加载失败', e)
  }
}

// 状态文本
const getStatusText = (status) => {
  const texts = { 0: '待开票', 1: '开票中', 2: '已完成', 3: '已拒绝' }
  return texts[status] || '未知'
}

// 状态颜色
const getStatusColor = (status) => {
  const colors = { 0: '#ff7a00', 1: '#007aff', 2: '#00b578', 3: '#ff4c4c' }
  return colors[status] || '#999'
}

// 申请发票
const applyInvoice = () => {
  uni.navigateTo({ url: '/biz-pages/driver/common/invoice-apply' })
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <view class="min-h-screen bg-gray-100">
    <!-- 自定义导航栏 -->
    <CustomNavbar title="发票管理">
      <template #right>
        <view class="p-2">
          <TnButton type="primary" size="sm" plain @click="applyInvoice">
            申请
          </TnButton>
        </view>
      </template>
    </CustomNavbar>

    <!-- 页面内容 -->
    <view class="px-4 pb-8" style="padding-top: 180rpx">
      <view v-for="item in invoiceList" :key="item.id" class="card-press bg-white rounded-3xl p-6 mb-6 shadow-sm">
        <!-- 卡片头部 -->
        <view class="flex justify-between items-center pb-4 mb-4 border-b border-gray-100">
          <text class="text-gray-800 text-base font-bold">{{ item.title }}</text>
          <TnTag
            :type="item.status === 2 ? 'success' : item.status === 0 ? 'warning' : item.status === 1 ? 'primary' : 'danger'"
            size="sm"
          >
            {{ getStatusText(item.status) }}
          </TnTag>
        </view>
        <!-- 卡片内容 -->
        <view class="space-y-3">
          <view class="flex justify-between">
            <text class="text-gray-400 text-sm">税号</text>
            <text class="text-gray-800 text-sm">{{ item.taxNo }}</text>
          </view>
          <view class="flex justify-between">
            <text class="text-gray-400 text-sm">开票金额</text>
            <text class="text-orange-500 text-sm font-bold">¥{{ item.amount }}</text>
          </view>
          <view class="flex justify-between">
            <text class="text-gray-400 text-sm">申请时间</text>
            <text class="text-gray-800 text-sm">{{ item.createTime }}</text>
          </view>
          <view v-if="item.invoiceTime" class="flex justify-between">
            <text class="text-gray-400 text-sm">开票时间</text>
            <text class="text-gray-800 text-sm">{{ item.invoiceTime }}</text>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <TnEmpty v-if="invoiceList.length === 0" mode="order" show-tips>
        <template #tips>
          <text class="text-gray-400 text-lg block mb-6">暂无发票记录</text>
          <view class="inline-block">
            <TnButton type="primary" size="sm" shadow shape="round" @click="applyInvoice">
              申请开票
            </TnButton>
          </view>
        </template>
      </TnEmpty>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.card-press {
  transition: transform 0.15s ease;
}

.card-press:active {
  transform: scale(0.98);
}
</style>
