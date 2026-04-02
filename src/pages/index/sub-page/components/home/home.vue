<script lang="ts" setup>
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import TnSwiper from '@tuniao/tnui-vue3-uniapp/components/swiper/src/swiper.vue'
import TnIcon from '@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue'

// 轮播图数据
const swiperData = ref([
  'https://resource.tuniaokj.com/images/vue3/market/vue3-banner-1-min.jpg',
  'https://resource.tuniaokj.com/images/vue3/market/vue3-banner-2-min.jpg',
  'https://resource.tuniaokj.com/images/vue3/market/vue3-banner-3-min.jpg',
])

// 金刚区导航数据
const navData = ref([
  { icon: 'shop', name: '商城', color: '#fbbd08' },
  { icon: 'gift', name: '礼品', color: '#fa3534' },
  { icon: 'coupon', name: '优惠券', color: '#ff871f' },
  { icon: 'discover', name: '发现', color: '#1cbbb4' },
  { icon: 'topic', name: '话题', color: '#8799a3' },
  { icon: 'rank', name: '排行', color: '#ffc107' },
  { icon: 'message', name: '消息', color: '#007aff' },
  { icon: 'user', name: '我的', color: '#4cd964' },
])

// 推荐列表数据
const recommendList = ref([
  {
    id: 1,
    title: 'Vue3 全栈开发实战教程',
    desc: '从零开始学习Vue3全栈开发，包含前端和后端完整内容',
    image: 'https://resource.tuniaokj.com/images/vue3/banner/vue3-1-min.jpg',
    price: '¥99',
    tag: '热门',
  },
  {
    id: 2,
    title: 'UniApp 跨平台开发指南',
    desc: '一套代码多端运行，快速构建跨平台应用',
    image: 'https://resource.tuniaokj.com/images/vue3/banner/vue3-2-min.jpg',
    price: '¥79',
    tag: '推荐',
  },
  {
    id: 3,
    title: 'TypeScript 进阶课程',
    desc: '深入理解TypeScript高级特性，提升代码质量',
    image: 'https://resource.tuniaokj.com/images/vue3/banner/vue3-3-min.jpg',
    price: '¥89',
    tag: '新课',
  },
])

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
    <!-- 顶部搜索栏 -->
    <view class="search-bar tn-white_bg">
      <view class="search-box tn-flex tn-flex-col-center">
        <TnIcon name="search" color="#999" />
        <text class="placeholder">搜索你感兴趣的内容</text>
      </view>
      <view class="message-btn">
        <TnIcon name="message" size="48" />
      </view>
    </view>

    <!-- 轮播图 -->
    <view class="swiper-container">
      <TnSwiper
        v-model="swiperData"
        :autoplay="true"
        :interval="3000"
        :indicator="true"
        height="320rpx"
      />
    </view>

    <!-- 金刚区导航 -->
    <view class="nav-grid tn-white_bg">
      <view
        v-for="(item, index) in navData"
        :key="index"
        class="nav-item tn-flex tn-flex-col tn-flex-center"
      >
        <view class="nav-icon" :style="{ backgroundColor: item.color }">
          <TnIcon :name="item.icon" color="#fff" size="40" />
        </view>
        <text class="nav-name">{{ item.name }}</text>
      </view>
    </view>

    <!-- 推荐列表 -->
    <view class="recommend-section">
      <view class="section-header tn-flex tn-flex-col-center tn-flex-between">
        <view class="section-title">
          <text class="title-text">为你推荐</text>
          <view class="title-line" />
        </view>
        <view class="section-more">
          <text class="more-text">更多</text>
          <TnIcon name="right" size="24" />
        </view>
      </view>

      <view class="recommend-list">
        <view
          v-for="item in recommendList"
          :key="item.id"
          class="recommend-item tn-white_bg"
        >
          <view class="item-image">
            <image :src="item.image" mode="aspectFill" />
            <view v-if="item.tag" class="item-tag tn-type-primary_bg">
              {{ item.tag }}
            </view>
          </view>
          <view class="item-content">
            <view class="item-title">{{ item.title }}</view>
            <view class="item-desc tn-gray_text">{{ item.desc }}</view>
            <view class="item-footer tn-flex tn-flex-col-center tn-flex-between">
              <view class="item-price tn-type-error_text">{{ item.price }}</view>
              <view class="item-btn">查看详情</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.home-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;

  .search-bar {
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    padding: 20rpx 30rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

    .search-box {
      flex: 1;
      height: 70rpx;
      padding: 0 30rpx;
      margin-right: 20rpx;
      background-color: #f5f5f5;
      border-radius: 35rpx;

      .placeholder {
        margin-left: 10rpx;
        font-size: 28rpx;
        color: #999;
      }
    }

    .message-btn {
      padding: 10rpx;
    }
  }

  .swiper-container {
    margin: 20rpx 30rpx;
    border-radius: 20rpx;
    overflow: hidden;
  }

  .nav-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 30rpx;
    padding: 40rpx 30rpx;
    margin: 0 30rpx 30rpx;
    border-radius: 20rpx;

    .nav-item {
      .nav-icon {
        width: 100rpx;
        height: 100rpx;
        margin-bottom: 15rpx;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .nav-name {
        font-size: 24rpx;
        color: #333;
      }
    }
  }

  .recommend-section {
    padding: 0 30rpx 40rpx;

    .section-header {
      margin-bottom: 30rpx;
      padding: 0 10rpx;

      .section-title {
        position: relative;
        display: flex;
        align-items: center;

        .title-text {
          font-size: 36rpx;
          font-weight: bold;
          color: #333;
        }

        .title-line {
          width: 60rpx;
          height: 6rpx;
          margin-left: 20rpx;
          background: linear-gradient(90deg, #fbbd08, #fa3534);
          border-radius: 3rpx;
        }
      }

      .section-more {
        display: flex;
        align-items: center;
        font-size: 26rpx;
        color: #999;
      }
    }

    .recommend-list {
      .recommend-item {
        display: flex;
        margin-bottom: 30rpx;
        padding: 20rpx;
        border-radius: 20rpx;
        overflow: hidden;

        .item-image {
          position: relative;
          width: 240rpx;
          height: 180rpx;
          margin-right: 20rpx;
          border-radius: 15rpx;
          overflow: hidden;
          flex-shrink: 0;

          image {
            width: 100%;
            height: 100%;
          }

          .item-tag {
            position: absolute;
            top: 10rpx;
            left: 10rpx;
            padding: 4rpx 12rpx;
            font-size: 20rpx;
            color: #fff;
            border-radius: 8rpx;
          }
        }

        .item-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 10rpx 0;

          .item-title {
            font-size: 30rpx;
            font-weight: bold;
            color: #333;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .item-desc {
            font-size: 24rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }

          .item-footer {
            .item-price {
              font-size: 36rpx;
              font-weight: bold;
            }

            .item-btn {
              padding: 10rpx 30rpx;
              font-size: 24rpx;
              color: #fff;
              background: linear-gradient(90deg, #fbbd08, #fa3534);
              border-radius: 30rpx;
            }
          }
        }
      }
    }
  }
}
</style>
