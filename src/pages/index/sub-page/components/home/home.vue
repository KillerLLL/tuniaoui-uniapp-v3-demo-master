<script lang="ts" setup>
import { reactive, ref } from 'vue'
import TnIcon from '@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue'

// 当前位置
const currentCity = ref('宁波')

// 功能入口
const navItems = reactive([
  {
    id: 1,
    name: '接单大厅',
    icon: 'file-fill',
    bg: 'linear-gradient(135deg, #00b42a, #23c55d)',
  },
  {
    id: 2,
    name: '车辆管理',
    icon: 'car-fill',
    bg: 'linear-gradient(135deg, #722ed1, #b37fec)',
  },
  {
    id: 3,
    name: '创建订单',
    icon: 'calendar-fill',
    bg: 'linear-gradient(135deg, #faad14, #fadb14)',
  },
  {
    id: 4,
    name: '推荐有礼',
    icon: 'money-fill',
    bg: 'linear-gradient(135deg, #4080ff, #69b1ff)',
  },
  {
    id: 5,
    name: '帮助中心',
    icon: 'book-fill',
    bg: 'linear-gradient(135deg, #f53f3f, #ff7875)',
  },
])

// 消息通知
const notifications = reactive([
  {
    id: 1,
    type: 'logo',
    text: '恭喜张师傅推荐的货主XXX已完成注册！',
    hasDot: true,
  },
  {
    id: 2,
    type: 'voice',
    text: '张师傅推荐的货主完成下单,获提成200元',
    hasDot: true,
  },
  {
    id: 3,
    type: 'guide',
    text: '如何推荐获得提成？点击一下立刻赚钱！',
    hasDot: false,
  },
])

// Tab 数据
const tabs = reactive(['推荐运单', '货源地', '车找货'])
const activeTab = ref(0)

// 筛选选项
const filters = reactive(['智能模式', '离我最近', '价格最优', '时间最优'])
const activeFilter = ref(0)

// 运单列表
const orderList = reactive([
  {
    id: '892347',
    fromProvince: '浙江',
    fromCity: '宁波',
    toProvince: '江苏',
    toCity: '南京',
    publishTime: '10:56发布',
    distance: '约260km',
    truckLens: ['2.7米', '4.3米', '6.8米'],
    truckTypes: ['平板', '厢式', '高栏'],
    loadTime: '9月10日上午10:00装货',
    goods: '认养一头牛纯牛奶 | 18吨',
    price: '2500',
    urgent: false,
  },
])

// Tab 切换
const onTabClick = (index: number) => {
  activeTab.value = index
}

// 筛选切换
const onFilterClick = (index: number) => {
  activeFilter.value = index
}

// 接单
const takeOrder = (order: any) => {
  uni.showToast({ title: `接单 ${order.id}`, icon: 'none' })
}

// 底部 Tab
const bottomTabs = reactive([
  {
    id: 1,
    name: '首页',
    icon: 'home',
    activeIcon: 'home-fill',
    selected: true,
  },
  {
    id: 2,
    name: '任务',
    icon: 'task',
    activeIcon: 'task-fill',
    selected: false,
  },
  {
    id: 3,
    name: '消息',
    icon: 'chat',
    activeIcon: 'chat-fill',
    selected: false,
  },
  { id: 4, name: '我的', icon: 'my', activeIcon: 'my-fill', selected: false },
])

