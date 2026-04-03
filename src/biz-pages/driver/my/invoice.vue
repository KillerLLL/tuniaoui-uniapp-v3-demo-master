<script lang="ts" setup>
/**
 * 发票管理页面
 */
import { ref, onMounted } from 'vue'
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
  <view class="invoice-page">
    <!-- 自定义导航栏 -->
    <CustomNavbar title="发票管理">
      <template #right>
        <view class="navbar-right" @tap="applyInvoice">
          <text class="apply-text">申请</text>
        </view>
      </template>
    </CustomNavbar>

    <!-- 页面内容 -->
    <view class="invoice-content">
      <view
        v-for="item in invoiceList"
        :key="item.id"
        class="invoice-card"
      >
        <view class="card-header">
          <text class="invoice-title">{{ item.title }}</text>
          <view
            class="invoice-status"
            :style="{ background: getStatusColor(item.status) }"
          >
            {{ getStatusText(item.status) }}
          </view>
        </view>
        <view class="card-body">
          <view class="info-row">
            <text class="info-label">税号</text>
            <text class="info-value">{{ item.taxNo }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">开票金额</text>
            <text class="info-value primary">¥{{ item.amount }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">申请时间</text>
            <text class="info-value">{{ item.createTime }}</text>
          </view>
          <view class="info-row" v-if="item.invoiceTime">
            <text class="info-label">开票时间</text>
            <text class="info-value">{{ item.invoiceTime }}</text>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view class="empty-state" v-if="invoiceList.length === 0">
        <text class="empty-icon">📋</text>
        <text class="empty-text">暂无发票记录</text>
        <view class="empty-btn" @tap="applyInvoice">
          <text class="btn-text">申请开票</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.invoice-page {
  min-height: 100vh;
  background: #f4f5f7;
}

.navbar-right {
  padding: 10rpx;

  .apply-text {
    font-size: 28rpx;
    color: #007aff;
    font-weight: bold;
  }
}

.invoice-content {
  padding: 180rpx 30rpx 30rpx;
}

.invoice-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    padding-bottom: 20rpx;
    border-bottom: 1rpx solid #f5f5f5;

    .invoice-title {
      font-size: 30rpx;
      color: #333;
      font-weight: bold;
    }

    .invoice-status {
      padding: 6rpx 16rpx;
      border-radius: 20rpx;
      font-size: 22rpx;
      color: #fff;
    }
  }

  .card-body {
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 12rpx 0;

      .info-label {
        font-size: 28rpx;
        color: #999;
      }

      .info-value {
        font-size: 28rpx;
        color: #333;

        &.primary {
          color: #ff7a00;
          font-weight: bold;
        }
      }
    }
  }
}

.empty-state {
  text-align: center;
  padding: 100rpx 0;

  .empty-icon {
    font-size: 100rpx;
    display: block;
    margin-bottom: 20rpx;
  }

  .empty-text {
    font-size: 32rpx;
    color: #999;
    display: block;
    margin-bottom: 30rpx;
  }

  .empty-btn {
    display: inline-block;
    background: linear-gradient(135deg, #007aff, #00b4ff);
    padding: 16rpx 40rpx;
    border-radius: 30rpx;

    .btn-text {
      color: #fff;
      font-size: 28rpx;
    }
  }
}
</style>
