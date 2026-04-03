<script setup>
import { ref, onMounted } from 'vue'
import TnIcon from '@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue'
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'
import { getMessageListApi } from '@/api/driver'

defineOptions({
  options: {
    virtualHost: true,
  },
})

// 消息类型对应的图标映射
const TYPE_ICON_MAP = {
  order: { name: 'order', color: '#007AFF' },
  income: { name: 'wallet', color: '#FF7A00' },
  system: { name: 'notice', color: '#00B578' },
}

const messageList = ref([])
const loading = ref(false)

// 获取消息列表
const fetchMessageList = async () => {
  loading.value = true
  try {
    const res = await getMessageListApi()
    messageList.value = res.data.list || []
  } catch (e) {
    uni.showToast({ title: '获取消息失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 获取消息图标配置
const getIconConfig = (type) => {
  return TYPE_ICON_MAP[type] || { name: 'notice', color: '#999' }
}

// 点击消息卡片
const handleMessageTap = (item) => {
  if (!item.read) {
    item.read = true
  }
}

onMounted(() => {
  fetchMessageList()
})
</script>

<template>
  <view class="message-page">
    <CustomNavbar title="消息中心" />

    <!-- 内容区域 -->
    <view class="page-content">
      <!-- 消息列表 -->
      <view v-if="messageList.length > 0" class="message-list">
        <view
          v-for="item in messageList"
          :key="item.id"
          class="message-card"
          @tap="handleMessageTap(item)"
        >
          <!-- 左侧图标 -->
          <view
            class="card-icon"
            :style="{ backgroundColor: getIconConfig(item.type).color + '15' }"
          >
            <TnIcon
              :name="getIconConfig(item.type).name"
              :color="getIconConfig(item.type).color"
              size="44"
            />
          </view>

          <!-- 右侧内容 -->
          <view class="card-body">
            <view class="card-header">
              <text class="card-title">{{ item.title }}</text>
              <text class="card-time">{{ item.time }}</text>
            </view>
            <text class="card-content">{{ item.content }}</text>
          </view>

          <!-- 未读红点 -->
          <view v-if="!item.read" class="unread-dot" />
        </view>
      </view>

      <!-- 空状态 -->
      <view v-else-if="!loading" class="empty-state">
        <TnIcon name="notice" color="#ccc" size="80" />
        <text class="empty-text">暂无消息</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.message-page {
  min-height: 100vh;
  background: #f4f5f7;

  .page-content {
    padding-top: calc(var(--status-bar-height) + 88rpx + 30rpx);
    padding-bottom: 30rpx;
  }

  .message-list {
    padding: 0 24rpx;

    .message-card {
      display: flex;
      align-items: flex-start;
      padding: 28rpx 24rpx;
      margin-bottom: 16rpx;
      background: #fff;
      border-radius: 16rpx;
      position: relative;

      .card-icon {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        margin-right: 20rpx;
      }

      .card-body {
        flex: 1;
        min-width: 0;

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10rpx;

          .card-title {
            font-size: 30rpx;
            font-weight: bold;
            color: #333;
          }

          .card-time {
            font-size: 24rpx;
            color: #999;
            flex-shrink: 0;
            margin-left: 16rpx;
          }
        }

        .card-content {
          font-size: 26rpx;
          color: #666;
          line-height: 1.5;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }

      .unread-dot {
        position: absolute;
        top: 24rpx;
        right: 24rpx;
        width: 16rpx;
        height: 16rpx;
        border-radius: 50%;
        background: #ff4c4c;
      }
    }
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 200rpx;

    .empty-text {
      margin-top: 20rpx;
      font-size: 28rpx;
      color: #999;
    }
  }
}
</style>