const onBottomTabClick = (tab: any) => {
  bottomTabs.forEach((t) => (t.selected = false))
  tab.selected = true
}
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
  <view class="logistics-app">
    <!-- 顶部导航栏 -->
    <view class="top-nav">
      <view class="location-selector">
        <TnIcon name="location-fill" size="16" color="#1677ff" />
        <text class="city-name">{{ currentCity }}</text>
        <TnIcon name="down" size="10" color="#666" />
      </view>
      <view class="search-btn">
        <TnIcon name="search" size="20" color="#666" />
      </view>
    </view>

    <!-- 轮播Banner -->
    <view class="banner-section">
      <swiper class="banner-swiper" indicator-dots autoplay circular>
        <swiper-item v-for="item in [1, 2]" :key="item">
          <view class="banner-item">
            <!-- 渐变背景 + 网格装饰 -->
            <view class="banner-bg">
              <view class="grid-lines" />
            </view>
            <!-- 左侧文字 -->
            <view class="banner-content">
              <text class="banner-title">数字化经营管理</text>
              <text class="banner-subtitle"
                >高效速运,智慧物流,线上线下一体化运输</text
              >
              <view class="banner-btn">立即体验</view>
            </view>
            <!-- 右侧插画 -->
            <view class="banner-illustration">
              <!-- 3D货车效果 -->
              <view class="truck-container">
                <view class="truck-body">
                  <TnIcon name="car-fill" size="60" color="#fff" />
                </view>
                <view class="cargo-area">
                  <view class="cargo-box" />
                </view>
              </view>
            </view>
            <!-- 轮播指示器 -->
            <view class="banner-indicators">
              <view class="indicator active" />
              <view class="indicator" />
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <!-- 功能入口 -->
    <view class="nav-grid">
      <view v-for="item in navItems" :key="item.id" class="nav-item">
        <view class="nav-icon" :style="{ background: item.bg }">
          <TnIcon :name="item.icon" size="22" color="#fff" />
        </view>
        <text class="nav-name">{{ item.name }}</text>
      </view>
    </view>

    <!-- 消息通知区 -->
    <view class="notice-section">
      <view class="notice-list">
        <view
          v-for="notice in notifications"
          :key="notice.id"
          class="notice-item"
        >
          <view class="notice-left">
            <view v-if="notice.type === 'logo'" class="notice-logo">
              广盈快讯
            </view>
            <view v-else-if="notice.type === 'guide'" class="notice-guide">
              攻略
            </view>
            <TnIcon v-else name="voice" size="14" color="#1677ff" />
            <text class="notice-text">{{ notice.text }}</text>
          </view>
          <view class="notice-right">
            <TnIcon name="right" size="12" color="#ccc" />
            <view v-if="notice.hasDot" class="notice-dot" />
          </view>
        </view>
      </view>
    </view>

    <!-- 运单列表 -->
    <view class="order-section">
      <!-- Tab栏 -->
      <view class="tab-bar">
        <view
          v-for="(tab, index) in tabs"
          :key="index"
          class="tab-item"
          :class="{ active: activeTab === index }"
          @tap="onTabClick(index)"
        >
          <text class="tab-text">{{ tab }}</text>
        </view>
      </view>

      <!-- 筛选栏 -->
      <view class="filter-bar">
        <view
          v-for="(filter, index) in filters"
          :key="index"
          class="filter-item"
          :class="{ active: activeFilter === index }"
          @tap="onFilterClick(index)"
        >
          {{ filter }}
        </view>
        <view class="sort-btn">
          <TnIcon name="sort" size="14" color="#666" />
        </view>
      </view>

      <!-- 运单卡片 -->
      <view class="order-list">
        <view v-for="order in orderList" :key="order.id" class="order-card">
          <!-- 线路信息 -->
          <view class="card-route">
            <view class="route-line">
              <text class="route-city"
                >{{ order.fromProvince }}-{{ order.fromCity }}</text
              >
              <view class="route-arrow">
                <TnIcon name="right" size="16" color="#1677ff" />
              </view>
              <text class="route-city"
                >{{ order.toProvince }}-{{ order.toCity }}</text
              >
            </view>
            <view class="route-meta">
              <text class="publish-time">{{ order.publishTime }}</text>
              <text class="distance">{{ order.distance }}</text>
            </view>
          </view>

          <!-- 车辆要求 -->
          <view class="truck-requirements">
            <view
              v-for="len in order.truckLens"
              :key="len"
              class="req-tag truck-len"
            >
              {{ len }}
            </view>
            <view
              v-for="type in order.truckTypes"
              :key="type"
              class="req-tag truck-type"
            >
              {{ type }}
            </view>
          </view>

          <!-- 装货信息 -->
          <view class="load-info">
            <view class="info-row">
              <TnIcon name="clock" size="13" color="#999" />
              <text class="info-text">{{ order.loadTime }}</text>
            </view>
            <view class="info-row">
              <TnIcon name="goods-fill" size="13" color="#999" />
              <text class="info-text">{{ order.goods }}</text>
            </view>
          </view>

          <!-- 价格和按钮 -->
          <view class="card-footer">
            <view class="price-info">
              <text class="price-value">{{ order.price }}</text>
              <text class="price-unit">元/趟</text>
            </view>
            <view
              class="take-btn"
              :class="{ urgent: order.urgent }"
              @tap="takeOrder(order)"
            >
              立即接单
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部Tab栏 -->
    <view class="bottom-tabbar">
      <view
        v-for="tab in bottomTabs"
        :key="tab.id"
        class="tab-item"
        :class="{ active: tab.selected }"
        @tap="onBottomTabClick(tab)"
      >
        <TnIcon
          :name="tab.selected ? tab.activeIcon : tab.icon"
          size="22"
          :color="tab.selected ? '#1677ff' : '#666'"
        />
        <text class="tab-label" :class="{ active: tab.selected }">{{
          tab.name
        }}</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.logistics-app {
  min-height: 100vh;
  background-color: #f0f2f5;
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
}

