<script setup>
import { ref, onMounted } from 'vue'
import TnIcon from '@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue'
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'
import { getInvoiceListApi } from '@/api/driver'
import { INVOICE_STATUS_MAP } from '@/utils/const'

defineOptions({
  options: {
    virtualHost: true,
  },
})

const invoiceList = ref([])
const loading = ref(false)

// 获取发票列表
const fetchInvoiceList = async () => {
  loading.value = true
  try {
    const res = await getInvoiceListApi()
    invoiceList.value = res.data.list || []
  } catch (e) {
    uni.showToast({ title: '获取发票列表失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 获取发票状态配置
const getStatusConfig = (status) => {
  return INVOICE_STATUS_MAP[status] || { label: '未知', color: '#999' }
}

// 跳转申请发票页
const goApplyInvoice = () => {
  uni.navigateTo({ url: '/biz-pages/driver/invoice/apply' })
}

onMounted(() => {
  fetchInvoiceList()
})
</script>

<template>
  <view class="invoice-page">
    <CustomNavbar title="发票管理" />

    <view class="page-content">
      <!-- 发票列表 -->
      <view v-if="invoiceList.length > 0" class="invoice-list">
        <view
          v-for="item in invoiceList"
          :key="item.id"
          class="invoice-card"
        >
          <view class="card-top">
            <text class="invoice-title">{{ item.title }}</text>
            <text
              class="invoice-status"
              :style="{
                color: getStatusConfig(item.status).color,
                backgroundColor: getStatusConfig(item.status).color + '15',
              }"
            >
              {{ getStatusConfig(item.status).label }}
            </text>
          </view>
          <view class="card-bottom">
            <text class="invoice-amount">&#165;{{ item.amount.toFixed(2) }}</text>
            <text class="invoice-time">{{ item.applyTime }}</text>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-else-if="!loading" class="empty-state">
        <TnIcon name="order" color="#ccc" size="80" />
        <text class="empty-text">暂无发票记录</text>
      </view>
    </view>

    <!-- 底部申请发票按钮 -->
    <view class="bottom-bar">
      <view class="apply-btn" @tap="goApplyInvoice">
        <text class="apply-btn-text">申请发票</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.invoice-page {
  min-height: 100vh;
  background: #f4f5f7;
  padding-bottom: 140rpx;

  .page-content {
    padding-top: calc(var(--status-bar-height) + 88rpx + 30rpx);
  }

  .invoice-list {
    padding: 0 24rpx;

    .invoice-card {
      background: #fff;
      border-radius: 16rpx;
      padding: 28rpx 24rpx;
      margin-bottom: 16rpx;

      .card-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20rpx;

        .invoice-title {
          font-size: 30rpx;
          font-weight: bold;
          color: #333;
        }

        .invoice-status {
          font-size: 24rpx;
          padding: 6rpx 16rpx;
          border-radius: 8rpx;
          flex-shrink: 0;
        }
      }

      .card-bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .invoice-amount {
          font-size: 36rpx;
          font-weight: bold;
          color: #ff7a00;
        }

        .invoice-time {
          font-size: 24rpx;
          color: #999;
        }
      }
    }
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 200rpx;

    .empty-text {
      margin-top: 20rpx;
      font-size: 28rpx;
      color: #999;
    }
  }

  .bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20rpx 30rpx;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    background: #fff;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
    z-index: 100;

    .apply-btn {
      height: 88rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #007aff, #00b4ff);
      border-radius: 44rpx;

      .apply-btn-text {
        font-size: 32rpx;
        font-weight: bold;
        color: #fff;
      }
    }
  }
}
</style>
