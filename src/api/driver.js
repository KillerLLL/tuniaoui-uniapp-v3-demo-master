/**
 * 司机相关接口
 * 司机信息、收入、钱包、车辆、消息、优惠券、发票
 */
import { post, get } from '@/utils/request'

// ============ 模拟数据 ============
const USE_MOCK = true

const MOCK_DRIVER_INFO = {
  id: 1,
  nickname: '王师傅',
  avatar: '',
  phone: '137****8888',
  verified: true,
  licenseVerified: true,
  vehicleVerified: true,
  rating: 4.8,
  orderCount: 256,
}

const MOCK_INCOME_OVERVIEW = {
  pendingSettlement: 3280.0,
  todayIncome: 680.0,
  totalWithdrawn: 45600.0,
  monthIncome: 12800.0,
  totalIncome: 89200.0,
}

const MOCK_WALLET_LIST = [
  { id: 1, type: 'income', amount: 730.0, desc: '运输收入', time: '04-03 08:30' },
  { id: 2, type: 'income', amount: 450.0, desc: '运输收入', time: '04-02 16:45' },
  { id: 3, type: 'withdraw', amount: -5000.0, desc: '提现到银行卡', time: '04-01 10:00' },
  { id: 4, type: 'income', amount: 400.0, desc: '运输收入', time: '03-31 14:20' },
  { id: 5, type: 'income', amount: 3000.0, desc: '运输收入', time: '03-30 09:00' },
  { id: 6, type: 'withdraw', amount: -8000.0, desc: '提现到银行卡', time: '03-28 15:30' },
  { id: 7, type: 'income', amount: 560.0, desc: '运输收入', time: '03-27 11:20' },
  { id: 8, type: 'income', amount: 820.0, desc: '运输收入', time: '03-26 08:15' },
]

const MOCK_VEHICLE_LIST = [
  {
    id: 1,
    plateNumber: '沪A12345',
    vehicleType: '厢式货车',
    vehicleLength: '4.2米',
    loadWeight: '5吨',
    loadVolume: '15m³',
    status: 1,
    defaultVehicle: true,
  },
  {
    id: 2,
    plateNumber: '沪B67890',
    vehicleType: '平板车',
    vehicleLength: '6.8米',
    loadWeight: '10吨',
    loadVolume: '25m³',
    status: 0,
    defaultVehicle: false,
  },
]

const MOCK_MESSAGE_LIST = [
  { id: 1, type: 'order', title: '订单已确认', content: '您的订单ORD20260403001已确认提货，请及时前往装货点。', time: '10分钟前', read: false },
  { id: 2, type: 'income', title: '收入到账', content: '您有一笔¥730.00运输收入已到账，请注意查收。', time: '1小时前', read: false },
  { id: 3, type: 'system', title: '系统通知', content: '平台将于4月5日进行系统升级，届时部分功能可能暂时不可用。', time: '昨天', read: true },
  { id: 4, type: 'order', title: '新订单提醒', content: '您附近有新的货源发布，快去抢单大厅查看吧！', time: '昨天', read: true },
  { id: 5, type: 'system', title: '认证通过', content: '恭喜您，您的车辆认证已通过审核。', time: '3天前', read: true },
  { id: 6, type: 'income', title: '提现成功', content: '您的提现申请¥5,000.00已处理完成，请查收。', time: '3天前', read: true },
]

const MOCK_COUPON_LIST = [
  { id: 1, name: '新人优惠券', amount: 50, condition: '满500可用', expireDate: '2026-05-01', used: false },
  { id: 2, name: '运费减免券', amount: 30, condition: '满300可用', expireDate: '2026-04-30', used: false },
  { id: 3, name: '长途优惠', amount: 100, condition: '满1000可用', expireDate: '2026-04-15', used: false },
  { id: 4, name: '首单立减', amount: 20, condition: '无门槛', expireDate: '2026-03-31', used: true },
  { id: 5, name: '周末特惠', amount: 80, condition: '满600可用', expireDate: '2026-03-20', used: true },
]

