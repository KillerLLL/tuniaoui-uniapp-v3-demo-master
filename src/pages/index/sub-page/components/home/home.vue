<script lang="ts" setup>
import { inject, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import TnSearchBox from '@tuniao/tnui-vue3-uniapp/components/search-box/src/search-box.vue'
import TnNoticeBar from '@tuniao/tnui-vue3-uniapp/components/notice-bar/src/notice-bar.vue'
import TnIcon from '@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue'
import TnTitle from '@tuniao/tnui-vue3-uniapp/components/title/src/title.vue'

import { indexPageContextKey } from '@/tokens'
import type { IndexPageContext } from '@/tokens'

// 获取页面切换方法
const indexPageContext = inject(indexPageContextKey) as IndexPageContext

// 搜索关键词
const searchValue = ref('')

// 通知栏数据
const noticeData = ref([
  'TuniaoUI Vue3 UniApp 版本已上线，欢迎使用',
  '新版本支持 60+ 组件，覆盖多种使用场景',
  '支持 H5、微信小程序、App 多端运行',
])

// 快捷导航数据 - 展示主要功能入口
const navData = ref([
  { icon: 'code', name: '基础组件', color: '#007aff', pageIndex: 2 },
  { icon: 'menu-circle-fill', name: '组件库', color: '#ff6b35', pageIndex: 3 },
  { icon: 'menu-list', name: '组件列表', color: '#00b578', pageIndex: 1 },
  { icon: 'logo-tuniao', name: '关于图鸟', color: '#e8485e', pageIndex: 4 },
])

// 特性展示数据
const featureData = ref([
  {
    icon: 'menu-fill',
    title: '60+ 组件',
    desc: '丰富的基础和业务组件',
    color: '#007aff',
    bg: 'rgba(0, 122, 255, 0.12)',
  },
  {
    icon: 'image-text-fill',
    title: '多端适配',
    desc: 'H5 / 小程序 / App',
    color: '#00b578',
    bg: 'rgba(0, 181, 120, 0.12)',
  },
  {
    icon: 'star-fill',
    title: 'Vue 3',
    desc: 'Composition API 支持',
    color: '#ff6b35',
    bg: 'rgba(255, 107, 53, 0.12)',
  },
  {
    icon: 'set-fill',
    title: '高度可定制',
    desc: '灵活的主题和样式配置',
    color: '#e8485e',
    bg: 'rgba(232, 72, 94, 0.12)',
  },
])

// 热门组件快捷入口
const hotComponents = ref([
  { icon: 'write', name: 'Button' },
  { icon: 'search', name: 'SearchBox' },
  { icon: 'order', name: 'Navbar' },
  { icon: 'folder', name: 'Tabs' },
  { icon: 'square', name: 'Popup' },
  { icon: 'calendar', name: 'Calendar' },
  { icon: 'circle', name: 'Swiper' },
  { icon: 'tag', name: 'Tag' },
])

// 搜索事件
const onSearch = (val: string) => {
  uni.showToast({ title: `搜索: ${val}`, icon: 'none' })
}

// 导航点击事件 - 跳转到对应页面
const onNavClick = (item: any) => {
  indexPageContext?.switchTab?.(item.pageIndex)
}

onShow(() => {
  console.log('首页显示')
})
</script>

// #ifdef MP-WEIXIN
<script lang="ts">
export default {
  options: {
    virtualHost: true,
  },
}
</script>
// #endif

<template>
  <view class="home-page">
    <!-- 顶部标题区域 -->
    <view class="header-area">
      <view class="greeting">
        <view class="greeting-text">
          <text class="greeting-title">TuniaoUI</text>
          <text class="greeting-sub">Vue3 UniApp 组件库</text>
        </view>
        <view class="greeting-logo">
          <TnIcon name="logo-tuniao" size="56" color="#fff" />
        </view>
      </view>
    </view>

    <!-- 搜索栏 -->
    <view class="search-area">
      <TnSearchBox
        v-model="searchValue"
        placeholder="搜索组件..."
        shape="round"
        :search-button="false"
        @search="onSearch"
      />
    </view>

    <!-- 通知栏 -->
    <view class="notice-area">
      <TnNoticeBar
        :data="noticeData"
        left-icon="sound"
        right-icon="right"
      />
    </view>

    <!-- 快捷导航 -->
    <view class="nav-section tn-white_bg">
      <view
        v-for="(item, index) in navData"
        :key="index"
        class="nav-item"
        @tap="onNavClick(item)"
      >
        <view class="nav-icon" :style="{ backgroundColor: item.color }">
          <TnIcon :name="item.icon" color="#fff" size="44" />
        </view>
        <text class="nav-name">{{ item.name }}</text>
      </view>
    </view>

    <!-- 特性展示 -->
    <view class="feature-section">
      <TnTitle title="核心特性" mode="vLine" size="lg" />
      <view class="feature-grid">
        <view
          v-for="(item, index) in featureData"
          :key="index"
          class="feature-card"
        >
          <view class="feature-icon" :style="{ backgroundColor: item.bg }">
            <TnIcon :name="item.icon" :color="item.color" size="48" />
          </view>
          <view class="feature-info">
            <text class="feature-title">{{ item.title }}</text>
            <text class="feature-desc">{{ item.desc }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 热门组件 -->
    <view class="hot-section">
      <TnTitle title="热门组件" mode="vLine" size="lg" />
      <view class="hot-grid tn-white_bg">
        <view
          v-for="(item, index) in hotComponents"
          :key="index"
          class="hot-item"
        >
          <view class="hot-icon">
            <TnIcon :name="item.icon" color="#007aff" size="44" />
          </view>
          <text class="hot-name">{{ item.name }}</text>
        </view>
      </view>
    </view>

    <!-- 页脚信息 -->
    <view class="footer-area">
      <text class="footer-text">TuniaoUI v3 · Made with ❤️</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.home-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: #f4f5f7;
  padding-bottom: env(safe-area-inset-bottom);

  // 顶部区域
  .header-area {
    padding: 40rpx 30rpx 30rpx;
    background: linear-gradient(135deg, #007aff, #00b578);

    .greeting {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .greeting-text {
        display: flex;
        flex-direction: column;

        .greeting-title {
          font-size: 48rpx;
          font-weight: bold;
          color: #fff;
        }

        .greeting-sub {
          margin-top: 8rpx;
          font-size: 28rpx;
          color: rgba(255, 255, 255, 0.9);
        }
      }

      .greeting-logo {
        width: 90rpx;
        height: 90rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.25);
        border-radius: 24rpx;
      }
    }
  }

  // 搜索栏
  .search-area {
    padding: 20rpx 30rpx;
    background: #fff;
  }

  // 通知栏
  .notice-area {
    margin: 20rpx 30rpx 0;
    border-radius: 16rpx;
    overflow: hidden;
  }

  // 快捷导航
  .nav-section {
    display: flex;
    justify-content: space-around;
    padding: 40rpx 20rpx;
    margin: 30rpx;
    border-radius: 24rpx;

    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;

      .nav-icon {
        width: 96rpx;
        height: 96rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 24rpx;
        margin-bottom: 16rpx;
      }

      .nav-name {
        font-size: 26rpx;
        color: #333;
      }
    }
  }

  // 特性展示
  .feature-section {
    padding: 0 30rpx;
    margin-bottom: 30rpx;

    .feature-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20rpx;
      margin-top: 24rpx;

      .feature-card {
        display: flex;
        align-items: center;
        padding: 28rpx 24rpx;
        background: #fff;
        border-radius: 20rpx;

        .feature-icon {
          width: 80rpx;
          height: 80rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 20rpx;
          margin-right: 20rpx;
          flex-shrink: 0;
        }

        .feature-info {
          display: flex;
          flex-direction: column;
          overflow: hidden;

          .feature-title {
            font-size: 28rpx;
            font-weight: bold;
            color: #333;
          }

          .feature-desc {
            font-size: 22rpx;
            color: #666;
            margin-top: 6rpx;
          }
        }
      }
    }
  }

  // 热门组件
  .hot-section {
    padding: 0 30rpx;
    margin-bottom: 30rpx;

    .hot-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20rpx;
      padding: 30rpx 20rpx;
      margin-top: 24rpx;
      border-radius: 24rpx;

      .hot-item {
        display: flex;
        flex-direction: column;
        align-items: center;

        .hot-icon {
          width: 88rpx;
          height: 88rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 122, 255, 0.1);
          border-radius: 20rpx;
          margin-bottom: 12rpx;
        }

        .hot-name {
          font-size: 24rpx;
          color: #333;
        }
      }
    }
  }

  // 页脚
  .footer-area {
    display: flex;
    justify-content: center;
    padding: 40rpx 0 60rpx;

    .footer-text {
      font-size: 24rpx;
      color: #ccc;
    }
  }
}
</style>
