<script setup>
import { ref, onMounted } from 'vue'
import TnIcon from '@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue'
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'
import { getWalletDetailApi, withdrawApi } from '@/api/driver'

defineOptions({
  options: {
    virtualHost: true,
  },
})

// 钱包数据
const balance = ref('3280.00')
const recordList = ref([])
const loading = ref(false)

// 获取钱包明细
const fetchWalletDetail = async () => {
  loading.value = true
  try {
    const res = await getWalletDetailApi()
    if (res.code === 200) {
      recordList.value = res.data.list || []
    }
  } catch (e) {
    uni.showToast({ title: '获取钱包信息失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 提现操作
const handleWithdraw = () => {
  uni.showModal({
    title: '申请提现',
    editable: true,
    placeholderText: '请输入提现金额',
    success: async (modalRes) => {
      if (modalRes.confirm && modalRes.content) {
        const amount = parseFloat(modalRes.content)
        if (isNaN(amount) || amount <= 0) {
          uni.showToast({ title: '请输入有效金额', icon: 'none' })
          return
        }
        try {
          const result = await withdrawApi(amount)
          if (result.code === 200) {
            uni.showToast({ title: '提现申请已提交', icon: 'success' })
            fetchWalletDetail()
          }
        } catch (e) {
          uni.showToast({ title: e.message || '提现失败', icon: 'none' })
        }
      }
    },
  })
}

onMounted(() => {
  fetchWalletDetail()
})
</script>

<template>
  <view class="wallet-page">
    <CustomNavbar title="我的钱包" />

    <view class="page-content">
      <!-- 余额卡片 -->
      <view class="balance-card">
        <view class="balance-info">
          <text class="balance-label">账户余额</text>
          <view class="balance-amount">
            <text class="amount-symbol">¥</text>
            <text class="amount-value">{{ balance }}</text>
          </view>
        </view>
        <view class="withdraw-btn" @tap="handleWithdraw">
          <text class="withdraw-text">提现</text>
        </view>
      </view>

      <!-- 收支明细标题 -->
      <view class="section-header">
        <text class="section-title">收支明细</text>
      </view>

      <!-- 收支明细列表 -->
      <view class="record-list">
        <view
          v-for="item in recordList"
          :key="item.id"
          class="record-item"
        >
          <view class="record-icon" :class="item.type === 'income' ? 'income-icon' : 'expense-icon'">
            <text class="icon-text">{{ item.type === 'income' ? '+' : '-' }}</text>
          </view>
          <view class="record-info">
            <text class="record-desc">{{ item.desc }}</text>
            <text class="record-time">{{ item.time }}</text>
          </view>
          <view class="record-amount">
            <text
              class="amount-text"
              :class="item.type === 'income' ? 'income-text' : 'expense-text'"
            >
              {{ item.type === 'income' ? '+' : '' }}{{ Math.abs(item.amount).toFixed(2) }}
            </text>
          </view>
        </view>

        <!-- 空状态 -->
        <view v-if="!loading && recordList.length === 0" class="empty-state">
          <TnIcon name="empty-data" size="120" color="#ccc" />
          <text class="empty-text">暂无收支记录</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.wallet-page {
  min-height: 100vh;
  background: #f4f5f7;

  .page-content {
    padding-top: calc(var(--status-bar-height) + 88rpx + 30rpx);
    padding-left: 30rpx;
    padding-right: 30rpx;
  }

  // 余额卡片
  .balance-card {
    background: linear-gradient(135deg, #007aff, #00b4ff);
    border-radius: 24rpx;
    padding: 50rpx 40rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30rpx;

    .balance-info {
      flex: 1;

      .balance-label {
        font-size: 26rpx;
        color: rgba(255, 255, 255, 0.8);
      }

      .balance-amount {
        margin-top: 16rpx;
        display: flex;
        align-items: baseline;

        .amount-symbol {
          font-size: 32rpx;
          color: #fff;
          font-weight: bold;
        }

        .amount-value {
          font-size: 56rpx;
          color: #fff;
          font-weight: bold;
          margin-left: 6rpx;
        }
      }
    }

    .withdraw-btn {
      width: 160rpx;
      height: 72rpx;
      background: rgba(255, 255, 255, 0.25);
      border-radius: 36rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      .withdraw-text {
        font-size: 28rpx;
        color: #fff;
        font-weight: bold;
      }
    }
  }

  // 明细标题
  .section-header {
    margin-bottom: 20rpx;

    .section-title {
      font-size: 30rpx;
      font-weight: bold;
      color: #333;
    }
  }

  // 明细列表
  .record-list {
    .record-item {
      display: flex;
      align-items: center;
      background: #fff;
      border-radius: 16rpx;
      padding: 30rpx 24rpx;
      margin-bottom: 16rpx;

      .record-icon {
        width: 72rpx;
        height: 72rpx;
        border-radius: 36rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 24rpx;

        .icon-text {
          font-size: 32rpx;
          font-weight: bold;
        }

        &.income-icon {
          background: rgba(0, 181, 120, 0.1);

          .icon-text {
            color: #00b578;
          }
        }

        &.expense-icon {
          background: rgba(255, 76, 76, 0.1);

          .icon-text {
            color: #ff4c4c;
          }
        }
      }

      .record-info {
        flex: 1;

        .record-desc {
          font-size: 28rpx;
          color: #333;
          display: block;
        }

        .record-time {
          font-size: 24rpx;
          color: #999;
          margin-top: 8rpx;
          display: block;
        }
      }

      .record-amount {
        .amount-text {
          font-size: 32rpx;
          font-weight: bold;

          &.income-text {
            color: #00b578;
          }

          &.expense-text {
            color: #ff4c4c;
          }
        }
      }
    }

    // 空状态
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 100rpx 0;

      .empty-text {
        font-size: 26rpx;
        color: #999;
        margin-top: 20rpx;
      }
    }
  }
}
</style>
