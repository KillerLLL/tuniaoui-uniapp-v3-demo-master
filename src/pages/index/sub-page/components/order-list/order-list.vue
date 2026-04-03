<script setup>
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import TnIcon from '@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue'
import TnTabs from '@tuniao/tnui-vue3-uniapp/components/tabs/src/tabs.vue'
import TnTabsItem from '@tuniao/tnui-vue3-uniapp/components/tabs/src/tabs-item.vue'
import TnEmpty from '@tuniao/tnui-vue3-uniapp/components/empty/src/empty.vue'
import OrderCard from '@/components/order-card/order-card.vue'
import { getOrderListApi } from '@/api/order'

// 当前状态 Tab
const currentTab = ref(0)
// 订单列表
const orderList = ref([])
// 加载状态
const loading = ref(false)

// 状态筛选 Tab
const statusTabs = [
  { title: '全部', status: '' },
  { title: '待提货', status: 0 },
  { title: '已提货', status: 1 },
  { title: '运输中', status: 2 },
  { title: '已完成', status: 4 },
]

// Tab 切换
const onTabChange = (index) => {
  currentTab.value = index
  loadData()
}

// 点击订单卡片
const onOrderClick = (order) => {
  uni.navigateTo({ url: `/biz-pages/driver/order-detail/index?id=${order.id}` })
}

// 加载订单数据
const loadData = async () => {
  loading.value = true
  try {
    const status = statusTabs[currentTab.value].status
    const params = {}
    if (status !== '') {
      params.status = status
    }
    const res = await getOrderListApi(params)
    orderList.value = res.data.list
  } catch (e) {
    console.error('加载订单失败', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

onShow(() => {
  loadData()
})
</script>

// #ifdef MP-WEIXIN
<script>
export default {
  options: {
    virtualHost: true,
  },
}
</script>
// #endif

<template>
  <view class="order-list-page">
    <!-- 自定义顶部栏 -->
    <view class="top-bar">
      <view class="status-bar-placeholder" />
      <view class="navbar">
        <text class="navbar-title">我的订单</text>
      </view>
    </view>

    <!-- 状态筛选 -->
    <view class="status-tabs">
      <TnTabs v-model="currentTab" active-color="#007AFF" scroll @change="onTabChange">
        <TnTabsItem
          v-for="(tab, index) in statusTabs"
          :key="index"
          :title="tab.title"
        />
      </TnTabs>
    </view>

    <!-- 订单列表 -->
    <view class="order-list">
      <template v-if="orderList.length">
        <OrderCard
          v-for="item in orderList"
          :key="item.id"
          :order="item"
          @click="onOrderClick"
        />
      </template>
      <TnEmpty v-else mode="order" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.order-list-page {
  min-height: 100vh;
  background: #f4f5f7;
  padding-bottom: 200rpx;

  // 顶部栏
  .top-bar {
    background: linear-gradient(135deg, #007AFF, #00B4FF);

    .status-bar-placeholder {
      height: var(--status-bar-height, 44px);
    }

    .navbar {
      height: 88rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 30rpx;

      .navbar-title {
        font-size: 34rpx;
        font-weight: bold;
        color: #fff;
      }
    }
  }

  // 状态筛选
  .status-tabs {
    background: #fff;
    padding: 0 10rpx;
  }

  // 订单列表
  .order-list {
    padding: 24rpx 30rpx 0;
  }
}
</style>
