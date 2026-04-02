<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app'
import TnEmpty from '@tuniao/tnui-vue3-uniapp/components/empty/src/empty.vue'
import TnIcon from '@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue'

// 列表数据
const listData = ref<any[]>([])
const loading = ref(false)
const finished = ref(false)
const pageNo = ref(1)
const pageSize = 10

// 初始化数据
onMounted(() => {
  loadData()
})

// 下拉刷新
onPullDownRefresh(async () => {
  pageNo.value = 1
  finished.value = false
  listData.value = []
  await loadData()
  uni.stopPullDownRefresh()
})

// 上拉加载更多
onReachBottom(() => {
  if (!loading.value && !finished.value) {
    loadMore()
  }
})

// 加载数据
const loadData = async () => {
  if (loading.value) return

  loading.value = true

  // 模拟API请求
  setTimeout(() => {
    const newData = generateMockData(pageNo.value, pageSize)
    if (pageNo.value === 1) {
      listData.value = newData
    } else {
      listData.value.push(...newData)
    }

    // 判断是否加载完成
    if (newData.length < pageSize) {
      finished.value = true
    }

    loading.value = false
  }, 500)
}

// 加载更多
const loadMore = () => {
  pageNo.value++
  loadData()
}

// 生成模拟数据
const generateMockData = (page: number, size: number) => {
  const data: any[] = []
  const total = page * size
  const start = (page - 1) * size

  for (let i = start; i < total; i++) {
    const id = i + 1
    data.push({
      id,
      title: `这是一条列表数据标题 ${id}`,
      desc: `这是第 ${id} 条数据的描述内容，可以包含更多的文字说明`,
      image: getRandomImage(id),
      author: `作者${id}`,
      views: Math.floor(Math.random() * 10000),
      likes: Math.floor(Math.random() * 1000),
      time: `${Math.floor(Math.random() * 24)}小时前`,
      tag: ['热门', '推荐', '最新'][Math.floor(Math.random() * 3)],
    })
  }

  // 模拟最后一页数据不足
  if (page >= 3) {
    return data.slice(0, Math.floor(Math.random() * size))
  }

  return data
}

// 获取随机图片
const getRandomImage = (id: number) => {
  const images = [
    'https://resource.tuniaokj.com/images/vue3/market/vue3-banner-1-min.jpg',
    'https://resource.tuniaokj.com/images/vue3/market/vue3-banner-2-min.jpg',
    'https://resource.tuniaokj.com/images/vue3/market/vue3-banner-3-min.jpg',
  ]
  return images[id % images.length]
}

// 点击列表项
const onItemClick = (item: any) => {
  console.log('点击了:', item)
  uni.showToast({
    title: `点击了第${item.id}条`,
    icon: 'none',
  })
}

// 格式化数字
const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
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
  <view class="list-page">
    <!-- 空状态 -->
    <view v-if="!loading && listData.length === 0" class="empty-container">
      <TnEmpty text="暂无数据" />
    </view>

    <!-- 列表内容 -->
    <view v-else class="list-container">
      <view
        v-for="item in listData"
        :key="item.id"
        class="list-item tn-white_bg"
        @tap="onItemClick(item)"
      >
        <view class="item-image">
          <image :src="item.image" mode="aspectFill" lazy-load />
          <view class="item-tag tn-type-primary_bg">{{ item.tag }}</view>
        </view>
        <view class="item-content">
          <view class="item-title">{{ item.title }}</view>
          <view class="item-desc tn-gray_text">{{ item.desc }}</view>
          <view class="item-meta tn-flex tn-flex-col-center">
            <view class="meta-item">
              <TnIcon name="user" size="24" />
              <text>{{ item.author }}</text>
            </view>
            <view class="meta-item">
              <TnIcon name="eye" size="24" />
              <text>{{ formatNumber(item.views) }}</text>
            </view>
            <view class="meta-item">
              <TnIcon name="like" size="24" />
              <text>{{ formatNumber(item.likes) }}</text>
            </view>
          </view>
          <view class="item-footer tn-flex tn-flex-col-center tn-flex-between">
            <view class="item-time tn-gray_text">{{ item.time }}</view>
            <view class="item-more">
              <text>详情</text>
              <TnIcon name="right" size="24" />
            </view>
          </view>
        </view>
      </view>

      <!-- 加载状态 -->
      <view class="load-status tn-flex tn-flex-center">
        <view v-if="loading" class="loading">
          <TnIcon name="loading" spin />
          <text>加载中...</text>
        </view>
        <view v-else-if="finished" class="finished">
          <text>没有更多了</text>
        </view>
        <view v-else class="more">
          <text>上拉加载更多</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.list-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;

  .empty-container {
    padding-top: 200rpx;
  }

  .list-container {
    padding: 20rpx 30rpx;

    .list-item {
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
          margin: 10rpx 0;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .item-meta {
          .meta-item {
            display: flex;
            align-items: center;
            margin-right: 30rpx;
            font-size: 22rpx;
            color: #999;

            text {
              margin-left: 5rpx;
            }
          }
        }

        .item-footer {
          .item-time {
            font-size: 22rpx;
          }

          .item-more {
            display: flex;
            align-items: center;
            font-size: 24rpx;
            color: #fbbd08;

            text {
              margin-right: 5rpx;
            }
          }
        }
      }
    }

    .load-status {
      padding: 40rpx 0;
      font-size: 26rpx;
      color: #999;

      .loading,
      .finished,
      .more {
        display: flex;
        align-items: center;

        text {
          margin-left: 10rpx;
        }
      }
    }
  }
}
</style>
