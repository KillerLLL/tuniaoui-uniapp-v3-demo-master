<script setup>
import { ref } from 'vue'
import TnIcon from '@tuniao/tnui-vue3-uniapp/components/icon/src/icon.vue'
import CustomNavbar from '@/components/custom-navbar/custom-navbar.vue'

defineOptions({
  options: {
    virtualHost: true,
  },
})

// 客服电话
const servicePhone = '400-888-9999'

// 工作时间
const workTime = '周一至周日 09:00 - 21:00'

// FAQ列表数据
const faqList = ref([
  {
    id: 1,
    question: '如何注册成为司机？',
    answer: '打开APP后，点击注册按钮，选择"司机注册"，填写手机号并获取验证码，上传驾驶证、行驶证等资料，提交后等待平台审核，一般1-3个工作日内完成审核。',
    expanded: false,
  },
  {
    id: 2,
    question: '运费是如何结算的？',
    answer: '运费在订单完成后T+1自动结算到您的钱包余额，您可以在钱包页面申请提现到银行卡，提现一般在1-2个工作日内到账。',
    expanded: false,
  },
  {
    id: 3,
    question: '如何申请开具发票？',
    answer: '进入"我的"页面，点击"发票管理"，点击"申请发票"按钮，选择发票类型、填写开票金额和发票抬头信息，提交申请后平台会在5个工作日内处理。',
    expanded: false,
  },
  {
    id: 4,
    question: '车辆认证审核需要多久？',
    answer: '车辆认证提交后，平台会在1-3个工作日内完成审核。审核通过后您将收到站内消息通知，也可在"车辆管理"页面查看认证状态。',
    expanded: false,
  },
  {
    id: 5,
    question: '遇到货物损坏怎么办？',
    answer: '如在运输过程中发生货物损坏，请第一时间拍照留证，并在订单详情页上报异常。平台会安排客服介入处理，根据责任划分进行赔偿。建议购买运输保险以降低风险。',
    expanded: false,
  },
])

// 拨打客服电话
const handleCallPhone = () => {
  uni.makePhoneCall({
    phoneNumber: servicePhone,
    fail: () => {
      uni.showToast({ title: '拨打失败', icon: 'none' })
    },
  })
}

// 切换FAQ展开/收起
const toggleFaq = (item) => {
  item.expanded = !item.expanded
}
</script>

<template>
  <view class="service-page">
    <CustomNavbar title="客服中心" />

    <view class="page-content">
      <!-- 客服电话区域 -->
      <view class="phone-section">
        <view class="phone-card">
          <view class="phone-info">
            <view class="phone-icon-wrap">
              <TnIcon name="tel" color="#007AFF" size="48" />
            </view>
            <view class="phone-text">
              <text class="phone-number">{{ servicePhone }}</text>
              <text class="phone-time">{{ workTime }}</text>
            </view>
          </view>
          <view class="call-btn" @tap="handleCallPhone">
            <text class="call-btn-text">拨打电话</text>
          </view>
        </view>
      </view>

      <!-- 常见问题标题 -->
      <view class="faq-header">
        <text class="faq-title">常见问题</text>
      </view>

      <!-- FAQ列表（手风琴） -->
      <view class="faq-list">
        <view
          v-for="item in faqList"
          :key="item.id"
          class="faq-item"
        >
          <!-- 问题标题行 -->
          <view class="faq-question" @tap="toggleFaq(item)">
            <text class="question-text">{{ item.question }}</text>
            <TnIcon
              :name="item.expanded ? 'up' : 'down'"
              color="#999"
              size="28"
            />
          </view>

          <!-- 答案内容（展开时显示） -->
          <view v-if="item.expanded" class="faq-answer">
            <text class="answer-text">{{ item.answer }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.service-page {
  min-height: 100vh;
  background: #f4f5f7;

  .page-content {
    padding-top: calc(var(--status-bar-height) + 88rpx + 30rpx);
    padding-bottom: 30rpx;
  }

  // 客服电话区域
  .phone-section {
    padding: 0 24rpx;
    margin-bottom: 30rpx;

    .phone-card {
      background: #fff;
      border-radius: 16rpx;
      padding: 30rpx 24rpx;

      .phone-info {
        display: flex;
        align-items: center;
        margin-bottom: 24rpx;

        .phone-icon-wrap {
          width: 88rpx;
          height: 88rpx;
          border-radius: 50%;
          background: rgba(0, 122, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 20rpx;
          flex-shrink: 0;
        }

        .phone-text {
          flex: 1;

          .phone-number {
            font-size: 36rpx;
            font-weight: bold;
            color: #333;
            display: block;
          }

          .phone-time {
            font-size: 24rpx;
            color: #999;
            margin-top: 6rpx;
            display: block;
          }
        }
      }

      .call-btn {
        height: 80rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #007aff, #00b4ff);
        border-radius: 40rpx;

        .call-btn-text {
          font-size: 30rpx;
          font-weight: bold;
          color: #fff;
        }
      }
    }
  }

  // 常见问题
  .faq-header {
    padding: 0 24rpx;
    margin-bottom: 16rpx;

    .faq-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
  }

  .faq-list {
    padding: 0 24rpx;

    .faq-item {
      background: #fff;
      border-radius: 16rpx;
      margin-bottom: 16rpx;
      overflow: hidden;

      .faq-question {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 28rpx 24rpx;

        .question-text {
          font-size: 28rpx;
          color: #333;
          flex: 1;
          margin-right: 16rpx;
        }
      }

      .faq-answer {
        padding: 0 24rpx 28rpx;
        border-top: 1rpx solid #f5f5f5;

        .answer-text {
          font-size: 26rpx;
          color: #666;
          line-height: 1.6;
          padding-top: 20rpx;
          display: block;
        }
      }
    }
  }
}
</style>
