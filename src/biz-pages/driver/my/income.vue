<script lang="ts" setup>
/**
 * 我的收入页面
 */
import { ref, onMounted } from 'vue'
import CustomNavbar from '@/components/custom-navbar/index.vue'
import { getIncomeOverviewApi, getIncomeDetailApi } from '@/api/driver'

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
  <view class="income-page">
    <!-- 自定义导航栏 -->
    <CustomNavbar title="我的收入" />

    <!-- 页面内容 -->
    <view class="income-content">
      <!-- 概览卡片 -->
      <view class="overview-card">
        <view class="overview-header">
          <text class="header-title">总收入</text>
          <text class="header-value">¥{{ incomeOverview.totalIncome.toFixed(2) }}</text>
        </view>
        <view class="overview-stats">
          <view class="stat-item">
            <text class="stat-label">今日收入</text>
            <text class="stat-value">¥{{ incomeOverview.todayIncome.toFixed(2) }}</text>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-item">
            <text class="stat-label">待结算</text>
            <text class="stat-value primary">¥{{ incomeOverview.pendingSettlement.toFixed(2) }}</text>
          </view>
        </view>
      </view>

      <!-- 收入明细 -->
      <view class="detail-section">
        <view class="section-header">
          <text class="section-title">收入明细</text>
        </view>
        <view class="detail-list">
          <view
            v-for="item in incomeDetail"
            :key="item.id"
            class="detail-item"
          >
            <view class="detail-left">
              <text class="detail-date">{{ item.date }}</text>
              <text class="detail-order">订单号: {{ item.orderNo }}</text>
            </view>
            <text class="detail-amount">+¥{{ item.amount }}</text>
          </view>
          <view class="empty-state" v-if="incomeDetail.length === 0">
            <text class="empty-text">暂无收入记录</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.income-page {
  min-height: 100vh;
  background: #f4f5f7;
}

.income-content {
  padding: 180rpx 30rpx 30rpx;
}

// 概览卡片
.overview-card {
  background: linear-gradient(135deg, #007aff, #00b4ff);
  border-radius: 24rpx;
  padding: 40rpx;
  margin-bottom: 30rpx;

  .overview-header {
    text-align: center;
    margin-bottom: 30rpx;

    .header-title {
      font-size: 28rpx;
      color: rgba(255, 255, 255, 0.85);
      display: block;
      margin-bottom: 10rpx;
    }

    .header-value {
      font-size: 56rpx;
      color: #fff;
      font-weight: bold;
    }
  }

  .overview-stats {
    display: flex;
    justify-content: space-around;
    padding-top: 30rpx;
    border-top: 1rpx solid rgba(255, 255, 255, 0.2);

    .stat-item {
      text-align: center;

      .stat-label {
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.85);
        display: block;
        margin-bottom: 8rpx;
      }

      .stat-value {
        font-size: 32rpx;
        color: #fff;
        font-weight: bold;

        &.primary {
          color: #ffdd00;
        }
      }
    }

    .stat-divider {
      width: 1rpx;
      background: rgba(255, 255, 255, 0.2);
    }
  }
}

// 收入明细
.detail-section {
  .section-header {
    margin-bottom: 20rpx;

    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
  }
}

.detail-list {
  background: #fff;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  .detail-left {
    .detail-date {
      font-size: 28rpx;
      color: #333;
      display: block;
      margin-bottom: 8rpx;
    }

    .detail-order {
      font-size: 24rpx;
      color: #999;
    }
  }

  .detail-amount {
    font-size: 32rpx;
    color: #00b578;
    font-weight: bold;
  }
}

.empty-state {
  padding: 60rpx 0;
  text-align: center;

  .empty-text {
    font-size: 28rpx;
    color: #999;
  }
}
</style>
