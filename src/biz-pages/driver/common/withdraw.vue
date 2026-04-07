<script lang="ts" setup>
/**
 * 提现页面
 */
import { ref } from 'vue'
import CustomNavbar from '@/components/custom-navbar/index.vue'
import { getWalletInfoApi, withdrawApi } from '@/api/driver'

// 提现金额
const withdrawAmount = ref('')

// 可提现金额
const availableAmount = ref(0)

// 加载数据
const loadData = async () => {
  try {
    const res = await getWalletInfoApi()
    if (res.code === 200) {
      availableAmount.value = res.data.balance
    }
  } catch (e) {
    console.error('加载失败', e)
  }
}

// 快速选择金额
const quickAmounts = ['100', '200', '500', '1000']

const selectAmount = (amount) => {
  withdrawAmount.value = amount
}

// 全部提现
const withdrawAll = () => {
  withdrawAmount.value = availableAmount.value.toString()
}

// 提交提现
const handleWithdraw = async () => {
  const amount = Number.parseFloat(withdrawAmount.value)
  if (!amount || amount <= 0) {
    uni.showToast({ title: '请输入提现金额', icon: 'none' })
    return
  }
  if (amount > availableAmount.value) {
    uni.showToast({ title: '超出可提现金额', icon: 'none' })
    return
  }
  try {
    uni.showLoading({ title: '处理中...' })
    const res = await withdrawApi(amount)
    uni.hideLoading()
    if (res.code === 200) {
      uni.showToast({ title: '提现申请成功', icon: 'success' })
      setTimeout(() => {
        uni.navigateBack()
      }, 1000)
    }
  } catch (e: any) {
    uni.hideLoading()
    uni.showToast({ title: e.message || '提现失败', icon: 'none' })
  }
}

loadData()
</script>

<template>
  <view class="withdraw-page min-h-screen bg-gray-100">
    <!-- 自定义导航栏 -->
    <CustomNavbar title="提现" />

    <!-- 页面内容 -->
    <view class="withdraw-content px-6 pt-45">
      <!-- 可提现金额卡片 -->
      <view class="available-card bg-gradient-to-br from-primary to-blue-400 rounded-2xl p-8 text-center mb-6">
        <text class="available-label text-sm text-white/80 block mb-2">可提现金额(元)</text>
        <text class="available-value text-3xl font-bold text-white">¥{{ availableAmount.toFixed(2) }}</text>
      </view>

      <!-- 提现金额输入区 -->
      <view class="amount-section glass-card rounded-2xl p-6 mb-6">
        <view class="section-title text-sm text-gray-500 mb-4">提现金额</view>
        <view class="amount-input-wrap flex items-center border-b border-gray-100 pb-4 mb-4">
          <text class="currency-symbol text-2xl font-bold text-gray-800 mr-2">¥</text>
          <input
            v-model="withdrawAmount"
            class="amount-input flex-1 text-2xl text-gray-800"
            type="digit"
            placeholder="0.00"
            placeholder-class="input-placeholder"
          />
        </view>
        <view class="quick-actions flex gap-3">
          <view
            v-for="amount in quickAmounts"
            :key="amount"
            class="quick-btn bg-gray-100 px-4 py-2 rounded-full btn-press"
            @tap="selectAmount(amount)"
          >
            <text class="text-sm text-gray-600">¥{{ amount }}</text>
          </view>
          <view class="quick-btn all bg-primary/10 px-4 py-2 rounded-full btn-press" @tap="withdrawAll">
            <text class="text-sm text-primary font-medium">全部</text>
          </view>
        </view>
      </view>

      <!-- 银行卡选择区 -->
      <view class="bank-section mb-6">
        <view class="bank-card glass-card rounded-2xl p-6 flex items-center card-press">
          <view class="bank-icon-box w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center mr-4">
            <TnIcon name="bank" size="20" color="#fff" />
          </view>
          <view class="bank-info flex-1">
            <text class="bank-name text-base font-bold text-gray-800 block mb-1">中国工商银行</text>
            <text class="bank-no text-sm text-gray-400">**** **** **** 4567</text>
          </view>
          <TnIcon name="right" size="14" color="#ccc" />
        </view>
      </view>

      <!-- 温馨提示 -->
      <view class="tips-section glass-card rounded-2xl p-6 mb-8">
        <text class="tips-title text-base font-bold text-gray-800 block mb-3">温馨提示</text>
        <text class="tips-text text-sm text-gray-400 block mb-2">• 提现申请提交后1-3个工作日到账</text>
        <text class="tips-text text-sm text-gray-400 block mb-2">• 每日提现次数限制为3次</text>
        <text class="tips-text text-sm text-gray-400 block">• 如有疑问请联系客服</text>
      </view>

      <!-- 提交按钮 -->
      <view class="submit-section">
        <view class="submit-btn bg-gradient-to-r from-primary to-blue-400 rounded-full py-3 text-center btn-press">
          <text class="btn-text text-base font-bold text-white">确认提现</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
/* 使用 UnoCSS 原子化类名 */

/* 玻璃态卡片效果 */
.glass-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20rpx);
  -webkit-backdrop-filter: blur(20rpx);
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

/* 按钮按压效果 */
.btn-press {
  transition: transform 0.15s ease, opacity 0.15s ease;

  &:active {
    transform: scale(0.96);
    opacity: 0.9;
  }
}

/* 卡片按压效果 */
.card-press {
  transition: transform 0.2s ease, opacity 0.2s ease;

  &:active {
    transform: scale(0.98);
    opacity: 0.9;
  }
}

/* 输入框占位符样式 */
.input-placeholder {
  color: #ccc;
  font-size: 36rpx;
}

/* 渐变背景阴影 */
.available-card {
  box-shadow: 0 8rpx 30rpx rgba(59, 130, 246, 0.3);
}

.bank-icon-box {
  box-shadow: 0 4rpx 12rpx rgba(59, 130, 246, 0.3);
}

/* 提交按钮渐变阴影 */
.submit-btn {
  box-shadow: 0 4rpx 20rpx rgba(59, 130, 246, 0.4);
}
</style>
