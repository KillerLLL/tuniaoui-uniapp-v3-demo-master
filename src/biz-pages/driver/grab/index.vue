<script lang="ts" setup>
/**
 * 抢单大厅页面
 * 显示货源列表，支持筛选和抢单
 */
import { ref, onMounted } from 'vue'
import CustomNavbar from '@/components/custom-navbar/index.vue'
import { getGrabListApi, grabOrderApi } from '@/api/driver'

// 货源列表
const grabList = ref([])

// 筛选状态
const filterIndex = ref(0)
const filterList = ['全部', '待抢单', '附近优先']

// 搜索关键词
const searchKey = ref('')

// 加载状态
const loading = ref(false)

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const res = await getGrabListApi({
      nearby: filterIndex.value === 2,
      keyword: searchKey.value,
    })
    if (res.code === 200) {
      grabList.value = res.data
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

// 搜索
const handleSearch = () => {
  loadData()
}

// 查看详情
const goToDetail = (item) => {
  uni.navigateTo({
    url: `/biz-pages/driver/order/detail?id=${item.id}&type=grab`,
  })
}

// 抢单
const handleGrab = async (item) => {
  uni.showModal({
    title: '确认抢单',
    content: `确认抢下此订单？运费 ¥${item.freight}`,
    success: async (res) => {
      if (res.confirm) {
        try {
          uni.showLoading({ title: '抢单中...' })
          const result = await grabOrderApi(item.id)
          uni.hideLoading()
          if (result.code === 200) {
            uni.showToast({ title: '抢单成功', icon: 'success' })
            loadData()
          }
        } catch (e: any) {
          uni.hideLoading()
          uni.showToast({ title: e.message || '抢单失败', icon: 'none' })
        }
      }
    },
  })
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <view class="grab-page">
    <!-- 自定义导航栏 -->
    <CustomNavbar title="抢单大厅" :show-back="false">
      <template #right>
        <view class="navbar-right" @tap="uni.navigateTo({ url: '/biz-pages/driver/common/search' })">
          <text class="search-icon">🔍</text>
        </view>
      </template>
    </CustomNavbar>

    <!-- 页面内容 -->
    <view class="grab-content">
      <!-- 筛选 Tab -->
      <view class="filter-tabs">
        <view
          v-for="(item, index) in filterList"
          :key="index"
          class="filter-tab"
          :class="{ active: filterIndex === index }"
          @tap="handleFilterChange(index)"
        >
          <text class="tab-text">{{ item }}</text>
        </view>
      </view>

      <!-- 货源列表 -->
      <scroll-view scroll-y class="grab-list">
        <view
          v-for="item in grabList"
          :key="item.id"
          class="grab-card"
        >
          <!-- 货物信息头部 -->
          <view class="card-header">
            <view class="goods-tags">
              <view class="goods-tag">
                <text class="tag-text">{{ item.goodsType }}</text>
              </view>
              <view class="goods-tag weight">
                <text class="tag-text">{{ item.weight }}</text>
              </view>
              <view class="goods-tag distance">
                <text class="tag-text">{{ item.distance }}</text>
              </view>
            </view>
            <text class="publish-time">{{ item.publishTime }}</text>
          </view>

          <!-- 装卸地址 -->
          <view class="address-section">
            <view class="address-item">
              <view class="address-dot start">
                <text>○</text>
              </view>
              <view class="address-info">
                <text class="address-label">装货</text>
                <text class="address-text">{{ item.loadingAddress }}</text>
              </view>
            </view>
            <view class="address-line"></view>
            <view class="address-item">
              <view class="address-dot end">
                <text>●</text>
              </view>
              <view class="address-info">
                <text class="address-label">卸货</text>
                <text class="address-text">{{ item.unloadingAddress }}</text>
              </view>
            </view>
          </view>

          <!-- 底部信息 -->
          <view class="card-footer">
            <view class="footer-left">
              <text class="freight-label">运费</text>
              <text class="freight-value">¥{{ item.freight }}</text>
              <text class="service-fee">(含服务费¥{{ item.serviceFee }})</text>
            </view>
            <view class="footer-right">
              <view class="action-btn detail" @tap="goToDetail(item)">
                <text class="btn-text">查看详情</text>
              </view>
              <view class="action-btn grab" @tap="handleGrab(item)">
                <text class="btn-text">立即抢单</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 空状态 -->
        <view class="empty-state" v-if="grabList.length === 0 && !loading">
          <text class="empty-icon">📦</text>
          <text class="empty-text">暂无货源</text>
          <text class="empty-hint">稍后再来看看吧</text>
        </view>

        <!-- 加载中 -->
        <view class="loading-state" v-if="loading">
          <text class="loading-text">加载中...</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.grab-page {
  min-height: 100vh;
  background: #f4f5f7;
}

.navbar-right {
  padding: 10rpx;

  .search-icon {
    font-size: 36rpx;
  }
}

.grab-content {
  padding: 180rpx 30rpx 30rpx;
}

// 筛选 Tab
.filter-tabs {
  display: flex;
  background: #fff;
  border-radius: 16rpx;
  padding: 8rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

  .filter-tab {
    flex: 1;
    text-align: center;
    padding: 16rpx 0;
    border-radius: 12rpx;
    transition: all 0.2s;

    .tab-text {
      font-size: 28rpx;
      color: #666;
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

// 货源列表
.grab-list {
  height: calc(100vh - 300rpx);
}

.grab-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20rpx;

  .goods-tags {
    display: flex;
    gap: 12rpx;

    .goods-tag {
      background: #e6f0ff;
      padding: 6rpx 16rpx;
      border-radius: 8rpx;

      .tag-text {
        font-size: 22rpx;
        color: #007aff;
      }

      &.weight {
        background: #fff7e6;

        .tag-text {
          color: #ff7a00;
        }
      }

      &.distance {
        background: #e6fff0;

        .tag-text {
          color: #00b578;
        }
      }
    }
  }

  .publish-time {
    font-size: 22rpx;
    color: #999;
  }
}

.address-section {
  padding: 20rpx 0;
  border-top: 1rpx solid #f0f0f0;
  border-bottom: 1rpx solid #f0f0f0;

  .address-item {
    display: flex;
    align-items: flex-start;

    .address-dot {
      font-size: 28rpx;
      margin-right: 12rpx;

      &.start {
        color: #007aff;
      }

      &.end {
        color: #00b578;
      }
    }

    .address-info {
      flex: 1;

      .address-label {
        font-size: 22rpx;
        color: #999;
        display: block;
        margin-bottom: 4rpx;
      }

      .address-text {
        font-size: 28rpx;
        color: #333;
      }
    }
  }

  .address-line {
    width: 4rpx;
    height: 24rpx;
    background: #ddd;
    margin-left: 6rpx;
    margin-top: 8rpx;
    margin-bottom: 8rpx;
  }
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20rpx;

  .footer-left {
    .freight-label {
      font-size: 24rpx;
      color: #999;
    }

    .freight-value {
      font-size: 40rpx;
      color: #ff7a00;
      font-weight: bold;
      margin-left: 8rpx;
    }

    .service-fee {
      font-size: 22rpx;
      color: #999;
      margin-left: 8rpx;
    }
  }

  .footer-right {
    display: flex;
    gap: 16rpx;

    .action-btn {
      padding: 16rpx 24rpx;
      border-radius: 30rpx;
      font-size: 26rpx;

      &.detail {
        background: #f0f0f0;

        .btn-text {
          color: #666;
        }
      }

      &.grab {
        background: linear-gradient(135deg, #ff7a00, #ff4500);

        .btn-text {
          color: #fff;
          font-weight: bold;
        }
      }
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
    color: #333;
    display: block;
  }

  .empty-hint {
    font-size: 26rpx;
    color: #999;
    display: block;
    margin-top: 10rpx;
  }
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