const MOCK_INVOICE_LIST = [
  { id: 1, title: '运输费发票', amount: 1500.0, status: 1, applyTime: '2026-03-28' },
  { id: 2, title: '运输费发票', amount: 730.0, status: 0, applyTime: '2026-04-01' },
  { id: 3, title: '运输费发票', amount: 2800.0, status: 2, applyTime: '2026-03-15' },
  { id: 4, title: '运输费发票', amount: 400.0, status: 1, applyTime: '2026-03-10' },
]

const MOCK_ANNOUNCEMENTS = [
  '五一劳动节期间运费补贴翻倍，抓紧接单！',
  '新版本已上线，新增车辆管理功能，快来体验',
  '平台入驻司机突破10万，感谢您的信任与支持',
]

// ============ 接口方法 ============

/**
 * 获取司机信息
 */
export const getDriverInfoApi = () => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ code: 200, data: MOCK_DRIVER_INFO })
      }, 300)
    })
  }
  return get('/driver/info')
}

/**
 * 获取收入概览
 */
export const getIncomeOverviewApi = () => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ code: 200, data: MOCK_INCOME_OVERVIEW })
      }, 300)
    })
  }
  return get('/driver/income/overview')
}

/**
 * 获取钱包明细
 * @param {Object} params - { pageNo, pageSize }
 */
export const getWalletDetailApi = (params = {}) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          data: { list: MOCK_WALLET_LIST, total: MOCK_WALLET_LIST.length },
        })
      }, 300)
    })
  }
  return get('/driver/wallet/detail', params)
}

/**
 * 提现申请
 * @param {number} amount 提现金额
 */
export const withdrawApi = (amount) => {
  if (USE_MOCK) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (amount > 0 && amount <= MOCK_INCOME_OVERVIEW.pendingSettlement) {
          resolve({ code: 200, data: { message: '提现申请已提交' } })
        } else {
          reject(new Error('提现金额不合法'))
        }
      }, 500)
    })
  }
  return post('/driver/withdraw', { amount })
}

/**
 * 获取车辆列表
 */
export const getVehicleListApi = () => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ code: 200, data: MOCK_VEHICLE_LIST })
      }, 300)
    })
  }
  return get('/driver/vehicle/list')
}

/**
 * 新增车辆
 * @param {Object} data 车辆信息
 */
export const addVehicleApi = (data) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ code: 200, data: { message: '车辆添加成功，等待审核' } })
      }, 500)
    })
  }
  return post('/driver/vehicle/add', data)
}

/**
 * 获取消息列表
 * @param {Object} params - { pageNo, pageSize }
 */
export const getMessageListApi = (params = {}) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          data: { list: MOCK_MESSAGE_LIST, total: MOCK_MESSAGE_LIST.length },
        })
      }, 300)
    })
  }
  return get('/driver/message/list', params)
}

/**
 * 获取优惠券列表
 */
export const getCouponListApi = () => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ code: 200, data: MOCK_COUPON_LIST })
      }, 300)
    })
  }
  return get('/driver/coupon/list')
}

/**
 * 获取发票列表
 * @param {Object} params - { status, pageNo, pageSize }
 */
export const getInvoiceListApi = (params = {}) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let list = [...MOCK_INVOICE_LIST]
        if (params.status !== undefined) {
          list = list.filter((item) => item.status === params.status)
        }
        resolve({ code: 200, data: { list, total: list.length } })
      }, 300)
    })
  }
  return get('/driver/invoice/list', params)
}

/**
 * 申请发票
 * @param {Object} data 发票信息
 */
export const applyInvoiceApi = (data) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ code: 200, data: { message: '发票申请已提交' } })
      }, 500)
    })
  }
  return post('/driver/invoice/apply', data)
}

/**
 * 获取公告列表
 */
export const getAnnouncementsApi = () => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ code: 200, data: MOCK_ANNOUNCEMENTS })
      }, 200)
    })
  }
  return get('/driver/announcements')
}
