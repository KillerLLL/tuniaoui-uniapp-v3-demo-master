<script setup lang="ts">
/**
 * 物流运输小程序 - 主包首页（Tabbar壳）
 * 包含底部导航和4个子页面切换
 */
import { computed, nextTick, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

import TnTabbar from '@tuniao/tnui-vue3-uniapp/components/tabbar/src/tabbar.vue'
import TnTabbarItem from '@tuniao/tnui-vue3-uniapp/components/tabbar/src/tabbar-item.vue'

import DriverHome from './sub-page/components/driver-home.vue'
import DriverGrab from './sub-page/components/driver-grab.vue'
import DriverOrder from './sub-page/components/driver-order.vue'
import DriverMy from './sub-page/components/driver-my.vue'

import type { CSSProperties } from 'vue'

// 页面总数
const totalPages = 4

// 底部导航栏数据
const tabbarData = [
  { text: '首页', icon: 'home-fill' },
  { text: '抢单', icon: 'order-fill' },
  { text: '订单', icon: 'list-fill' },
  { text: '我的', icon: 'my-fill' },
]

// 底部Tab索引到实际页面索引的映射
const tabToPageIndex: Record<number, number> = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
}

// 当前显示的页面索引
const currentPageIndex = ref<number>(0)

// 导航切换事件
const onTabbarChange = (index: string | number) => {
  const pageIndex = tabToPageIndex[index as number]
  switchToPage(pageIndex)
}

// 切换到指定页面
const switchToPage = (index: number) => {
  if (!pageStatus.value?.[index]) {
    pageStatus.value[index] = true
  }
  currentPageIndex.value = index
}

// 记录每个子页面的状态
const pageStatus = ref(Array.from({ length: totalPages }, () => false))

// 当前选中的底部导航索引
const currentTabbarIndex = computed({
  get: () => {
    for (const [tabIndex, pageIndex] of Object.entries(tabToPageIndex)) {
      if (Number(pageIndex) === currentPageIndex.value) {
        return Number(tabIndex)
      }
    }
    return 0
  },
  set: () => {},
})

// pageContainer的样式
const pageContainerStyle = computed<(index: number) => CSSProperties>(() => {
  return (index: number) => {
    const style: CSSProperties = {}
    if (index !== currentPageIndex.value) {
      style.display = 'none'
    }
    return style
  }
})

onLoad((options: any) => {
  const index = Number(options?.index || 0)
  pageStatus.value[index] = true
  nextTick(() => {
    currentPageIndex.value = index
  })
})
</script>

<template>
  <!-- 物流小程序首页 -->
  <view class="page">
    <!-- 首页 -->
    <view
      v-if="pageStatus[0]"
      class="page__container"
      :style="pageContainerStyle(0)"
    >
      <scroll-view class="scroll-view" scroll-y>
        <DriverHome />
      </scroll-view>
    </view>
    <!-- 抢单 -->
    <view
      v-if="pageStatus[1]"
      class="page__container"
      :style="pageContainerStyle(1)"
    >
      <scroll-view class="scroll-view" scroll-y>
        <DriverGrab />
      </scroll-view>
    </view>
    <!-- 订单 -->
    <view
      v-if="pageStatus[2]"
      class="page__container"
      :style="pageContainerStyle(2)"
    >
      <scroll-view class="scroll-view" scroll-y>
        <DriverOrder />
      </scroll-view>
    </view>
    <!-- 我的 -->
    <view
      v-if="pageStatus[3]"
      class="page__container"
      :style="pageContainerStyle(3)"
    >
      <scroll-view class="scroll-view" scroll-y>
        <DriverMy />
      </scroll-view>
    </view>
  </view>

  <!-- 底部导航栏 -->
  <TnTabbar
    v-model="currentTabbarIndex"
    fixed
    :placeholder="false"
    switch-animation
    frosted
    @change="onTabbarChange"
  >
    <TnTabbarItem
      v-for="(item, index) in tabbarData"
      :key="index"
      :name="index"
      :text="item.text"
      inactive-color="#c5cad5"
      :icon="item.icon"
      :active-icon="item.icon"
    />
  </TnTabbar>
</template>

<style lang="scss" scoped>
.page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #f4f5f7;

  &__container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 120rpx;
  }
}

.scroll-view {
  height: 100%;
}
</style>