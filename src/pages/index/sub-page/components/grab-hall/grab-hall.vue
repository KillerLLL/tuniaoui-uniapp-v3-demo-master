<script setup>
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import TnIcon from '@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue'
import TnSearchBox from '@tuniao/tnui-vue3-uniapp/components/search-box/src/search-box.vue'
import TnTabs from '@tuniao/tnui-vue3-uniapp/components/tabs/src/tabs.vue'
import TnTabsItem from '@tuniao/tnui-vue3-uniapp/components/tabs/src/tabs-item.vue'
import TnEmpty from '@tuniao/tnui-vue3-uniapp/components/empty/src/empty.vue'
import CargoCard from '@/components/cargo-card/cargo-card.vue'
import { getCargoListApi, grabOrderApi } from '@/api/order'

// 搜索关键词
const searchValue = ref('')
// 当前筛选 Tab
const currentTab = ref(0)
// 货源列表
const cargoList = ref([])
// 加载状态
const loading = ref(false)

// 筛选 Tab 配置
const filterTabs = [
  { title: '全部' },
  { title: '待抢单' },
  { title: '附近优先' },
]

// Tab 切换
const onTabChange = (index) => {
  currentTab.value = index
  loadData()
}

// 搜索事件
const onSearch = (val) => {
  searchValue.value = val
  loadData()
}

// 抢单
const onGrab = async (cargo) => {
  try {
    uni.showLoading({ title: '抢单中...' })
    await grabOrderApi(cargo.id)
    uni.hideLoading()
    uni.showToast({ title: '抢单成功！', icon: 'success' })
    // 从列表中移除已抢的货源
    cargoList.value = cargoList.value.filter((item) => item.id !== cargo.id)
  } catch (e) {
    uni.hideLoading()
    uni.showToast({ title: e.message || '抢单失败', icon: 'none' })
  }
}

// 加载货源数据
const loadData = async () => {
  loading.value = true
  try {
    const res = await getCargoListApi({
      tab: currentTab.value,
      keyword: searchValue.value,
    })
    cargoList.value = res.data.list
  } catch (e) {
    console.error('加载货源失败', e)
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
  <view class="grab-hall">
    <!-- 自定义顶部栏 -->
    <view class="top-bar">
      <view class="status-bar-placeholder" />
      <view class="navbar">
        <text class="navbar-title">抢单大厅</text>
      </view>
    </view>

    <!-- 搜索框 -->
    <view class="search-area">
      <TnSearchBox
        v-model="searchValue"
        placeholder="搜索出发地/目的地..."
        shape="round"
        :search-button="false"
        @search="onSearch"
      />
    </view>

    <!-- 筛选标签 -->
    <view class="filter-tabs">
      <TnTabs v-model="currentTab" active-color="#007AFF" @change="onTabChange">
        <TnTabsItem
          v-for="(tab, index) in filterTabs"
          :key="index"
          :title="tab.title"
        />
      </TnTabs>
    </view>

    <!-- 货源列表 -->
    <view class="cargo-list">
      <template v-if="cargoList.length">
        <CargoCard
          v-for="item in cargoList"
          :key="item.id"
          :cargo="item"
          @grab-click="onGrab"
        />
      </template>
      <TnEmpty v-else mode="data" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.grab-hall {
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

  // 搜索区域
  .search-area {
    padding: 20rpx 30rpx;
    background: #fff;
  }

  // 筛选标签
  .filter-tabs {
    background: #fff;
    padding: 0 10rpx;
  }

  // 货源列表
  .cargo-list {
    padding: 24rpx 30rpx 0;
  }
}
</style>
