<script lang="ts" setup>
/**
 * 搜索页面
 */
import { ref } from 'vue'
import CustomNavbar from '@/components/custom-navbar/index.vue'

// 搜索关键词
const searchKey = ref('')

// 搜索历史
const historyList = ref(['电子产品', '家具', '北京朝阳'])

// 热门搜索
const hotList = ref([
  '电子产品',
  '家具家居',
  '食品饮料',
  '建材装饰',
  '服装鞋帽',
])

// 搜索
const handleSearch = () => {
  if (!searchKey.value.trim()) return
  uni.showToast({ title: `搜索: ${searchKey.value}`, icon: 'none' })
}

// 清空历史
const clearHistory = () => {
  historyList.value = []
}
</script>

<template>
  <view class="search-page">
    <!-- 自定义导航栏 -->
    <CustomNavbar title="搜索" />

    <!-- 页面内容 -->
    <view class="search-content">
      <!-- 搜索框 -->
      <view class="search-box">
        <input
          v-model="searchKey"
          class="search-input"
          placeholder="搜索货源"
          placeholder-class="input-placeholder"
          @confirm="handleSearch"
        />
        <view class="search-btn" @tap="handleSearch">
          <text>搜索</text>
        </view>
      </view>

      <!-- 搜索历史 -->
      <view v-if="historyList.length > 0" class="history-section">
        <view class="section-header">
          <text class="section-title">搜索历史</text>
          <text class="clear-btn" @tap="clearHistory">清空</text>
        </view>
        <view class="history-tags">
          <view
            v-for="(item, index) in historyList"
            :key="index"
            class="history-tag"
            @tap="searchKey = item"
          >
            <text class="tag-text">{{ item }}</text>
          </view>
        </view>
      </view>

      <!-- 热门搜索 -->
      <view class="hot-section">
        <view class="section-header">
          <text class="section-title">热门搜索</text>
        </view>
        <view class="hot-tags">
          <view
            v-for="(item, index) in hotList"
            :key="index"
            class="hot-tag"
            @tap="searchKey = item"
          >
            <text class="tag-text">{{ item }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.search-page {
  min-height: 100vh;
  background: #f4f5f7;
}

.search-content {
  padding: 180rpx 30rpx 30rpx;
}

.search-box {
  display: flex;
  background: #fff;
  border-radius: 48rpx;
  padding: 10rpx 10rpx 10rpx 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

  .search-input {
    flex: 1;
    height: 70rpx;
    font-size: 28rpx;
  }

  .input-placeholder {
    color: #bbb;
    font-size: 28rpx;
  }

  .search-btn {
    background: linear-gradient(135deg, #007aff, #00b4ff);
    padding: 16rpx 32rpx;
    border-radius: 36rpx;

    text {
      color: #fff;
      font-size: 28rpx;
    }
  }
}

.history-section,
.hot-section {
  margin-bottom: 30rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;

  .section-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
  }

  .clear-btn {
    font-size: 26rpx;
    color: #999;
  }
}

.history-tags,
.hot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.history-tag,
.hot-tag {
  background: #fff;
  padding: 16rpx 24rpx;
  border-radius: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.04);

  .tag-text {
    font-size: 26rpx;
    color: #666;
  }
}
</style>
