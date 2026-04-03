<script lang="ts" setup>
/**
 * 订单列表页面
 * 显示全部订单，支持状态筛选
 */
import { onMounted, ref } from 'vue'
import CustomNavbar from '@/components/custom-navbar/index.vue'
import { getOrderListApi } from '@/api/driver'
import { ORDER_STATUS_CONFIG } from '@/utils/const'

// 订单列表
const orderList = ref([])

// 筛选状态
const filterIndex = ref(0)
const filterList = [
  { name: '全部', status: 99 },
  { name: '待提货', status: 1 },
  { name: '已提货', status: 2 },
  { name: '运输中', status: 3 },
  { name: '已完成', status: 5 },
]

// 加载状态
const loading = ref(false)

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const res = await getOrderListApi({
      status: filterList[filterIndex.value].status,
    })
    if (res.code === 200) {
      orderList.value = res.data
    }
  } catch (e) {
    console.error('加载失败', e)
  } finally {
    loading.value = false
  }
}

// 筛选切换
const handleFilterChange = (index) => {
  if (filterIndex.value === index) return
  filterIndex.value = index
  loadData()
}

// 查看详情
const goToDetail = (item) => {
  uni.navigateTo({
    url: `/biz-pages/driver/order/detail?id=${item.id}`,
  })
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <view class="order-list-page">
    <!-- 自定义导航栏 -->
    <CustomNavbar title="我的订单" :show-back="false" />

    <!-- 页面内容 -->
    <view class="list-content">
      <!-- 筛选 Tab -->
      <scroll-view scroll-x class="filter-scroll">
        <view class="filter-tabs">
          <view
            v-for="(item, index) in filterList"
            :key="index"
            class="filter-tab"
            :class="{ active: filterIndex === index }"
            @tap="handleFilterChange(index)"
          >
            <text class="tab-text">{{ item.name }}</text>
          </view>
        </view>
      </scroll-view>

      <!-- 订单列表 -->
      <scroll-view scroll-y class="order-list">
        <view
          v-for="item in orderList"
          :key="item.id"
          class="order-card"
          @tap="goToDetail(item)"
        >
          <view class="card-header">
            <text class="order-no">{{ item.orderNo }}</text>
            <TnTag
              :type="
                ORDER_STATUS_CONFIG[item.status]?.color === '#00B578'
                  ? 'success'
                  : ORDER_STATUS_CONFIG[item.status]?.color === '#FF7A00'
                  ? 'warning'
                  : 'primary'
              "
              size="sm"
            >
              {{ ORDER_STATUS_CONFIG[item.status]?.text || '未知' }}
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
              <view class="route-line" />
              <view class="route-item">
                <view class="route-icon-box end">
                  <TnIcon name="location-fill" size="20" />
                </view>
                <text class="route-text">{{ item.unloadingAddress }}</text>
              </view>
            </view>
          </view>

          <view class="card-footer">
            <text class="freight">运费: ¥{{ item.freight }}</text>
            <view class="action-hint">
              <text>查看详情</text>
              <TnIcon name="right" size="22" color="#007aff" />
            </view>
          </view>
        </view>

        <!-- 空状态 -->
        <TnEmpty
          v-if="orderList.length === 0 && !loading"
          mode="order"
          show-tips
        >
          <template #tips>
            <text class="empty-text">暂无订单</text>
          </template>
        </TnEmpty>

        <!-- 加载中 -->
        <view v-if="loading" class="loading-state">
          <text class="loading-text">加载中...</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.order-list-page {
  min-height: 100vh;
  background: #f4f5f7;
}

.list-content {
  padding: 180rpx 0 30rpx;
}

// 筛选 Tab
.filter-scroll {
  white-space: nowrap;
  padding: 0 30rpx;
  margin-bottom: 24rpx;
}

.filter-tabs {
  display: inline-flex;
  background: #fff;
  border-radius: 16rpx;
  padding: 8rpx;

  .filter-tab {
    padding: 16rpx 32rpx;
    border-radius: 12rpx;
    transition: all 0.2s;

    .tab-text {
      font-size: 28rpx;
      color: #666;
      white-space: nowrap;
    }

    &.active {
      background: linear-gradient(135deg, #007aff, #00b4ff);

      .tab-text {
        color: #fff;
        font-weight: bold;
      }
    }
  }
}

// 订单列表
.order-list {
  height: calc(100vh - 280rpx);
  padding: 0 30rpx;
}

.order-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

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
  padding: 20rpx 0;
  border-top: 1rpx solid #f0f0f0;
  border-bottom: 1rpx solid #f0f0f0;

  .goods-info {
    display: flex;
    gap: 16rpx;
    margin-bottom: 16rpx;

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

    .route-line {
      width: 4rpx;
      height: 20rpx;
      background: #ddd;
      margin-left: 16rpx;
      margin-top: 6rpx;
      margin-bottom: 6rpx;
    }
  }
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20rpx;

  .freight {
    font-size: 32rpx;
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

.empty-text {
  font-size: 32rpx;
  color: #999;
  display: block;
  margin-top: 20rpx;
}

.loading-state {
  text-align: center;
  padding: 40rpx;

  .loading-text {
    font-size: 28rpx;
    color: #999;
  }
}
</style>
