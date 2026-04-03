<script lang="ts" setup>
/**
 * 货主端订单详情页面
 */
import { onMounted, ref } from 'vue'
import CustomNavbar from '@/components/custom-navbar/index.vue'
import { getOrderDetailApi } from '@/api/shipper'

// 订单ID
const orderId = ref('')

// 订单详情
const orderDetail = ref(null)

// 加载数据
const loadData = async () => {
  try {
    const res = await getOrderDetailApi(orderId.value)
    if (res.code === 200) {
      orderDetail.value = res.data
    }
  } catch (e) {
    console.error('加载失败', e)
  }
}

// 拨打电话
const makePhoneCall = (phone) => {
  if (!phone) return
  uni.makePhoneCall({
    phoneNumber: phone.replace('****', '0000'),
  })
}

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options || {}
  orderId.value = options.id || '1'
  loadData()
})
</script>

<template>
  <view class="order-detail-page">
    <!-- 自定义导航栏 -->
    <CustomNavbar title="订单详情" />

    <!-- 页面内容 -->
    <view v-if="orderDetail" class="detail-content">
      <!-- 状态卡片 -->
      <view class="status-card">
        <text class="status-text">{{
          orderDetail.status === 'in_transit' ? '运输中' : orderDetail.status
        }}</text>
      </view>

      <!-- 货物信息 -->
      <view class="info-section">
        <view class="section-title">货物信息</view>
        <view class="info-card">
          <view class="info-row">
            <text class="info-label">货物类型</text>
            <text class="info-value">{{ orderDetail.goods.type }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">重量</text>
            <text class="info-value">{{ orderDetail.goods.weight }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">体积</text>
            <text class="info-value">{{ orderDetail.goods.volume }}</text>
          </view>
        </view>
      </view>

      <!-- 司机信息 -->
      <view v-if="orderDetail.driver" class="info-section">
        <view class="section-title">司机信息</view>
        <view class="info-card">
          <view class="info-row">
            <text class="info-label">司机姓名</text>
            <text class="info-value">{{ orderDetail.driver.name }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">联系电话</text>
            <text
              class="info-value link"
              @tap="makePhoneCall(orderDetail.driver.phone)"
            >
              {{ orderDetail.driver.phone }}
            </text>
          </view>
          <view class="info-row">
            <text class="info-label">车牌号</text>
            <text class="info-value">{{ orderDetail.driver.plate }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">评分</text>
            <view class="info-value">
              <TnIcon name="star" size="24" color="#ffb800" />
              <text class="rating-text">{{ orderDetail.driver.rating }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 费用信息 -->
      <view class="info-section">
        <view class="section-title">费用信息</view>
        <view class="info-card">
          <view class="info-row">
            <text class="info-label">运费</text>
            <text class="info-value primary">¥{{ orderDetail.price }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.order-detail-page {
  min-height: 100vh;
  background: #f4f5f7;
}

.detail-content {
  padding: 180rpx 30rpx 30rpx;
}

.status-card {
  background: linear-gradient(135deg, #007aff, #00b4ff);
  border-radius: 24rpx;
  padding: 30rpx;
  text-align: center;
  margin-bottom: 30rpx;

  .status-text {
    font-size: 32rpx;
    color: #fff;
    font-weight: bold;
  }
}

.info-section {
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
}

.info-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 10rpx 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

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

    &.link {
      color: #007aff;
    }
  }
}
</style>
