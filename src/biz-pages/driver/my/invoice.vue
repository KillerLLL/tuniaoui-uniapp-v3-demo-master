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
  <view class="invoice-page">
    <!-- 自定义导航栏 -->
    <CustomNavbar title="发票管理">
      <template #right>
        <view class="navbar-right">
          <TnButton type="primary" size="sm" plain @click="applyInvoice">
            申请
          </TnButton>
        </view>
      </template>
    </CustomNavbar>

    <!-- 页面内容 -->
    <view class="invoice-content">
      <view v-for="item in invoiceList" :key="item.id" class="invoice-card">
        <view class="card-header">
          <text class="invoice-title">{{ item.title }}</text>
          <TnTag
            :type="
              item.status === 2
                ? 'success'
                : item.status === 0
                ? 'warning'
                : item.status === 1
                ? 'primary'
                : 'danger'
            "
            size="sm"
          >
            {{ getStatusText(item.status) }}
          </TnTag>
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
          <view v-if="item.invoiceTime" class="info-row">
            <text class="info-label">开票时间</text>
            <text class="info-value">{{ item.invoiceTime }}</text>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <TnEmpty v-if="invoiceList.length === 0" mode="order" show-tips>
        <template #tips>
          <text class="empty-text">暂无发票记录</text>
          <view class="empty-btn">
            <TnButton
              type="primary"
              size="sm"
              shadow
              shape="round"
              @click="applyInvoice"
            >
              申请开票
            </TnButton>
          </view>
        </template>
      </TnEmpty>
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

.empty-text {
  font-size: 32rpx;
  color: #999;
  display: block;
  margin-bottom: 30rpx;
}

.empty-btn {
  display: inline-block;
}
</style>
