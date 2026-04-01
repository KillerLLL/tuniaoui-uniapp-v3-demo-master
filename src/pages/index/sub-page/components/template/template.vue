<script lang="ts" setup>
import { ref } from 'vue'

import TnAvatar from '@tuniao/tnui-vue3-uniapp/components/avatar/src/avatar.vue'
import TnIcon from '@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue'

// 菜单数据
interface MenuItem {
  id: number
  title: string
  icon: string
  desc?: string
  arrow?: boolean
}

const menuItems = ref<MenuItem[]>([
  { id: 1, title: '个人中心', icon: 'user-circle', desc: '查看个人信息', arrow: true },
  { id: 2, title: '我的订单', icon: 'order', desc: '查看订单状态', arrow: true },
  { id: 3, title: '收藏夹', icon: 'star-circle', desc: '我的收藏内容', arrow: true },
  { id: 4, title: '消息通知', icon: 'notification', desc: '查看系统消息', arrow: true },
  { id: 5, title: '设置', icon: 'set', desc: '系统设置选项', arrow: true },
  { id: 6, title: '帮助中心', icon: 'help', desc: '获取帮助支持', arrow: true },
  { id: 7, title: '关于我们', icon: 'info-circle', desc: '了解更多信息', arrow: true },
])

const onMenuClick = (item: MenuItem) => {
  console.log('点击菜单:', item)
}
</script>

// #ifdef MP-WEIXIN
<script lang="ts">
export default {
  options: {
    // 在微信小程序中将组件节点渲染为虚拟节点，更加接近Vue组件的表现(不会出现shadow节点下再去创建元素)
    virtualHost: true,
  },
}
</script>
// #endif

<template>
  <view class="template-page">
    <view class="page-header">
      <view class="header-title">菜单模板</view>
      <view class="header-desc">常用的菜单列表样式</view>
    </view>

    <view class="menu-container">
      <!-- 卡片式菜单 -->
      <view class="menu-card">
        <view class="card-title">基础菜单</view>
        <view class="card-content">
          <view
            v-for="item in menuItems"
            :key="item.id"
            class="menu-item"
            @click="onMenuClick(item)"
          >
            <view class="menu-item-left">
              <view class="menu-icon">
                <TnIcon :name="item.icon" size="48" color="#0e62f8" />
              </view>
              <view class="menu-info">
                <view class="menu-title">{{ item.title }}</view>
                <view v-if="item.desc" class="menu-desc">{{ item.desc }}</view>
              </view>
            </view>
            <view v-if="item.arrow" class="menu-arrow">
              <TnIcon name="right" size="32" color="#c5cad5" />
            </view>
          </view>
        </view>
      </view>

      <!-- 头像菜单 -->
      <view class="menu-card">
        <view class="card-title">用户菜单</view>
        <view class="card-content">
          <view class="user-menu-item" @click="onMenuClick(menuItems[0])">
            <TnAvatar text="用" size="80" bg-color="#0e62f8" />
            <view class="user-info">
              <view class="user-name">用户名称</view>
              <view class="user-desc">点击查看个人中心</view>
            </view>
            <TnIcon name="right" size="32" color="#c5cad5" />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import './styles/index.scss';
</style>
