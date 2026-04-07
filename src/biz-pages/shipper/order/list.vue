<script lang="ts" setup>
/**
 * 货主端订单列表页面
 */
import { onMounted, ref } from 'vue'
import CustomNavbar from '@/components/custom-navbar/index.vue'
import { getOrderListApi } from '@/api/shipper'

// 订单列表
const orderList = ref([])

// 加载数据
const loadData = async () => {
  try {
    const res = await getOrderListApi()
    if (res.code === 200) {
      orderList.value = res.data
    }
  } catch (e) {
    console.error('加载失败', e)
  }
}

// 状态文本
const getStatusText = (status) => {
  const texts = {
    pending: '待接单',
    in_transit: '进行中',
    completed: '已完成',
    cancelled: '已取消',
  }
  return texts[status] || '未知'
}

// 状态颜色
const getStatusColor = (status) => {
  const colors = {
    pending: '#ff7a00',
    in_transit: '#007aff',
    completed: '#00b578',
    cancelled: '#999',
  }
  return colors[status] || '#999'
}

// 查看详情
const goToDetail = (id) => {
  uni.navigateTo({ url: `/biz-pages/shipper/order/detail?id=${id}` })
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <view class="order-list-page">
    <!-- 自定义导航栏 -->
    <CustomNavbar title="订单管理" :show-back="false" />

    <!-- 页面内容 -->
    <view class="list-content">
      <view
        v-for="(item, index) in orderList"
        :key="item.id"
        class="order-card animate-list-item"
        :class="`delay-${Math.min(index + 1, 20)}`"
        @tap="goToDetail(item.id)"
      >
        <view class="card-header">
          <text class="order-no">{{ item.orderNo }}</text>
          <TnTag
            :type="
              item.status === 'completed'
                ? 'success'
                : item.status === 'pending'
                ? 'warning'
                : item.status === 'in_transit'
                ? 'primary'
                : 'info'
            "
            size="sm"
          >
            {{ getStatusText(item.status) }}
          </TnTag>
        </view>
        <view class="card-body">
          <view class="goods-info">
            <text class="goods-type">{{ item.goodsType }}</text>
            <text class="goods-weight">{{ item.weight }}</text>
          </view>
          <view class="route-info">
            <view class="route-item">
              <view class="route-icon-box start">
                <TnIcon name="start" size="20" />
              </view>
              <text class="route-text">{{ item.loadingAddress }}</text>
            </view>
            <view class="route-item">
              <view class="route-icon-box end">
                <TnIcon name="location-fill" size="20" />
              </view>
              <text class="route-text">{{ item.unloadingAddress }}</text>
            </view>
          </view>
          <view v-if="item.driverName" class="driver-info">
            <text class="driver-name">司机：{{ item.driverName }}</text>
            <text class="driver-plate">{{ item.driverPlate }}</text>
          </view>
        </view>
        <view class="card-footer">
          <text class="order-price">¥{{ item.price }}</text>
          <view class="action-hint">
            <text>查看详情</text>
            <TnIcon name="right" size="22" color="#007aff" />
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <TnEmpty v-if="orderList.length === 0" mode="order" show-tips>
        <template #tips>
          <text class="empty-text">暂无订单</text>
        </template>
      </TnEmpty>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.order-list-page {
  min-height: 100vh;
  background: #f4f5f7;
}

.list-content {
  padding: 180rpx 30rpx 30rpx;
}

.order-card {
  background: #fff;
  border-radius: var(--tn-radius-xl);
  padding: 30rpx;
  margin-bottom: 24rpx;
  box-shadow: var(--tn-shadow-soft-2);

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;

    .order-no {
      font-size: 26rpx;
      color: #666;
    }
  }

  .card-body {
    padding: 16rpx 0;
    border-top: 1rpx solid #f0f0f0;
    border-bottom: 1rpx solid #f0f0f0;

    .goods-info {
      display: flex;
      gap: 16rpx;
      margin-bottom: 12rpx;

      .goods-type {
        font-size: 28rpx;
        color: #333;
        font-weight: bold;
      }

      .goods-weight {
        font-size: 26rpx;
        color: #999;
      }
    }

    .route-info {
      .route-item {
        display: flex;
        align-items: center;

        .route-icon-box {
          width: 36rpx;
          height: 36rpx;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12rpx;

          &.start {
            background: #e6f0ff;
            color: #007aff;
          }

          &.end {
            background: #e6fff0;
            color: #00b578;
          }
        }

        .route-text {
          font-size: 26rpx;
          color: #666;
        }
      }
    }

    .driver-info {
      display: flex;
      justify-content: space-between;
      margin-top: 12rpx;

      .driver-name {
        font-size: 26rpx;
        color: #333;
      }

      .driver-plate {
        font-size: 26rpx;
        color: #007aff;
      }
    }
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20rpx;

    .order-price {
      font-size: 36rpx;
      color: #ff7a00;
      font-weight: bold;
    }

    .action-hint {
      display: flex;
      align-items: center;
      font-size: 26rpx;
      color: #007aff;
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
