<script lang="ts" setup>
/**
 * 我的钱包页面
 */
import { onMounted, ref } from 'vue'
import CustomNavbar from '@/components/custom-navbar/index.vue'
import { getWalletInfoApi } from '@/api/driver'

// 钱包信息
const walletInfo = ref({
  balance: 0,
  todayIncome: 0,
  totalIncome: 0,
  pendingSettlement: 0,
})

// 加载数据
const loadData = async () => {
  try {
    const res = await getWalletInfoApi()
    if (res.code === 200) {
      walletInfo.value = res.data
    }
  } catch (e) {
    console.error('加载失败', e)
  }
}

// 跳转到我的收入
const goToIncome = () => {
  uni.navigateTo({ url: '/biz-pages/driver/my/income' })
}

// 跳转到提现
const goToWithdraw = () => {
  uni.navigateTo({ url: '/biz-pages/driver/common/withdraw' })
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <view class="min-h-screen bg-gray-100">
    <!-- 自定义导航栏 -->
    <CustomNavbar title="我的钱包" />

    <!-- 页面内容 -->
    <view class="px-4 pb-8" style="padding-top: 180rpx">
      <!-- 余额卡片 - 玻璃态 -->
      <view class="glass-card mb-6 p-10 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-400 shadow-lg shadow-blue-500/30">
        <text class="text-white/80 text-sm block mb-4">账户余额(元)</text>
        <text class="text-white text-4xl font-bold block mb-8">¥{{ walletInfo.balance.toFixed(2) }}</text>
        <view class="flex gap-4">
          <view class="btn-press flex-1">
            <TnButton type="primary" shadow shape="round" @click="goToWithdraw">
              提现
            </TnButton>
          </view>
        </view>
      </view>

      <!-- 收入统计 -->
      <view class="card-press bg-white rounded-3xl p-6 shadow-sm mb-6">
        <view class="flex">
          <view class="flex-1 text-center" @tap="goToIncome">
            <text class="text-gray-800 text-xl font-bold block mb-2">¥{{ walletInfo.todayIncome.toFixed(2) }}</text>
            <text class="text-gray-400 text-xs">今日收入</text>
          </view>
          <view class="w-1 bg-gray-100" />
          <view class="flex-1 text-center">
            <text class="text-gray-800 text-xl font-bold block mb-2">¥{{ walletInfo.totalIncome.toFixed(2) }}</text>
            <text class="text-gray-400 text-xs">累计收入</text>
          </view>
          <view class="w-1 bg-gray-100" />
          <view class="flex-1 text-center">
            <text class="text-primary text-xl font-bold block mb-2">¥{{ walletInfo.pendingSettlement.toFixed(2) }}</text>
            <text class="text-gray-400 text-xs">待结算</text>
          </view>
        </view>
      </view>

      <!-- 功能列表 -->
      <view class="bg-white rounded-3xl overflow-hidden shadow-sm">
        <view class="func-item btn-press" @tap="goToIncome">
          <view class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-400 rounded-2xl flex items-center justify-center mr-5">
            <TnIcon name="chart" size="36" color="#fff" />
          </view>
          <text class="flex-1 text-gray-800 text-base">我的收入</text>
          <TnIcon name="right" size="28" color="#ccc" />
        </view>
        <view class="func-item btn-press" @tap="goToWithdraw">
          <view class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-400 rounded-2xl flex items-center justify-center mr-5">
            <TnIcon name="money" size="36" color="#fff" />
          </view>
          <text class="flex-1 text-gray-800 text-base">提现记录</text>
          <TnIcon name="right" size="28" color="#ccc" />
        </view>
        <view class="func-item btn-press border-t border-gray-100">
          <view class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-400 rounded-2xl flex items-center justify-center mr-5">
            <TnIcon name="order" size="36" color="#fff" />
          </view>
          <text class="flex-1 text-gray-800 text-base">银行卡管理</text>
          <TnIcon name="right" size="28" color="#ccc" />
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

.card-press {
  transition: transform 0.15s ease;
}

.card-press:active {
  transform: scale(0.98);
}

.btn-press {
  transition: transform 0.15s ease;
}

.btn-press:active {
  transform: scale(0.95);
}

.func-item {
  display: flex;
  align-items: center;
  padding: 32rpx 30rpx;
}

.text-primary {
  color: #3b82f6;
}
</style>
