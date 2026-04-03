<script lang="ts" setup>
/**
 * 优惠券页面
 */
import { onMounted, ref } from 'vue'
import CustomNavbar from '@/components/custom-navbar/index.vue'
import { getCouponListApi } from '@/api/driver'

// 优惠券列表
const couponList = ref([])

// 加载数据
const loadData = async () => {
  try {
    const res = await getCouponListApi()
    if (res.code === 200) {
      couponList.value = res.data
    }
  } catch (e) {
    console.error('加载失败', e)
  }
}

// 状态文本
const getStatusText = (status) => {
  const texts = { 0: '未使用', 1: '已使用', 2: '已过期' }
  return texts[status] || '未知'
}

// 状态颜色
const getStatusColor = (status) => {
  const colors = { 0: '#00b578', 1: '#999', 2: '#ff4c4c' }
  return colors[status] || '#999'
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <view class="coupon-page">
    <!-- 自定义导航栏 -->
    <CustomNavbar title="优惠券" />

    <!-- 页面内容 -->
    <view class="coupon-content">
      <view
        v-for="item in couponList"
        :key="item.id"
        class="coupon-card"
        :class="{ disabled: item.status !== 0 }"
      >
        <view class="coupon-left">
          <text class="coupon-amount">¥{{ item.amount }}</text>
          <text class="coupon-condition">{{ item.condition }}</text>
        </view>
        <view class="coupon-right">
          <text class="coupon-name">{{ item.name }}</text>
          <text class="coupon-expire">有效期至 {{ item.expireTime }}</text>
          <TnTag
            :type="
              item.status === 0
                ? 'success'
                : item.status === 1
                ? 'info'
                : 'danger'
            "
            size="sm"
          >
            {{ getStatusText(item.status) }}
          </TnTag>
        </view>
      </view>

      <!-- 空状态 -->
      <TnEmpty v-if="couponList.length === 0" mode="coupon" show-tips>
        <template #tips>
          <text class="empty-text">暂无优惠券</text>
        </template>
      </TnEmpty>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.coupon-page {
  min-height: 100vh;
  background: #f4f5f7;
}

.coupon-content {
  padding: 180rpx 30rpx 30rpx;
}

.coupon-card {
  background: #fff;
  border-radius: 24rpx;
  display: flex;
  margin-bottom: 24rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

  &.disabled {
    opacity: 0.6;
  }

  .coupon-left {
    width: 220rpx;
    background: linear-gradient(135deg, #ff7a00, #ff4500);
    padding: 30rpx 20rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .coupon-amount {
      font-size: 48rpx;
      color: #fff;
      font-weight: bold;
    }

    .coupon-condition {
      font-size: 22rpx;
      color: rgba(255, 255, 255, 0.85);
      margin-top: 8rpx;
    }
  }

  .coupon-right {
    flex: 1;
    padding: 30rpx;
    position: relative;

    .coupon-name {
      font-size: 30rpx;
      color: #333;
      font-weight: bold;
      display: block;
      margin-bottom: 10rpx;
    }

    .coupon-expire {
      font-size: 24rpx;
      color: #999;
      display: block;
    }
  }
}

.empty-text {
  font-size: 32rpx;
  color: #999;
  display: block;
  margin-top: 20rpx;
}
</style>
