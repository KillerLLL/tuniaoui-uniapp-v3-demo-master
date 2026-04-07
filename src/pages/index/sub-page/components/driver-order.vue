<script lang="ts" setup>
/**
 * 订单列表 - Tabbar子页面
 */
import { ref, onMounted } from 'vue'
import { getOrderListApi } from '@/api/driver'
import { ORDER_STATUS_CONFIG } from '@/utils/const'

// 订单列表
const orderList = ref<any[]>([])

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
const handleFilterChange = (index: number) => {
  if (filterIndex.value === index) return
  filterIndex.value = index
  loadData()
}

// 查看详情
const goToDetail = (item: any) => {
  uni.navigateTo({
    url: `/biz-pages/driver/order/detail?id=${item.id}`,
  })
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <view class="order-list-page min-h-screen bg-zinc-100">
    <!-- 顶部渐变导航栏 -->
    <view class="navbar-glass fixed top-0 left-0 right-0 z-50 safe-top">
      <view class="navbar-inner flex-center h-100rpx">
        <text class="text-white text-36rpx font-bold">我的订单</text>
      </view>
    </view>

    <!-- 页面内容 -->
    <view class="list-content pb-30rpx">
      <!-- 筛选 Tab -->
      <scroll-view scroll-x class="filter-scroll white-space-nowrap mx-30rpx mt-200rpx mb-24rpx relative z-10">
        <view class="filter-tabs inline-flex bg-white rounded-16rpx p-8rpx shadow-card">
          <view
            v-for="(item, index) in filterList"
            :key="index"
            class="filter-tab px-32rpx py-16rpx rounded-12rpx transition-all duration-200 card-press"
            :class="filterIndex === index ? 'bg-gradient-to-r from-primary-500 to-primary-600' : ''"
            @tap="handleFilterChange(index)"
          >
            <text
              class="text-28rpx font-medium"
              :class="filterIndex === index ? 'text-white' : 'text-zinc-600'"
            >
              {{ item.name }}
            </text>
          </view>
        </view>
      </scroll-view>

      <!-- 订单列表 -->
      <scroll-view scroll-y class="order-list mx-30rpx relative z-10">
        <view
          v-for="item in orderList"
          :key="item.id"
          class="order-card glass-card rounded-24rpx p-30rpx mb-24rpx card-press"
          @tap="goToDetail(item)"
        >
          <view class="flex-between mb-20rpx">
            <text class="text-zinc-500 text-26rpx">{{ item.orderNo }}</text>
            <view
              class="status-tag px-16rpx py-6rpx rounded-full"
              :style="{ background: `${ORDER_STATUS_CONFIG[item.status]?.color}20` }"
            >
              <text
                class="text-22rpx font-medium"
                :style="{ color: ORDER_STATUS_CONFIG[item.status]?.color || '#999' }"
              >
                {{ ORDER_STATUS_CONFIG[item.status]?.text || '未知' }}
              </text>
            </view>
          </view>

          <view class="card-body py-20rpx border-y border-zinc-100/50">
            <view class="goods-info flex items-center gap-16rpx mb-16rpx">
              <text class="text-zinc-800 text-28rpx font-bold">{{ item.goodsType }}</text>
              <text class="text-zinc-400 text-26rpx">{{ item.weight }}</text>
            </view>
            <view class="route-info">
              <view class="flex items-center gap-12rpx mb-8rpx">
                <view class="point-icon w-36rpx h-36rpx bg-primary-500/10 rounded-full flex-center">
                  <TnIcon name="start" size="20rpx" color="#3b82f6" />
                </view>
                <text class="text-zinc-600 text-26rpx flex-1 truncate">{{ item.loadingAddress }}</text>
              </view>
              <view class="route-line w-2rpx h-20rpx bg-zinc-300 ml-18rpx my-6rpx" />
              <view class="flex items-center gap-12rpx">
                <view class="point-icon w-36rpx h-36rpx bg-success-500/10 rounded-full flex-center">
                  <TnIcon name="location-fill" size="20rpx" color="#10b981" />
                </view>
                <text class="text-zinc-600 text-26rpx flex-1 truncate">{{ item.unloadingAddress }}</text>
              </view>
            </view>
          </view>

          <view class="flex-between mt-20rpx">
            <view class="flex items-baseline">
              <text class="text-zinc-500 text-24rpx">运费</text>
              <text class="text-warning-500 text-36rpx font-bold ml-8rpx">¥{{ item.freight }}</text>
            </view>
            <view class="flex items-center gap-4rpx text-primary-500">
              <text class="text-26rpx">查看详情</text>
              <TnIcon name="right" size="22rpx" color="#3b82f6" />
            </view>
          </view>
        </view>

        <!-- 空状态 -->
        <view
          v-if="orderList.length === 0 && !loading"
          class="empty-state py-100rpx text-center"
        >
          <view class="empty-icon w-160rpx h-160rpx mx-auto mb-30rpx bg-zinc-200/50 rounded-full flex-center">
            <TnIcon name="order" size="80rpx" color="#999" />
          </view>
          <text class="text-zinc-400 text-28rpx block">暂无订单</text>
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
.navbar-glass {
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.2);
}

// 玻璃态卡片
.glass-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1rpx solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.08);
}

// 路由连接线
.route-line {
  background: linear-gradient(to bottom, #d1d5db, #e5e7eb);
}
</style>
