<script lang="ts" setup>
/**
 * 消息列表页面
 */
import { onMounted, ref } from 'vue'
import CustomNavbar from '@/components/custom-navbar/index.vue'
import { getMessageListApi } from '@/api/driver'

// 消息列表
const messageList = ref([])

// 加载数据
const loadData = async () => {
  try {
    const res = await getMessageListApi()
    if (res.code === 200) {
      messageList.value = res.data
    }
  } catch (e) {
    console.error('加载失败', e)
  }
}

// 类型图标
const getTypeIcon = (type: number) => {
  const icons: Record<number, string> = { 1: 'setting', 2: 'order', 3: 'gift' }
  return icons[type] || 'sound'
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <view class="min-h-screen bg-gray-100">
    <!-- 自定义导航栏 -->
    <CustomNavbar title="消息列表" />

    <!-- 页面内容 -->
    <view class="px-4 pb-8" style="padding-top: 180rpx">
      <view
        v-for="item in messageList"
        :key="item.id"
        class="card-press bg-white rounded-3xl p-6 mb-6 shadow-sm relative"
        :class="{ 'bg-blue-50': !item.isRead }"
      >
        <!-- 消息图标 -->
        <view class="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-400 rounded-full flex items-center justify-center mr-5 flex-shrink-0">
          <TnIcon :name="getTypeIcon(item.type)" size="36" color="#fff" />
        </view>
        <!-- 消息内容 -->
        <view class="flex-1">
          <view class="flex justify-between items-center mb-2">
            <text class="text-gray-800 text-sm font-bold">{{ item.title }}</text>
            <text class="text-gray-400 text-xs">{{ item.time }}</text>
          </view>
          <text class="text-gray-500 text-xs leading-relaxed block">{{ item.content }}</text>
        </view>
        <!-- 未读红点 -->
        <view v-if="!item.isRead" class="absolute top-6 right-6 w-4 h-4 bg-red-500 rounded-full" />
      </view>

      <!-- 空状态 -->
      <TnEmpty v-if="messageList.length === 0" mode="message" show-tips>
        <template #tips>
          <text class="text-gray-400 text-lg block mt-4">暂无消息</text>
        </template>
      </TnEmpty>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.card-press {
  display: flex;
  align-items: flex-start;
  transition: transform 0.15s ease;
}

.card-press:active {
  transform: scale(0.98);
}
</style>
