<script lang="ts" setup>
/**
 * 我的货源页面
 */
import { ref, onMounted } from 'vue'
import CustomNavbar from '@/components/custom-navbar/index.vue'
import { getGoodsListApi } from '@/api/shipper'

// 货源列表
const goodsList = ref([])

// 加载数据
const loadData = async () => {
  try {
    const res = await getGoodsListApi()
    if (res.code === 200) {
      goodsList.value = res.data
    }
  } catch (e) {
    console.error('加载失败', e)
  }
}

// 状态文本
const getStatusText = (status) => {
  const texts = { pending: '待接单', grabbed: '已接单', completed: '已完成', cancelled: '已取消' }
  return texts[status] || '未知'
}

// 状态颜色
const getStatusColor = (status) => {
  const colors = { pending: '#ff7a00', grabbed: '#007aff', completed: '#00b578', cancelled: '#999' }
  return colors[status] || '#999'
}

// 查看详情
const goToDetail = (id) => {
  uni.navigateTo({ url: `/biz-pages/shipper/publish/detail?id=${id}` })
}

// 发布货源
const publishGoods = () => {
  uni.navigateTo({ url: '/biz-pages/shipper/publish/index' })
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <view class="goods-list-page">
    <!-- 自定义导航栏 -->
    <CustomNavbar title="我的货源" :show-back="false" />

    <!-- 页面内容 -->
    <view class="list-content">
      <view
        v-for="item in goodsList"
        :key="item.id"
        class="goods-card"
        @tap="goToDetail(item.id)"
      >
        <view class="card-header">
          <text class="goods-type">{{ item.goodsType }}</text>
          <view class="goods-status" :style="{ background: getStatusColor(item.status) }">
            {{ getStatusText(item.status) }}
          </view>
        </view>
        <view class="card-route">
          <view class="route-item">
            <text class="route-dot start">○</text>
            <text class="route-text">{{ item.loadingAddress }}</text>
          </view>
          <view class="route-line"></view>
          <view class="route-item">
            <text class="route-dot end">●</text>
            <text class="route-text">{{ item.unloadingAddress }}</text>
          </view>
        </view>
        <view class="card-footer">
          <text class="goods-price">¥{{ item.price }}</text>
          <text class="publish-time">{{ item.publishTime }}</text>
        </view>
      </view>

      <!-- 空状态 -->
      <view class="empty-state" v-if="goodsList.length === 0">
        <text class="empty-icon">📦</text>
        <text class="empty-text">暂无货源</text>
        <view class="empty-btn" @tap="publishGoods">
          <text class="btn-text">发布货源</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.goods-list-page {
  min-height: 100vh;
  background: #f4f5f7;
}

.list-content {
  padding: 180rpx 30rpx 30rpx;
}

.goods-card {
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

    .goods-type {
      font-size: 30rpx;
      color: #333;
      font-weight: bold;
    }

    .goods-status {
      padding: 6rpx 16rpx;
      border-radius: 20rpx;
      font-size: 22rpx;
      color: #fff;
    }
  }

  .card-route {
    padding: 16rpx 0;
    border-top: 1rpx solid #f0f0f0;
    border-bottom: 1rpx solid #f0f0f0;

    .route-item {
      display: flex;
      align-items: center;

      .route-dot {
        font-size: 24rpx;
        margin-right: 12rpx;

        &.start {
          color: #007aff;
        }

        &.end {
          color: #00b578;
        }
      }

      .route-text {
        font-size: 26rpx;
        color: #666;
      }
    }

    .route-line {
      width: 4rpx;
      height: 20rpx;
      background: #ddd;
      margin-left: 8rpx;
      margin-top: 6rpx;
      margin-bottom: 6rpx;
    }
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20rpx;

    .goods-price {
      font-size: 36rpx;
      color: #ff7a00;
      font-weight: bold;
    }

    .publish-time {
      font-size: 24rpx;
      color: #999;
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
    background: linear-gradient(135deg, #00b578, #00d68f);
    padding: 16rpx 40rpx;
    border-radius: 30rpx;

    .btn-text {
      color: #fff;
      font-size: 28rpx;
    }
  }
}
</style>
