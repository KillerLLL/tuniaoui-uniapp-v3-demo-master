<script setup lang="ts">
import { computed, nextTick, provide, reactive, ref } from 'vue'
import { onLoad, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
import { useOrderedChildren } from '@tuniao/tnui-vue3-uniapp/hooks'

import TnTabbar from '@tuniao/tnui-vue3-uniapp/components/tabbar/src/tabbar.vue'
import TnTabbarItem from '@tuniao/tnui-vue3-uniapp/components/tabbar/src/tabbar-item.vue'
import FloatMenu from '@/components/float-menu/float-menu.vue'

import HomePage from './sub-page/components/home/home.vue'
import ListPage from './sub-page/components/list/list.vue'
import BasicPage from './sub-page/components/basic/basic.vue'
import ComponentPage from './sub-page/components/component/component.vue'
import AboutPage from './sub-page/components/about/about.vue'

import type { CSSProperties } from 'vue'
import type { IndexSubPageContext } from '@/tokens'

import { useWxShare } from '@/hooks'
import { indexPageContextKey } from '@/tokens'

import { navMiniProgram } from '@/utils'

// 微信分享
onShareAppMessage(() => ({}))
onShareTimeline(() => ({}))
useWxShare({
  imageUrl:
    'https://resource.tuniaokj.com/images/vue3/market/vue3-banner-min.jpg',
})

const {
  children: items,
  addChild: addItem,
  removeChild: removeItem,
} = useOrderedChildren<IndexSubPageContext>()

// 底部导航栏数据
const tabbarData = [
  { text: '首页', icon: 'home-fill' },
  { text: '列表', icon: 'menu-fill' },
  { text: '我的', icon: 'my-fill' },
]

// 页面总数（包括基础和组件）
const totalPages = 5
// 底部Tab索引到实际页面索引的映射
const tabToPageIndex: Record<number, number> = {
  0: 0, // 首页
  1: 1, // 列表
  2: 4, // 图鸟
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
    // 根据当前页面索引返回对应的底部tab索引
    for (const [tabIndex, pageIndex] of Object.entries(tabToPageIndex)) {
      if (Number(pageIndex) === currentPageIndex.value) {
        return Number(tabIndex)
      }
    }
    return 0
  },
  set: (value) => {
    // Tabbar组件内部会设置这个值，我们不需要做任何事
  },
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
  // 获取当前进入的子页面的索引
  const index = Number(options?.index || 0)
  // 设置当前子页面的状态为true
  pageStatus.value[index] = true
  nextTick(() => {
    currentPageIndex.value = index
    setTimeout(() => {
      // 执行子页面的onLoad钩子
      items.value?.[index]?.onLoad?.()
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

// 悬浮按钮菜单数据
const floatMenuData = ref([
  {
    id: 'basic',
    name: '基础组件',
    icon: 'font',
    color: 'tn-gradient-bg__cool-3',
    pageIndex: 2,
  },
  {
    id: 'component',
    name: '组件库',
    icon: 'menu-more',
    color: 'tn-gradient-bg__cool-6',
    pageIndex: 3,
  },
  {
    id: 'mine',
    name: '我的',
    icon: 'my',
    color: 'tn-gradient-bg__cool-9',
    pageIndex: 4,
  },
])

// 悬浮按钮菜单点击事件
const onFloatMenuClick = (item: any) => {
  switchToPage(item.pageIndex)
}

</script>

<template>
  <!-- 虚拟首页 -->
  <view class="page">
    <view
      v-if="pageStatus[0]"
      class="page__container"
      :style="pageContainerStyle(0)"
    >
      <scroll-view class="scroll-view" scroll-y>
        <HomePage />
      </scroll-view>
    </view>
    <view
      v-if="pageStatus[1]"
      class="page__container"
      :style="pageContainerStyle(1)"
    >
      <scroll-view class="scroll-view" scroll-y>
        <ListPage />
      </scroll-view>
    </view>
    <view
      v-if="pageStatus[2]"
      class="page__container"
      :style="pageContainerStyle(2)"
    >
      <scroll-view class="scroll-view" scroll-y>
        <BasicPage />
      </scroll-view>
    </view>
    <view
      v-if="pageStatus[3]"
      class="page__container"
      :style="pageContainerStyle(3)"
    >
      <scroll-view class="scroll-view" scroll-y>
        <ComponentPage />
      </scroll-view>
    </view>
    <view
      v-if="pageStatus[4]"
      class="page__container"
      :style="pageContainerStyle(4)"
    >
      <scroll-view class="scroll-view" scroll-y>
        <AboutPage />
      </scroll-view>
    </view>
  </view>
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
  <!-- 悬浮按钮 -->
  <FloatMenu
    :menu-data="floatMenuData"
    @menu-click="onFloatMenuClick"
  />
</template>

<style lang="scss" scoped>
@import './style/index.scss';
</style>