// 顶部导航栏
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 32rpx;
  padding-top: calc(20rpx + env(safe-area-inset-top));
  background: #e6f2ff;

  .location-selector {
    display: flex;
    align-items: center;
    gap: 6rpx;

    .city-name {
      font-size: 28rpx;
      font-weight: 500;
      color: #1a1a1a;
    }
  }

  .search-btn {
    width: 64rpx;
    height: 64rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
  }
}

// Banner轮播
.banner-section {
  margin: 20rpx 32rpx;
  border-radius: 16rpx;
  overflow: hidden;

  .banner-swiper {
    width: 100%;
    height: 280rpx;

    .banner-item {
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;

      .banner-bg {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #e6f4ff 0%, #bae0ff 100%);

        .grid-lines {
          position: absolute;
          right: 0;
          top: 0;
          width: 50%;
          height: 100%;
          background-image: linear-gradient(
              rgba(22, 119, 255, 0.05) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(22, 119, 255, 0.05) 1px,
              transparent 1px
            );
          background-size: 20rpx 20rpx;
        }
      }

      .banner-content {
        position: relative;
        z-index: 1;
        padding: 36rpx 32rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 55%;

        .banner-title {
          font-size: 36rpx;
          font-weight: bold;
          color: #1677ff;
          margin-bottom: 12rpx;
        }

        .banner-subtitle {
          font-size: 22rpx;
          color: #666;
          line-height: 1.5;
          margin-bottom: 20rpx;
        }

        .banner-btn {
          width: 140rpx;
          height: 56rpx;
          background: #1677ff;
          border-radius: 28rpx;
          font-size: 24rpx;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      .banner-illustration {
        position: absolute;
        right: 24rpx;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1;

        .truck-container {
          display: flex;
          flex-direction: column;
          align-items: center;

          .truck-body {
            width: 140rpx;
            height: 100rpx;
            background: linear-gradient(135deg, #1677ff, #69b1ff);
            border-radius: 12rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8rpx 24rpx rgba(22, 119, 255, 0.3);
          }

          .cargo-area {
            width: 100rpx;
            height: 60rpx;
            background: linear-gradient(135deg, #ff7a45, #ffa94d);
            border-radius: 8rpx;
            margin-top: -4rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4rpx 16rpx rgba(255, 122, 69, 0.4);

            .cargo-box {
              width: 60rpx;
              height: 40rpx;
              background: rgba(255, 255, 255, 0.3);
              border-radius: 4rpx;
            }
          }
        }
      }

      .banner-indicators {
        position: absolute;
        right: 32rpx;
        bottom: 20rpx;
        display: flex;
        gap: 8rpx;

        .indicator {
          width: 12rpx;
          height: 6rpx;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 3rpx;

          &.active {
            width: 24rpx;
            background: #fff;
          }
        }
      }
    }
  }
}

// 功能入口
.nav-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12rpx;
  padding: 24rpx 32rpx;
  background: #fff;
  margin: 0 32rpx;
  border-radius: 16rpx;

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10rpx;

    .nav-icon {
      width: 76rpx;
      height: 76rpx;
      border-radius: 18rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
    }

    .nav-name {
      font-size: 22rpx;
      color: #333;
    }
  }
}

// 消息通知区
.notice-section {
  margin: 20rpx 32rpx;
  background: #fff;
  border-radius: 12rpx;
  overflow: hidden;

  .notice-list {
    .notice-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18rpx 24rpx;
      border-bottom: 1px solid #f5f5f5;

      &:last-child {
        border-bottom: none;
      }

      .notice-left {
        display: flex;
        align-items: center;
        gap: 12rpx;
        flex: 1;

        .notice-logo {
          font-size: 20rpx;
          font-weight: 600;
          color: #fff;
          background: #1677ff;
          padding: 4rpx 10rpx;
          border-radius: 4rpx;
        }

        .notice-guide {
          font-size: 20rpx;
          font-weight: 500;
          color: #1677ff;
          background: rgba(22, 119, 255, 0.1);
          padding: 4rpx 10rpx;
          border-radius: 4rpx;
          border: 1px solid rgba(22, 119, 255, 0.3);
        }

        .notice-text {
          font-size: 24rpx;
          color: #333;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .notice-right {
        display: flex;
        align-items: center;
        gap: 8rpx;

        .notice-dot {
          width: 10rpx;
          height: 10rpx;
          background: #ff4d4f;
          border-radius: 50%;
        }
      }
    }
  }
}

// 运单列表
.order-section {
  margin: 0 32rpx;

  // Tab栏
  .tab-bar {
    display: flex;
    background: #fff;
    border-radius: 12rpx 12rpx 0 0;
    padding: 0 8rpx;

    .tab-item {
      flex: 1;
      height: 88rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      .tab-text {
        font-size: 28rpx;
        color: #999;
      }

      &.active {
        .tab-text {
          font-size: 30rpx;
          font-weight: bold;
          color: #1a1a1a;
        }
      }
    }
  }

  // 筛选栏
  .filter-bar {
    display: flex;
    align-items: center;
    background: #fff;
    padding: 14rpx 20rpx;
    gap: 16rpx;
    border-radius: 0 0 12rpx 12rpx;
    margin-bottom: 20rpx;

    .filter-item {
      font-size: 24rpx;
      color: #666;
      padding: 8rpx 18rpx;
      border-radius: 20rpx;
      background: #f5f5f5;

      &.active {
        background: #e6f4ff;
        color: #1677ff;
      }
    }

    .sort-btn {
      margin-left: auto;
      padding: 6rpx;

      .sort-icon {
        font-size: 24rpx;
      }
    }
  }

  // 运单卡片
  .order-list {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
  }

  .order-card {
    background: #fff;
    border-radius: 16rpx;
    padding: 24rpx;

    .card-route {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16rpx;

      .route-line {
        display: flex;
        align-items: center;
        gap: 12rpx;

        .route-city {
          font-size: 30rpx;
          font-weight: bold;
          color: #1a1a1a;
        }

        .route-arrow {
          padding: 0 8rpx;
        }
      }

      .route-meta {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 4rpx;

        .publish-time,
        .distance {
          font-size: 22rpx;
          color: #999;
        }
      }
    }

    .truck-requirements {
      display: flex;
      flex-wrap: wrap;
      gap: 12rpx;
      margin-bottom: 16rpx;

      .req-tag {
        font-size: 22rpx;
        padding: 6rpx 14rpx;
        border-radius: 6rpx;
        border: 1px solid;

        &.truck-len {
          color: #1677ff;
          border-color: #1677ff;
          background: rgba(22, 119, 255, 0.08);
        }

        &.truck-type {
          color: #fa8c16;
          border-color: #fa8c16;
          background: rgba(250, 140, 22, 0.08);
        }
      }
    }

    .load-info {
      .info-row {
        display: flex;
        align-items: center;
        gap: 10rpx;
        margin-bottom: 10rpx;

        .info-text {
          font-size: 24rpx;
          color: #666;
        }
      }
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20rpx;
      padding-top: 20rpx;
      border-top: 1px solid #f0f0f0;

      .price-info {
        display: flex;
        align-items: baseline;
        gap: 4rpx;

        .price-value {
          font-size: 40rpx;
          font-weight: bold;
          color: #ff4d4f;
        }

        .price-unit {
          font-size: 24rpx;
          color: #ff4d4f;
        }
      }

      .take-btn {
        width: 168rpx;
        height: 64rpx;
        background: #1677ff;
        border-radius: 32rpx;
        font-size: 28rpx;
        font-weight: 500;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;

        &.urgent {
          background: linear-gradient(135deg, #ff4d4f, #ff7875);
        }
      }
    }
  }
}

// 底部Tab栏
.bottom-tabbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100rpx;
  padding-bottom: env(safe-area-inset-bottom);
  background: #fff;
  box-shadow: 0 -1px 0 #f0f0f0;

  .tab-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4rpx;
    flex: 1;

    .tab-label {
      font-size: 22rpx;
      color: #666;

      &.active {
        color: #1677ff;
      }
    }
  }
}
</style>
