<script lang="ts" setup>
/**
 * 抢单大厅页面
 * 显示货源列表，支持筛选和抢单
 */
import { onMounted, ref } from 'vue'
import CustomNavbar from '@/components/custom-navbar/index.vue'
import { getGrabListApi, grabOrderApi } from '@/api/driver'

// 货源列表
const grabList = ref<any[]>([])

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
const handleFilterChange = (index: number) => {
  if (filterIndex.value === index) return
  filterIndex.value = index
  loadData()
}

// 搜索
const handleSearch = () => {
  loadData()
}

// 查看详情
const goToDetail = (item: any) => {
  uni.navigateTo({
    url: `/biz-pages/driver/order/detail?id=${item.id}&type=grab`,
  })
}

// 抢单
const handleGrab = async (item: any) => {
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
        <view
          class="navbar-right"
          @tap="uni.navigateTo({ url: '/biz-pages/driver/common/search' })"
        >
          <TnIcon name="search" size="40" />
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
        <view v-for="item in grabList" :key="item.id" class="grab-card">
          <!-- 货物信息头部 -->
          <view class="card-header">
            <view class="goods-tags">
              <TnTag type="primary" size="sm">{{ item.goodsType }}</TnTag>
              <TnTag type="warning" size="sm">{{ item.weight }}</TnTag>
              <TnTag type="success" size="sm">{{ item.distance }}</TnTag>
            </view>
            <text class="publish-time">{{ item.publishTime }}</text>
          </view>

          <!-- 装卸地址 -->
          <view class="address-section">
            <view class="address-item">
              <view class="address-icon-box start">
                <TnIcon name="start" size="24" />
              </view>
              <view class="address-info">
                <text class="address-label">装货</text>
                <text class="address-text">{{ item.loadingAddress }}</text>
              </view>
            </view>
            <view class="address-line" />
            <view class="address-item">
              <view class="address-icon-box end">
                <TnIcon name="location-fill" size="24" />
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
              <TnButton type="info" plain size="sm" @click="goToDetail(item)"
                >查看详情</TnButton
              >
              <TnButton
                type="warning"
                shape="round"
                shadow
                @click="handleGrab(item)"
                >立即抢单</TnButton
              >
            </view>
          </view>
        </view>

        <!-- 空状态 -->
        <TnEmpty
          v-if="grabList.length === 0 && !loading"
          mode="goods"
          show-tips
        >
          <template #tips>
            <text class="empty-hint">暂无货源，稍后再来看看吧</text>
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
.grab-page {
  min-height: 100vh;
  background: #f5f6f8;
}

.navbar-right {
  padding: 10rpx;
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

    .address-icon-box {
      width: 40rpx;
      height: 40rpx;
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
    margin-left: 18rpx;
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
  }
}

.empty-hint {
  font-size: 26rpx;
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
