<script setup>
import TnIcon from '@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue'

const props = defineProps({
  cargo: { type: Object, required: true },
})

const emit = defineEmits(['grab-click'])

// 点击抢单
const onGrab = () => {
  emit('grab-click', props.cargo)
}
</script>

<template>
  <view class="cargo-card">
    <!-- 顶部：货物类型 + 重量 + 距离 -->
    <view class="card-header">
      <view class="cargo-tags">
        <view class="type-tag">{{ cargo.cargoType }}</view>
        <text class="cargo-weight">{{ cargo.cargoWeight }}</text>
      </view>
      <view class="distance-wrap">
        <TnIcon name="location" color="#999" size="28" />
        <text class="distance-text">{{ cargo.distance }}</text>
      </view>
    </view>

    <!-- 加急标签 -->
    <view v-if="cargo.urgency" class="urgency-tag">
      <text class="urgency-text">加急</text>
    </view>

    <!-- 路线信息 -->
    <view class="card-route">
      <view class="route-item">
        <view class="route-dot pickup" />
        <text class="route-text">{{ cargo.pickupAddress }}</text>
      </view>
      <view class="route-line">
        <view class="line-dash" />
      </view>
      <view class="route-item">
        <view class="route-dot delivery" />
        <text class="route-text">{{ cargo.deliveryAddress }}</text>
      </view>
    </view>

    <!-- 底部：运费 + 时间 + 抢单按钮 -->
    <view class="card-footer">
      <view class="fee-info">
        <text class="fee-label">运费: </text>
        <text class="fee-amount">¥{{ cargo.fee?.toFixed(2) }}</text>
      </view>
      <view class="grab-info">
        <text class="grab-count">{{ cargo.grabCount }}人已抢</text>
        <view class="grab-btn" @tap="onGrab">
          <text class="grab-btn-text">立即抢单</text>
        </view>
      </view>
    </view>

    <!-- 发布时间 -->
    <view class="card-time">
      <text class="time-text">{{ cargo.createTime }}</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.cargo-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20rpx;

    .cargo-tags {
      display: flex;
      align-items: center;

      .type-tag {
        padding: 6rpx 16rpx;
        background: rgba(0, 122, 255, 0.1);
        color: #007AFF;
        font-size: 24rpx;
        font-weight: bold;
        border-radius: 8rpx;
        margin-right: 16rpx;
      }

      .cargo-weight {
        font-size: 26rpx;
        color: #666;
      }
    }

    .distance-wrap {
      display: flex;
      align-items: center;

      .distance-text {
        margin-left: 6rpx;
        font-size: 24rpx;
        color: #999;
      }
    }
  }

  .urgency-tag {
    display: inline-block;
    margin-bottom: 16rpx;
    padding: 4rpx 14rpx;
    background: rgba(255, 76, 76, 0.1);

    .urgency-text {
      font-size: 22rpx;
      color: #FF4C4C;
      font-weight: bold;
    }
  }

  .card-route {
    margin-bottom: 24rpx;

    .route-item {
      display: flex;
      align-items: center;
      padding: 6rpx 0;

      .route-dot {
        width: 16rpx;
        height: 16rpx;
        border-radius: 50%;
        margin-right: 16rpx;
        flex-shrink: 0;

        &.pickup {
          background: #007AFF;
        }

        &.delivery {
          background: #00B578;
        }
      }

      .route-text {
        font-size: 28rpx;
        color: #333;
      }
    }

    .route-line {
      display: flex;
      justify-content: center;
      padding: 4rpx 0;
      margin-left: 6rpx;

      .line-dash {
        width: 2rpx;
        height: 20rpx;
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

    .fee-info {
      .fee-label {
        font-size: 26rpx;
        color: #999;
      }

      .fee-amount {
        font-size: 36rpx;
        font-weight: bold;
        color: #FF7A00;
      }
    }

    .grab-info {
      display: flex;
      align-items: center;

      .grab-count {
        font-size: 22rpx;
        color: #999;
        margin-right: 16rpx;
      }

      .grab-btn {
        padding: 14rpx 36rpx;
        background: linear-gradient(135deg, #007AFF, #00B4FF);
        border-radius: 32rpx;

        .grab-btn-text {
          font-size: 26rpx;
          color: #fff;
          font-weight: bold;
        }
      }
    }
  }

  .card-time {
    margin-top: 12rpx;

    .time-text {
      font-size: 22rpx;
      color: #ccc;
    }
  }
}
</style>
