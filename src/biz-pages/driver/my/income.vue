<script lang="ts" setup>
/**
 * 我的收入页面
 */
import { onMounted, ref } from 'vue'
import CustomNavbar from '@/components/custom-navbar/index.vue'
import { getIncomeDetailApi, getIncomeOverviewApi } from '@/api/driver'

// 收入概览
const incomeOverview = ref({
  todayIncome: 0,
  totalIncome: 0,
  pendingSettlement: 0,
  balance: 0,
})

// 收入明细
const incomeDetail = ref([])

// 加载数据
const loadData = async () => {
  try {
    const [overviewRes, detailRes] = await Promise.all([
      getIncomeOverviewApi(),
      getIncomeDetailApi(),
    ])
    if (overviewRes.code === 200) {
      incomeOverview.value = overviewRes.data
    }
    if (detailRes.code === 200) {
      incomeDetail.value = detailRes.data
    }
  } catch (e) {
    console.error('加载失败', e)
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <view class="min-h-screen bg-gray-100">
    <!-- 自定义导航栏 -->
    <CustomNavbar title="我的收入" />

    <!-- 页面内容 -->
    <view class="px-4 pb-8" style="padding-top: 180rpx">
      <!-- 概览卡片 - 玻璃态 -->
      <view class="glass-card mb-6 p-8 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-400 shadow-lg shadow-blue-500/30">
        <view class="text-center mb-6">
          <text class="text-white/80 text-sm block mb-2">总收入</text>
          <text class="text-white text-3xl font-bold">¥{{ incomeOverview.totalIncome.toFixed(2) }}</text>
        </view>
        <view class="flex justify-around pt-6 border-t border-white/20">
          <view class="text-center">
            <text class="text-white/80 text-xs block mb-2">今日收入</text>
            <text class="text-white text-lg font-bold">¥{{ incomeOverview.todayIncome.toFixed(2) }}</text>
          </view>
          <view class="w-1 bg-white/20" />
          <view class="text-center">
            <text class="text-white/80 text-xs block mb-2">待结算</text>
            <text class="text-yellow-300 text-lg font-bold">¥{{ incomeOverview.pendingSettlement.toFixed(2) }}</text>
          </view>
        </view>
      </view>

      <!-- 收入明细 -->
      <view class="mb-6">
        <TnTitle title="收入明细" mode="dot" assist-color="#3b82f6" size="lg" />
        <view class="bg-white rounded-3xl overflow-hidden shadow-sm">
          <view v-for="item in incomeDetail" :key="item.id" class="detail-item flex justify-between items-center p-6 border-b border-gray-100 last:border-b-0">
            <view>
              <text class="text-gray-800 text-sm block mb-2">{{ item.date }}</text>
              <text class="text-gray-400 text-xs">订单号: {{ item.orderNo }}</text>
            </view>
            <text class="text-success text-lg font-bold">+¥{{ item.amount }}</text>
          </view>
          <TnEmpty v-if="incomeDetail.length === 0" mode="order" show-tips>
            <template #tips>
              <text class="text-gray-400 text-sm block mt-4">暂无收入记录</text>
            </template>
          </TnEmpty>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.glass-card {
  backdrop-filter: blur(20rpx);
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(59, 182, 255, 0.9));
}

.text-success {
  color: #10b981;
}
</style>
