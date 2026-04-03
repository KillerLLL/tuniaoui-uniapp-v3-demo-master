<script setup>
import { ref, onMounted } from 'vue'
import TnIcon from '@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue'
import TnSearchBox from '@tuniao/tnui-vue3-uniapp/components/search-box/src/search-box.vue'
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'

// 微信小程序 virtualHost 配置
defineOptions({
  options: {
    virtualHost: true,
  },
})

const SEARCH_HISTORY_KEY = 'searchHistory'
const MAX_HISTORY = 10

const keyword = ref('')
const searchHistory = ref([])
const hotKeywords = ref([
  '建材',
  '家具',
  '电器',
  '食品',
  '浦东新区',
  '闵行区',
  '松江区',
  '紧急货源',
])

// 页面加载时读取搜索历史
onMounted(() => {
  loadSearchHistory()
})

// 从 Storage 加载搜索历史
const loadSearchHistory = () => {
  try {
    const history = uni.getStorageSync(SEARCH_HISTORY_KEY)
    if (history) {
      searchHistory.value = JSON.parse(history)
    }
  } catch (e) {
    searchHistory.value = []
  }
}

// 保存搜索关键词到历史
const saveSearchHistory = (value) => {
  if (!value.trim()) return
  let list = [...searchHistory.value]
  // 去重：已存在则移到最前面
  const idx = list.indexOf(value)
  if (idx > -1) {
    list.splice(idx, 1)
  }
  list.unshift(value)
  // 限制最大数量
  if (list.length > MAX_HISTORY) {
    list = list.slice(0, MAX_HISTORY)
  }
  searchHistory.value = list
  uni.setStorageSync(SEARCH_HISTORY_KEY, JSON.stringify(list))
}

// 清除搜索历史
const clearHistory = () => {
  uni.showModal({
    title: '提示',
    content: '确认清除搜索历史？',
    success: (res) => {
      if (res.confirm) {
        searchHistory.value = []
        uni.removeStorageSync(SEARCH_HISTORY_KEY)
      }
    },
  })
}

// 删除单条搜索历史
const deleteHistoryItem = (index) => {
  searchHistory.value.splice(index, 1)
  uni.setStorageSync(SEARCH_HISTORY_KEY, JSON.stringify(searchHistory.value))
}

// 执行搜索：保存历史并跳转抢单Tab
const handleSearch = (value) => {
  const searchValue = typeof value === 'string' ? value : keyword.value
  if (!searchValue.trim()) {
    uni.showToast({ title: '请输入搜索内容', icon: 'none' })
    return
  }
  saveSearchHistory(searchValue)
  // 跳转到抢单Tab并传递搜索关键词
  uni.reLaunch({
    url: `/pages/index/index?tab=1&keyword=${encodeURIComponent(searchValue)}`,
  })
}

// 点击历史标签或热门标签搜索
const handleTagTap = (text) => {
  keyword.value = text
  handleSearch(text)
}
</script>

<template>
  <view class="search-page">
    <!-- 自定义导航栏 -->
    <CustomNavbar title="搜索" />

    <!-- 导航栏占位 -->
    <view class="navbar-placeholder" />

    <!-- 搜索框区域 -->
    <view class="search-box-wrap">
      <TnSearchBox
        v-model="keyword"
        shape="round"
        placeholder="搜索货源、地址、货物类型"
        :focus="true"
        @search="handleSearch"
      />
    </view>

    <!-- 搜索历史区域 -->
    <view v-if="searchHistory.length" class="section">
      <view class="section-header">
        <text class="section-title">搜索历史</text>
        <view class="clear-btn" @tap="clearHistory">
          <TnIcon name="delete" size="32" color="#999" />
          <text class="clear-text">清除</text>
        </view>
      </view>
      <view class="tag-list">
        <view
          v-for="(item, index) in searchHistory"
          :key="index"
          class="tag-item"
          @tap="handleTagTap(item)"
        >
          <text class="tag-text">{{ item }}</text>
          <view class="tag-delete" @tap.stop="deleteHistoryItem(index)">
            <TnIcon name="close" size="20" color="#ccc" />
          </view>
        </view>
      </view>
    </view>

    <!-- 热门搜索区域 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">热门搜索</text>
      </view>
      <view class="tag-list">
        <view
          v-for="(item, index) in hotKeywords"
          :key="index"
          class="tag-item hot-tag"
          @tap="handleTagTap(item)"
        >
          <text class="tag-text">{{ item }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.search-page {
  min-height: 100vh;
  background: #f4f5f7;
  padding-bottom: env(safe-area-inset-bottom);
}

.navbar-placeholder {
  padding-top: calc(var(--status-bar-height) + 88rpx + 30rpx);
}

// 搜索框区域
.search-box-wrap {
  padding: 0 24rpx 24rpx;
}

// 分区样式
.section {
  margin: 0 24rpx 30rpx;
  padding: 30rpx;
  background: #fff;
  border-radius: 20rpx;

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24rpx;
  }

  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
  }

  .clear-btn {
    display: flex;
    align-items: center;

    .clear-text {
      margin-left: 6rpx;
      font-size: 24rpx;
      color: #999;
    }
  }
}

// 标签列表
.tag-list {
  display: flex;
  flex-wrap: wrap;

  .tag-item {
    display: flex;
    align-items: center;
    margin: 0 16rpx 20rpx 0;
    padding: 12rpx 24rpx;
    background: #f4f5f7;
    border-radius: 30rpx;

    .tag-text {
      font-size: 26rpx;
      color: #666;
    }

    .tag-delete {
      margin-left: 8rpx;
      display: flex;
      align-items: center;
    }

    &.hot-tag {
      background: rgba(0, 122, 255, 0.08);

      .tag-text {
        color: #007aff;
      }
    }
  }
}
</style>
