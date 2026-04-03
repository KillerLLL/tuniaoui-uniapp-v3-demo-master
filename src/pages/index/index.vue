<script setup>
import { computed, nextTick, provide, reactive, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useOrderedChildren } from '@tuniao/tnui-vue3-uniapp/hooks'

import TnTabbar from '@tuniao/tnui-vue3-uniapp/components/tabbar/src/tabbar.vue'
import TnTabbarItem from '@tuniao/tnui-vue3-uniapp/components/tabbar/src/tabbar-item.vue'

import DriverHome from './sub-page/components/driver-home/driver-home.vue'
import GrabHall from './sub-page/components/grab-hall/grab-hall.vue'
import OrderList from './sub-page/components/order-list/order-list.vue'
import DriverMine from './sub-page/components/driver-mine/driver-mine.vue'

import { TABBAR_LIST } from '@/utils/const'
import { indexPageContextKey } from '@/tokens'

const {
  children: items,
  addChild: addItem,
  removeChild: removeItem,
} = useOrderedChildren()

// 页面总数
const totalPages = 4

// Tab索引到页面索引直接一一对应
const tabToPageIndex = { 0: 0, 1: 1, 2: 2, 3: 3 }

// 当前显示的页面索引
const currentPageIndex = ref(0)

// 导航切换事件
const onTabbarChange = (index) => {
  const pageIndex = tabToPageIndex[index]
  switchToPage(pageIndex)
}

// 切换到指定页面
const switchToPage = (index) => {
  if (!pageStatus.value?.[index]) {
    pageStatus.value[index] = true
    nextTick(() => {
      items.value?.[index]?.onLoad?.()
    })
  }
  currentPageIndex.value = index
  items.value?.[index]?.onShow?.()
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

// 页面容器样式
const pageContainerStyle = computed(() => {
  return (index) => {
    if (index !== currentPageIndex.value) {
      return { display: 'none' }
    }
    return {}
  }
})

onLoad(() => {
  pageStatus.value[0] = true
  nextTick(() => {
    currentPageIndex.value = 0
    setTimeout(() => {
      items.value?.[0]?.onLoad?.()
    }, 50)
  })
})

provide(
  indexPageContextKey,
  reactive({
    items,
    addItem,
    removeItem,
    switchTab: switchToPage,
  })
)
</script>

<template>
  <view class="page">
    <!-- 司机首页 -->
    <view
      v-if="pageStatus[0]"
      class="page__container"
      :style="pageContainerStyle(0)"
    >
      <scroll-view class="scroll-view" scroll-y>
        <DriverHome />
      </scroll-view>
    </view>
    <!-- 抢单大厅 -->
    <view
      v-if="pageStatus[1]"
      class="page__container"
      :style="pageContainerStyle(1)"
    >
      <scroll-view class="scroll-view" scroll-y>
        <GrabHall />
      </scroll-view>
    </view>
    <!-- 订单列表 -->
    <view
      v-if="pageStatus[2]"
      class="page__container"
      :style="pageContainerStyle(2)"
    >
      <scroll-view class="scroll-view" scroll-y>
        <OrderList />
      </scroll-view>
    </view>
    <!-- 个人中心 -->
    <view
      v-if="pageStatus[3]"
      class="page__container"
      :style="pageContainerStyle(3)"
    >
      <scroll-view class="scroll-view" scroll-y>
        <DriverMine />
      </scroll-view>
    </view>
  </view>
  <!-- 底部导航 -->
  <TnTabbar
    v-model="currentTabbarIndex"
    fixed
    :placeholder="false"
    switch-animation
    frosted
    active-color="#007AFF"
    @change="onTabbarChange"
  >
    <TnTabbarItem
      v-for="(item, index) in TABBAR_LIST"
      :key="index"
      :name="index"
      :text="item.text"
      inactive-color="#999"
      :icon="item.icon"
      :active-icon="item.activeIcon"
    />
  </TnTabbar>
</template>

<style lang="scss" scoped>
@import './style/index.scss';
</style>
