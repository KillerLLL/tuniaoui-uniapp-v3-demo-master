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
  <view class="grab-page min-h-screen bg-zinc-100">
    <!-- 自定义导航栏 -->
    <CustomNavbar title="抢单大厅" :show-back="false">
      <template #right>
        <view
          class="navbar-right btn-press p-20rpx"
          @tap="uni.navigateTo({ url: '/biz-pages/driver/common/search' })"
        >
          <TnIcon name="search" size="40" />
        </view>
      </template>
    </CustomNavbar>

    <!-- 页面内容 -->
    <view class="grab-content px-30rpx pt-180rpx">
      <!-- 筛选 Tab - 玻璃态设计 -->
      <view class="filter-tabs glass-card p-8rpx mb-30rpx">
        <view
          v-for="(item, index) in filterList"
          :key="index"
          class="filter-tab flex-1 text-center py-16rpx rounded-btn transition-all duration-200"
          :class="filterIndex === index ? 'bg-primary text-white font-bold' : 'text-zinc-500'"
          @tap="handleFilterChange(index)"
        >
          <text class="text-28rpx">{{ item }}</text>
        </view>
      </view>

      <!-- 货源列表 -->
      <scroll-view scroll-y class="grab-list" :style="{ height: 'calc(100vh - 300rpx)' }">
        <!-- 货源卡片 -->
        <view
          v-for="(item, index) in grabList"
          :key="item.id"
          class="goods-card white-card mb-24rpx p-30rpx card-press"
          :class="`animate-list-item delay-${Math.min(index + 1, 20)}`"
        >
          <!-- 卡片头部：货物标签 + 发布时间 -->
          <view class="flex-between mb-20rpx">
            <view class="flex gap-12rpx">
              <TnTag type="primary" size="sm">{{ item.goodsType }}</TnTag>
              <TnTag type="warning" size="sm">{{ item.weight }}</TnTag>
              <TnTag type="success" size="sm">{{ item.distance }}</TnTag>
            </view>
            <text class="text-22rpx text-zinc-400">{{ item.publishTime }}</text>
          </view>

          <!-- 路线区域 -->
          <view class="route-section py-20rpx border-y border-zinc-100">
            <!-- 装货地 -->
            <view class="flex items-start">
              <view class="route-icon-box w-40rpx h-40rpx rounded-full bg-primary/10 flex-center mr-12rpx">
                <TnIcon name="start" size="24" color="#3b82f6" />
              </view>
              <view class="flex-1">
                <text class="text-22rpx text-zinc-400 block mb-4rpx">装货</text>
                <text class="text-28rpx text-zinc-700">{{ item.loadingAddress }}</text>
              </view>
            </view>
            <!-- 连接线 -->
            <view class="route-line w-4rpx h-24rpx bg-zinc-300 ml-18rpx my-8rpx" />
            <!-- 卸货地 -->
            <view class="flex items-start">
              <view class="route-icon-box w-40rpx h-40rpx rounded-full bg-success/10 flex-center mr-12rpx">
                <TnIcon name="location-fill" size="24" color="#10b981" />
              </view>
              <view class="flex-1">
                <text class="text-22rpx text-zinc-400 block mb-4rpx">卸货</text>
                <text class="text-28rpx text-zinc-700">{{ item.unloadingAddress }}</text>
              </view>
            </view>
          </view>

          <!-- 底部：运费 + 操作按钮 -->
          <view class="flex-between mt-20rpx">
            <view class="flex items-baseline">
              <text class="text-24rpx text-zinc-500">运费</text>
              <text class="text-40rpx font-bold text-orange ml-8rpx">¥{{ item.freight }}</text>
              <text class="text-22rpx text-zinc-400 ml-8rpx">(含服务费¥{{ item.serviceFee }})</text>
            </view>
            <view class="flex gap-16rpx">
              <TnButton type="info" plain size="sm" @click="goToDetail(item)">
                查看详情
              </TnButton>
              <TnButton type="warning" shape="round" shadow @click="handleGrab(item)" class="btn-press">
                立即抢单
              </TnButton>
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
            <text class="empty-hint text-26rpx text-zinc-400 mt-20rpx block">暂无货源，稍后再来看看吧</text>
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
