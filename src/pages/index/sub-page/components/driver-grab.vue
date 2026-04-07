<script lang="ts" setup>
/**
 * 抢单大厅 - Tabbar子页面
 */
import { ref, onMounted } from 'vue'
import { getGrabListApi, grabOrderApi } from '@/api/driver'

// 货源列表
const grabList = ref<any[]>([])

// 筛选状态
const filterIndex = ref(0)
const filterList = ['全部', '待抢单', '附近优先']

// 加载状态
const loading = ref(false)

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const res = await getGrabListApi({
      nearby: filterIndex.value === 2,
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

// 搜索
const goToSearch = () => {
  uni.navigateTo({ url: '/biz-pages/driver/common/search' })
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <view class="grab-page min-h-screen bg-zinc-100">
    <!-- 顶部渐变背景 -->
    <view class="top-bg">
      <view class="top-gradient" />
    </view>

    <!-- 顶部导航栏 -->
    <view class="navbar-glass fixed top-0 left-0 right-0 z-50 safe-top">
      <view class="navbar-inner flex-between h-100rpx px-30rpx">
        <text class="text-white text-36rpx font-bold">抢单大厅</text>
        <view
          class="search-btn flex-center w-70rpx h-70rpx bg-white/20 backdrop-blur-md rounded-full card-press"
          @tap="goToSearch"
        >
          <TnIcon name="search" size="40rpx" color="#fff" />
        </view>
      </view>
    </view>

    <!-- 页面内容 -->
    <view class="grab-content pb-30rpx">
      <!-- 筛选 Tab -->
      <view class="filter-tabs mx-30rpx mt-200rpx relative z-10">
        <view
          v-for="(item, index) in filterList"
          :key="index"
          class="filter-tab flex-center flex-1 py-16rpx rounded-12rpx card-press transition-all duration-200"
          :class="filterIndex === index ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white' : 'bg-white text-zinc-600'"
          @tap="handleFilterChange(index)"
        >
          <text class="text-28rpx font-medium">{{ item }}</text>
        </view>
      </view>

      <!-- 货源列表 -->
      <scroll-view scroll-y class="grab-list mx-30rpx mt-20rpx relative z-10">
        <view
          v-for="item in grabList"
          :key="item.id"
          class="grab-card glass-card rounded-24rpx p-30rpx mb-24rpx card-press"
        >
          <!-- 货物信息头部 -->
          <view class="flex-between mb-20rpx">
            <view class="flex items-center gap-12rpx">
              <view class="goods-tag bg-primary-500/10 px-16rpx py-6rpx rounded-lg">
                <text class="text-primary-500 text-22rpx font-medium">{{ item.goodsType }}</text>
              </view>
              <view class="goods-tag bg-warning-500/10 px-16rpx py-6rpx rounded-lg">
                <text class="text-warning-500 text-22rpx font-medium">{{ item.weight }}</text>
              </view>
              <view class="goods-tag bg-success-500/10 px-16rpx py-6rpx rounded-lg">
                <text class="text-success-500 text-22rpx font-medium">{{ item.distance }}</text>
              </view>
            </view>
            <text class="text-zinc-400 text-22rpx">{{ item.publishTime }}</text>
          </view>

          <!-- 装卸地址 -->
          <view class="address-section py-20rpx border-y border-zinc-100/50">
            <!-- 装货 -->
            <view class="flex items-start gap-16rpx">
              <view class="point-icon w-44rpx h-44rpx bg-primary-500/10 rounded-full flex-center">
                <TnIcon name="start" size="26rpx" color="#3b82f6" />
              </view>
              <view class="flex-1">
                <text class="text-zinc-500 text-22rpx">装货</text>
                <text class="text-zinc-800 text-28rpx block mt-4rpx">{{ item.loadingAddress }}</text>
              </view>
            </view>
            <!-- 连接线 -->
            <view class="route-line w-2rpx h-30rpx bg-zinc-300 ml-21rpx my-8rpx" />
            <!-- 卸货 -->
            <view class="flex items-start gap-16rpx">
              <view class="point-icon w-44rpx h-44rpx bg-success-500/10 rounded-full flex-center">
                <TnIcon name="location-fill" size="26rpx" color="#10b981" />
              </view>
              <view class="flex-1">
                <text class="text-zinc-500 text-22rpx">卸货</text>
                <text class="text-zinc-800 text-28rpx block mt-4rpx">{{ item.unloadingAddress }}</text>
              </view>
            </view>
          </view>

          <!-- 底部信息 -->
          <view class="flex-between mt-20rpx">
            <view class="flex items-baseline">
              <text class="text-zinc-500 text-24rpx">运费</text>
              <text class="text-warning-500 text-44rpx font-bold ml-8rpx">¥{{ item.freight }}</text>
            </view>
            <view class="flex items-center gap-16rpx">
              <view
                class="detail-btn px-24rpx py-16rpx bg-zinc-100 rounded-30rpx card-press"
                @tap.stop="goToDetail(item)"
              >
                <text class="text-zinc-600 text-26rpx">查看详情</text>
              </view>
              <view
                class="grab-btn px-30rpx py-16rpx bg-gradient-to-r from-warning-500 to-danger-500 rounded-30rpx shadow-lg shadow-warning-500/30 card-press"
                @tap.stop="handleGrab(item)"
              >
                <text class="text-white text-26rpx font-bold">立即抢单</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 空状态 -->
        <view
          v-if="grabList.length === 0 && !loading"
          class="empty-state py-100rpx text-center"
        >
          <view class="empty-icon w-160rpx h-160rpx mx-auto mb-30rpx bg-zinc-200/50 rounded-full flex-center">
            <TnIcon name="order" size="80rpx" color="#999" />
          </view>
          <text class="text-zinc-400 text-28rpx block">暂无货源</text>
        </view>

        <!-- 加载中 -->
        <view v-if="loading" class="loading-state py-60rpx text-center">
          <text class="text-zinc-400 text-26rpx">加载中...</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
// 顶部渐变背景
.top-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 350rpx;
  z-index: 1;
  overflow: hidden;

  .top-gradient {
    width: 100%;
    height: 100%;
    background: linear-gradient(
      135deg,
      #f59e0b 0%,
      #f97316 25%,
      #ef4444 50%,
      #dc2626 75%,
      #b91c1c 100%
    );
    border-radius: 0 0 80rpx 80rpx;
  }
}

// 导航栏玻璃态
.navbar-glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.2);
}

// 玻璃态卡片
.glass-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1rpx solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.08);
}

// 路由连接线
.route-line {
  background: linear-gradient(to bottom, #d1d5db, #e5e7eb);
}

// 抢单按钮阴影
.grab-btn {
  box-shadow: 0 8rpx 16rpx rgba(245, 158, 11, 0.3);
}
</style>
