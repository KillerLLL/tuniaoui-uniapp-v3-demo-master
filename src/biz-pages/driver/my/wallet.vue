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
  <view class="wallet-page">
    <!-- 自定义导航栏 -->
    <CustomNavbar title="我的钱包" />

    <!-- 页面内容 -->
    <view class="wallet-content">
      <!-- 余额卡片 -->
      <view class="balance-card">
        <text class="balance-label">账户余额(元)</text>
        <text class="balance-value">¥{{ walletInfo.balance.toFixed(2) }}</text>
        <view class="balance-actions">
          <TnButton type="primary" shadow shape="round" @click="goToWithdraw">
            提现
          </TnButton>
        </view>
      </view>

      <!-- 收入统计 -->
      <view class="income-stats">
        <view class="stat-item" @tap="goToIncome">
          <text class="stat-value"
            >¥{{ walletInfo.todayIncome.toFixed(2) }}</text
          >
          <text class="stat-label">今日收入</text>
        </view>
        <view class="stat-divider" />
        <view class="stat-item">
          <text class="stat-value"
            >¥{{ walletInfo.totalIncome.toFixed(2) }}</text
          >
          <text class="stat-label">累计收入</text>
        </view>
        <view class="stat-divider" />
        <view class="stat-item">
          <text class="stat-value primary"
            >¥{{ walletInfo.pendingSettlement.toFixed(2) }}</text
          >
          <text class="stat-label">待结算</text>
        </view>
      </view>

      <!-- 功能列表 -->
      <view class="func-list">
        <view class="func-item" @tap="goToIncome">
          <view class="func-icon-box">
            <TnIcon name="chart" size="36" color="#fff" />
          </view>
          <text class="func-label">我的收入</text>
          <TnIcon name="right" size="28" color="#ccc" />
        </view>
        <view class="func-item" @tap="goToWithdraw">
          <view class="func-icon-box">
            <TnIcon name="money" size="36" color="#fff" />
          </view>
          <text class="func-label">提现记录</text>
          <TnIcon name="right" size="28" color="#ccc" />
        </view>
        <view class="func-item">
          <view class="func-icon-box">
            <TnIcon name="order" size="36" color="#fff" />
          </view>
          <text class="func-label">银行卡管理</text>
          <TnIcon name="right" size="28" color="#ccc" />
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.wallet-page {
  min-height: 100vh;
  background: #f4f5f7;
}

.wallet-content {
  padding: 180rpx 30rpx 30rpx;
}

// 余额卡片
.balance-card {
  background: linear-gradient(135deg, #007aff, #00b4ff);
  border-radius: 24rpx;
  padding: 50rpx 40rpx;
  margin-bottom: 30rpx;

  .balance-label {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.85);
    display: block;
    margin-bottom: 16rpx;
  }

  .balance-value {
    font-size: 64rpx;
    color: #fff;
    font-weight: bold;
    display: block;
    margin-bottom: 30rpx;
  }

  .balance-actions {
    display: flex;
    gap: 20rpx;
  }
}

// 收入统计
.income-stats {
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  display: flex;
  justify-content: space-between;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

  .stat-item {
    flex: 1;
    text-align: center;

    .stat-value {
      font-size: 32rpx;
      color: #333;
      font-weight: bold;
      display: block;
      margin-bottom: 10rpx;

      &.primary {
        color: #ff7a00;
      }
    }

    .stat-label {
      font-size: 24rpx;
      color: #999;
    }
  }

  .stat-divider {
    width: 1rpx;
    background: #f0f0f0;
  }
}

// 功能列表
.func-list {
  background: #fff;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.func-item {
  display: flex;
  align-items: center;
  padding: 32rpx 30rpx;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  .func-icon-box {
    width: 64rpx;
    height: 64rpx;
    background: linear-gradient(135deg, #007aff, #00b4ff);
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20rpx;
  }

  .func-label {
    flex: 1;
    font-size: 30rpx;
    color: #333;
  }
}
</style>
