<script setup>
import TnIcon from '@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue'
import { ORDER_STATUS_MAP } from '@/utils/const'

const props = defineProps({
  order: { type: Object, required: true },
})

const emit = defineEmits(['click'])

// 获取状态配置
const getStatusConfig = (status) => {
  return ORDER_STATUS_MAP[status] || { label: '未知', color: '#999', bgColor: '#f5f5f5' }
}

// 点击事件
const onClick = () => {
  emit('click', props.order)
}
</script>

<template>
  <view class="order-card" @tap="onClick">
    <!-- 顶部：订单号 + 状态标签 -->
    <view class="card-header">
      <text class="order-id">{{ order.id }}</text>
      <view
        class="status-tag"
        :style="{
          color: getStatusConfig(order.status).color,
          backgroundColor: getStatusConfig(order.status).bgColor,
        }"
      >
        <text class="status-text">{{ getStatusConfig(order.status).label }}</text>
      </view>
    </view>

    <!-- 路线信息 -->
    <view class="card-route">
      <view class="route-item">
        <TnIcon name="location" color="#007AFF" size="32" />
        <text class="route-text">{{ order.pickupAddress }}</text>
      </view>
      <view class="route-line">
        <view class="line-dot" />
      </view>
      <view class="route-item">
        <TnIcon name="location" color="#00B578" size="32" />
        <text class="route-text">{{ order.deliveryAddress }}</text>
      </view>
    </view>

    <!-- 底部：货物 + 费用 + 时间 -->
    <view class="card-footer">
      <text class="cargo-info">{{ order.cargoType }} {{ order.cargoWeight }}</text>
      <text class="order-fee">¥{{ order.totalFee?.toFixed(2) }}</text>
    </view>
    <view class="card-time">
      <text class="time-text">{{ order.createTime }}</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.order-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24rpx;

    .order-id {
      font-size: 26rpx;
      color: #999;
    }

    .status-tag {
      padding: 6rpx 20rpx;
      border-radius: 20rpx;

      .status-text {
        font-size: 24rpx;
        font-weight: bold;
      }
    }
  }

  .card-route {
    margin-bottom: 20rpx;

    .route-item {
      display: flex;
      align-items: center;
      padding: 8rpx 0;

      .route-text {
        margin-left: 12rpx;
        font-size: 28rpx;
        color: #333;
      }
    }

    .route-line {
      display: flex;
      justify-content: center;
      padding: 4rpx 0;
      margin-left: 14rpx;

      .line-dot {
        width: 2rpx;
        height: 16rpx;
        background: #ddd;
      }
    }
  }

  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 20rpx;
    border-top: 1rpx solid #f0f0f0;

    .cargo-info {
      font-size: 26rpx;
      color: #666;
    }

    .order-fee {
      font-size: 32rpx;
      font-weight: bold;
      color: #FF7A00;
    }
  }

  .card-time {
    margin-top: 10rpx;

    .time-text {
      font-size: 24rpx;
      color: #bbb;
    }
  }
}
</style>
