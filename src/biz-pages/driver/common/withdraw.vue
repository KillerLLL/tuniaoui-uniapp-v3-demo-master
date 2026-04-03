<script lang="ts" setup>
/**
 * 提现页面
 */
import { ref } from 'vue'
import CustomNavbar from '@/components/custom-navbar/index.vue'
import { withdrawApi, getWalletInfoApi } from '@/api/driver'

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
  const amount = parseFloat(withdrawAmount.value)
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
  <view class="withdraw-page">
    <!-- 自定义导航栏 -->
    <CustomNavbar title="提现" />

    <!-- 页面内容 -->
    <view class="withdraw-content">
      <!-- 可提现金额 -->
      <view class="available-card">
        <text class="available-label">可提现金额(元)</text>
        <text class="available-value">¥{{ availableAmount.toFixed(2) }}</text>
      </view>

      <!-- 提现金额 -->
      <view class="amount-section">
        <view class="section-title">提现金额</view>
        <view class="amount-input-wrap">
          <text class="currency-symbol">¥</text>
          <input
            v-model="withdrawAmount"
            class="amount-input"
            type="digit"
            placeholder="0.00"
            placeholder-class="input-placeholder"
          />
        </view>
        <view class="quick-actions">
          <view
            v-for="amount in quickAmounts"
            :key="amount"
            class="quick-btn"
            @tap="selectAmount(amount)"
          >
            <text>¥{{ amount }}</text>
          </view>
          <view class="quick-btn all" @tap="withdrawAll">
            <text>全部</text>
          </view>
        </view>
      </view>

      <!-- 银行卡 -->
      <view class="bank-section">
        <view class="bank-card">
          <text class="bank-icon">🏦</text>
          <view class="bank-info">
            <text class="bank-name">中国工商银行</text>
            <text class="bank-no">**** **** **** 4567</text>
          </view>
          <text class="bank-arrow">→</text>
        </view>
      </view>

      <!-- 提示 -->
      <view class="tips-section">
        <text class="tips-title">温馨提示</text>
        <text class="tips-text">• 提现申请提交后1-3个工作日到账</text>
        <text class="tips-text">• 每日提现次数限制为3次</text>
        <text class="tips-text">• 如有疑问请联系客服</text>
      </view>

      <!-- 提交按钮 -->
      <view class="submit-section">
        <view class="submit-btn" @tap="handleWithdraw">
          <text class="btn-text">确认提现</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.withdraw-page {
  min-height: 100vh;
  background: #f4f5f7;
}

.withdraw-content {
  padding: 180rpx 30rpx 30rpx;
}

.available-card {
  background: linear-gradient(135deg, #007aff, #00b4ff);
  border-radius: 24rpx;
  padding: 40rpx;
  text-align: center;
  margin-bottom: 30rpx;

  .available-label {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.85);
    display: block;
    margin-bottom: 16rpx;
  }

  .available-value {
    font-size: 56rpx;
    color: #fff;
    font-weight: bold;
  }
}

.amount-section {
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

  .section-title {
    font-size: 28rpx;
    color: #666;
    margin-bottom: 20rpx;
  }

  .amount-input-wrap {
    display: flex;
    align-items: center;
    border-bottom: 2rpx solid #f0f0f0;
    padding-bottom: 20rpx;
    margin-bottom: 20rpx;

    .currency-symbol {
      font-size: 48rpx;
      color: #333;
      font-weight: bold;
      margin-right: 10rpx;
    }

    .amount-input {
      flex: 1;
      font-size: 48rpx;
      color: #333;
    }

    .input-placeholder {
      color: #ccc;
      font-size: 36rpx;
    }
  }

  .quick-actions {
    display: flex;
    gap: 16rpx;

    .quick-btn {
      padding: 12rpx 24rpx;
      background: #f0f0f0;
      border-radius: 20rpx;

      text {
        font-size: 26rpx;
        color: #666;
      }

      &.all {
        background: #e6f0ff;

        text {
          color: #007aff;
        }
      }
    }
  }
}

.bank-section {
  margin-bottom: 30rpx;
}

.bank-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

  .bank-icon {
    font-size: 48rpx;
    margin-right: 20rpx;
  }

  .bank-info {
    flex: 1;

    .bank-name {
      font-size: 30rpx;
      color: #333;
      font-weight: bold;
      display: block;
      margin-bottom: 8rpx;
    }

    .bank-no {
      font-size: 26rpx;
      color: #999;
    }
  }

  .bank-arrow {
    font-size: 28rpx;
    color: #ccc;
  }
}

.tips-section {
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

  .tips-title {
    font-size: 28rpx;
    color: #333;
    font-weight: bold;
    display: block;
    margin-bottom: 16rpx;
  }

  .tips-text {
    font-size: 26rpx;
    color: #999;
    display: block;
    margin-bottom: 10rpx;
  }
}

.submit-section {
  .submit-btn {
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
}
</style>
