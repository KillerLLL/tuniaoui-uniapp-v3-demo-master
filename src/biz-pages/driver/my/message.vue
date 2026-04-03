<script lang="ts" setup>
/**
 * 消息列表页面
 */
import { ref, onMounted } from 'vue'
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
const getTypeIcon = (type) => {
  const icons = { 1: '⚙️', 2: '📋', 3: '🎁' }
  return icons[type] || '📢'
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <view class="message-page">
    <!-- 自定义导航栏 -->
    <CustomNavbar title="消息列表" />

    <!-- 页面内容 -->
    <view class="message-content">
      <view
        v-for="item in messageList"
        :key="item.id"
        class="message-card"
        :class="{ unread: !item.isRead }"
      >
        <view class="message-icon">
          <text>{{ getTypeIcon(item.type) }}</text>
        </view>
        <view class="message-info">
          <view class="message-header">
            <text class="message-title">{{ item.title }}</text>
            <text class="message-time">{{ item.time }}</text>
          </view>
          <text class="message-content-text">{{ item.content }}</text>
        </view>
        <view class="unread-dot" v-if="!item.isRead"></view>
      </view>

      <!-- 空状态 -->
      <view class="empty-state" v-if="messageList.length === 0">
        <text class="empty-icon">📭</text>
        <text class="empty-text">暂无消息</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.message-page {
  min-height: 100vh;
  background: #f4f5f7;
}

.message-content {
  padding: 180rpx 30rpx 30rpx;
}

.message-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 24rpx;
  display: flex;
  align-items: flex-start;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
  position: relative;

  &.unread {
    background: #f0f7ff;
  }

  .message-icon {
    width: 80rpx;
    height: 80rpx;
    background: #f0f0f0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36rpx;
    margin-right: 20rpx;
    flex-shrink: 0;
  }

  .message-info {
    flex: 1;

    .message-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10rpx;

      .message-title {
        font-size: 30rpx;
        color: #333;
        font-weight: bold;
      }

      .message-time {
        font-size: 24rpx;
        color: #999;
      }
    }

    .message-content-text {
      font-size: 26rpx;
      color: #666;
      line-height: 1.5;
      display: block;
    }
  }

  .unread-dot {
    position: absolute;
    top: 30rpx;
    right: 30rpx;
    width: 16rpx;
    height: 16rpx;
    background: #ff4c4c;
    border-radius: 50%;
  }
}

.empty-state {
  text-align: center;
  padding: 100rpx 0;

  .empty-icon {
    font-size: 100rpx;
    display: block;
    margin-bottom: 20rpx;
  }

  .empty-text {
    font-size: 32rpx;
    color: #999;
  }
}
</style>
