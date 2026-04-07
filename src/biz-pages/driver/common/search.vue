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
  <view class="search-page min-h-screen bg-gray-100">
    <!-- 自定义导航栏 -->
    <CustomNavbar title="搜索" />

    <!-- 页面内容 -->
    <view class="search-content px-6 pt-45">
      <!-- 搜索框 -->
      <view class="search-box glass-card rounded-full px-4 py-2 flex items-center mb-6">
        <input
          v-model="searchKey"
          class="search-input flex-1 h-9 text-sm"
          placeholder="搜索货源"
          placeholder-class="input-placeholder"
          @confirm="handleSearch"
        />
        <view class="search-btn bg-gradient-to-r from-primary to-blue-400 px-4 py-2 rounded-full btn-press" @tap="handleSearch">
          <text class="text-sm text-white">搜索</text>
        </view>
      </view>

      <!-- 搜索历史 -->
      <view v-if="historyList.length > 0" class="history-section mb-6">
        <view class="section-header flex justify-between items-center mb-4">
          <text class="section-title text-base font-bold text-gray-800">搜索历史</text>
          <text class="clear-btn text-sm text-gray-400 btn-press" @tap="clearHistory">清空</text>
        </view>
        <view class="history-tags flex flex-wrap gap-3">
          <view
            v-for="(item, index) in historyList"
            :key="index"
            class="history-tag glass-card px-4 py-2 rounded-full card-press"
            @tap="searchKey = item"
          >
            <text class="tag-text text-sm text-gray-600">{{ item }}</text>
          </view>
        </view>
      </view>

      <!-- 热门搜索 -->
      <view class="hot-section mb-6">
        <view class="section-header flex justify-between items-center mb-4">
          <text class="section-title text-base font-bold text-gray-800">热门搜索</text>
        </view>
        <view class="hot-tags flex flex-wrap gap-3">
          <view
            v-for="(item, index) in hotList"
            :key="index"
            class="hot-tag glass-card px-4 py-2 rounded-full card-press"
            @tap="searchKey = item"
          >
            <text class="tag-text text-sm text-gray-600">{{ item }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
/* 使用 UnoCSS 原子化类名 */

/* 玻璃态卡片效果 */
.glass-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20rpx);
  -webkit-backdrop-filter: blur(20rpx);
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.04);
}

/* 按钮按压效果 */
.btn-press {
  transition: transform 0.15s ease, opacity 0.15s ease;

  &:active {
    transform: scale(0.96);
    opacity: 0.9;
  }
}

/* 卡片按压效果 */
.card-press {
  transition: transform 0.2s ease, opacity 0.2s ease;

  &:active {
    transform: scale(0.95);
    opacity: 0.9;
  }
}

/* 输入框占位符样式 */
.input-placeholder {
  color: #bbb;
  font-size: 28rpx;
}

/* 搜索按钮渐变阴影 */
.search-btn {
  box-shadow: 0 2rpx 10rpx rgba(59, 130, 246, 0.3);
}
</style>
