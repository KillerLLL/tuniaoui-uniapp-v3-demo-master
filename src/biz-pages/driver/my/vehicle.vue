<script lang="ts" setup>
/**
 * 车辆管理页面
 */
import { ref, onMounted } from 'vue'
import CustomNavbar from '@/components/custom-navbar/index.vue'
import { getVehicleListApi } from '@/api/driver'

// 车辆列表
const vehicleList = ref([])

// 加载数据
const loadData = async () => {
  try {
    const res = await getVehicleListApi()
    if (res.code === 200) {
      vehicleList.value = res.data
    }
  } catch (e) {
    console.error('加载失败', e)
  }
}

// 添加车辆
const addVehicle = () => {
  uni.navigateTo({ url: '/biz-pages/driver/my/vehicle-detail' })
}

// 编辑车辆
const editVehicle = (id) => {
  uni.navigateTo({ url: `/biz-pages/driver/my/vehicle-detail?id=${id}` })
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <view class="vehicle-page">
    <!-- 自定义导航栏 -->
    <CustomNavbar title="车辆管理">
      <template #right>
        <view class="navbar-right" @tap="addVehicle">
          <text class="add-icon">+</text>
        </view>
      </template>
    </CustomNavbar>

    <!-- 页面内容 -->
    <view class="vehicle-content">
      <!-- 车辆列表 -->
      <view class="vehicle-list">
        <view
          v-for="item in vehicleList"
          :key="item.id"
          class="vehicle-card"
          @tap="editVehicle(item.id)"
        >
          <view class="card-header">
            <view class="car-info">
              <text class="car-type">{{ item.carType }}</text>
              <text class="car-plate">{{ item.carPlate }}</text>
            </view>
            <view class="car-status" :class="{ default: item.isDefault }">
              {{ item.isDefault ? '默认' : '' }}
            </view>
          </view>
          <view class="card-body">
            <view class="info-row">
              <text class="info-label">车长</text>
              <text class="info-value">{{ item.carLength }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">载重</text>
              <text class="info-value">{{ item.maxLoad }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">容积</text>
              <text class="info-value">{{ item.volume }}</text>
            </view>
          </view>
          <view class="card-footer">
            <text class="edit-hint">点击编辑</text>
          </view>
        </view>

        <!-- 空状态 -->
        <view class="empty-state" v-if="vehicleList.length === 0">
          <text class="empty-icon">🚗</text>
          <text class="empty-text">暂无车辆</text>
          <view class="empty-btn" @tap="addVehicle">
            <text class="btn-text">添加车辆</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.vehicle-page {
  min-height: 100vh;
  background: #f4f5f7;
}

.navbar-right {
  padding: 10rpx 20rpx;

  .add-icon {
    font-size: 48rpx;
    color: #007aff;
    font-weight: bold;
  }
}

.vehicle-content {
  padding: 180rpx 30rpx 30rpx;
}

.vehicle-list {
  .vehicle-card {
    background: #fff;
    border-radius: 24rpx;
    padding: 30rpx;
    margin-bottom: 24rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20rpx;
    padding-bottom: 20rpx;
    border-bottom: 1rpx solid #f5f5f5;

    .car-info {
      .car-type {
        font-size: 32rpx;
        color: #333;
        font-weight: bold;
        display: block;
        margin-bottom: 8rpx;
      }

      .car-plate {
        font-size: 40rpx;
        color: #007aff;
        font-weight: bold;
      }
    }

    .car-status {
      padding: 6rpx 16rpx;
      border-radius: 20rpx;
      font-size: 22rpx;
      color: #fff;
      background: #ddd;

      &.default {
        background: #00b578;
      }
    }
  }

  .card-body {
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 12rpx 0;

      .info-label {
        font-size: 28rpx;
        color: #999;
      }

      .info-value {
        font-size: 28rpx;
        color: #333;
      }
    }
  }

  .card-footer {
    margin-top: 16rpx;
    padding-top: 16rpx;
    border-top: 1rpx solid #f5f5f5;
    text-align: right;

    .edit-hint {
      font-size: 24rpx;
      color: #007aff;
    }
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
    display: block;
    margin-bottom: 30rpx;
  }

  .empty-btn {
    display: inline-block;
    background: linear-gradient(135deg, #007aff, #00b4ff);
    padding: 16rpx 40rpx;
    border-radius: 30rpx;

    .btn-text {
      color: #fff;
      font-size: 28rpx;
    }
  }
}
</style>
