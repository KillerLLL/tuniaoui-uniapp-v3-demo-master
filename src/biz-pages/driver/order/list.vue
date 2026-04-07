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
  <view class="order-list-page min-h-screen bg-zinc-100">
    <!-- 自定义导航栏 -->
    <CustomNavbar title="我的订单" :show-back="false" />

    <!-- 页面内容 -->
    <view class="list-content pt-180rpx">
      <!-- 筛选 Tab - 横向滚动玻璃态 -->
      <scroll-view scroll-x class="filter-scroll whitespace-nowrap px-30rpx mb-24rpx">
        <view class="filter-tabs glass-card p-8rpx inline-flex">
          <view
            v-for="(item, index) in filterList"
            :key="index"
            class="filter-tab px-32rpx py-16rpx rounded-btn transition-all duration-200"
            :class="filterIndex === index ? 'bg-primary text-white font-bold' : 'text-zinc-500'"
            @tap="handleFilterChange(index)"
          >
            <text class="text-28rpx whitespace-nowrap">{{ item.name }}</text>
          </view>
        </view>
      </scroll-view>

      <!-- 订单列表 -->
      <scroll-view scroll-y class="order-list px-30rpx" :style="{ height: 'calc(100vh - 280rpx)' }">
        <view
          v-for="(item, index) in orderList"
          :key="item.id"
          class="order-card white-card mb-24rpx p-30rpx card-press animate-list-item"
          :class="`delay-${Math.min(index + 1, 20)}`"
          @tap="goToDetail(item)"
        >
          <!-- 卡片头部：订单号 + 状态标签 -->
          <view class="flex-between mb-20rpx">
            <text class="text-26rpx text-zinc-500">{{ item.orderNo }}</text>
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

          <!-- 卡片主体 -->
          <view class="card-body py-20rpx border-y border-zinc-100">
            <!-- 货物信息 -->
            <view class="flex gap-16rpx mb-16rpx">
              <text class="text-28rpx text-zinc-700 font-bold">{{ item.goodsType }}</text>
              <text class="text-26rpx text-zinc-400">{{ item.weight }}</text>
            </view>
            <!-- 路线信息 -->
            <view class="route-info">
              <view class="flex items-center mb-8rpx">
                <view class="route-icon-box w-36rpx h-36rpx rounded-full bg-primary/10 flex-center mr-12rpx">
                  <TnIcon name="start" size="20" color="#3b82f6" />
                </view>
                <text class="route-text text-26rpx text-zinc-600 truncate flex-1">{{ item.loadingAddress }}</text>
              </view>
              <view class="route-line w-4rpx h-20rpx bg-zinc-300 ml-16rpx my-6rpx" />
              <view class="flex items-center">
                <view class="route-icon-box w-36rpx h-36rpx rounded-full bg-success/10 flex-center mr-12rpx">
                  <TnIcon name="location-fill" size="20" color="#10b981" />
                </view>
                <text class="route-text text-26rpx text-zinc-600 truncate flex-1">{{ item.unloadingAddress }}</text>
              </view>
            </view>
          </view>

          <!-- 卡片底部 -->
          <view class="flex-between mt-20rpx">
            <text class="text-32rpx font-bold text-orange">运费: ¥{{ item.freight }}</text>
            <view class="flex items-center text-primary">
              <text class="text-26rpx">查看详情</text>
              <TnIcon name="right" size="22" color="#3b82f6" />
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
            <text class="empty-text text-32rpx text-zinc-400 mt-20rpx block">暂无订单</text>
          </template>
        </TnEmpty>

        <!-- 加载中 -->
        <view v-if="loading" class="loading-state text-center py-40rpx">
          <text class="loading-text text-28rpx text-zinc-400">加载中...</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<!-- 无需额外样式，UnoCSS 原子化类名已覆盖所有样式 -->
