/**
 * 司机端 API
 * 包含订单、收入、车辆、优惠券等接口
 * 当前使用模拟数据，后续替换为真实接口
 */
import { ORDER_STATUS } from '@/utils/const'

// ============ 模拟数据 ============
const MOCK_USER_INFO = {
  id: 1,
  nickname: '李师傅',
  avatar: '',
  phone: '13812348888',
  role: 'driver',
  verifyStatus: 2, // 已认证
  driverInfo: {
    carType: '中型货车',
    carPlate: '京A12345',
    carLength: '6.8米',
  },
  wallet: {
    balance: 1280.00,
    todayIncome: 356.00,
    totalIncome: 12560.00,
    pendingSettlement: 1280.00,
  },
}

const MOCK_GRAB_LIST = [
  {
    id: '1',
    goodsType: '电子产品',
    weight: '2.5吨',
    volume: '10方',
    count: 100,
    loadingAddress: '北京市朝阳区建国路88号',
    loadingContact: '张先生',
    loadingPhone: '13800138001',
    loadingTime: '2024-01-15 14:00',
    unloadingAddress: '天津市滨海新区第五大街',
    unloadingContact: '李先生',
    unloadingPhone: '13900139001',
    freight: 320,
    serviceFee: 16,
    actualIncome: 304,
    distance: '120km',
    publishTime: '10分钟前',
  },
  {
    id: '2',
    goodsType: '家具家居',
    weight: '3.0吨',
    volume: '15方',
    count: 50,
    loadingAddress: '北京市海淀区中关村大街',
    loadingContact: '王女士',
    loadingPhone: '13800138002',
    loadingTime: '2024-01-15 15:00',
    unloadingAddress: '河北省石家庄市长安区',
    unloadingContact: '赵先生',
    unloadingPhone: '13900139002',
    freight: 450,
    serviceFee: 22.5,
    actualIncome: 427.5,
    distance: '280km',
    publishTime: '30分钟前',
  },
  {
    id: '3',
    goodsType: '食品饮料',
    weight: '1.0吨',
    volume: '5方',
    count: 200,
    loadingAddress: '北京市丰台区南三环',
    loadingContact: '刘先生',
    loadingPhone: '13800138003',
    loadingTime: '2024-01-16 08:00',
    unloadingAddress: '天津市武清区',
    unloadingContact: '陈先生',
    unloadingPhone: '13900139003',
    freight: 180,
    serviceFee: 9,
    actualIncome: 171,
    distance: '80km',
    publishTime: '1小时前',
  },
]

const MOCK_ORDER_LIST = [
  {
    id: '1',
    orderNo: 'DD20240115001',
    status: ORDER_STATUS.IN_TRANSIT,
    goodsType: '电子产品',
    weight: '2.5吨',
    volume: '10方',
    loadingAddress: '北京市朝阳区建国路88号',
    unloadingAddress: '天津市滨海新区第五大街',
    freight: 320,
    serviceFee: 16,
    actualIncome: 304,
    driverArrivalTime: '2024-01-15 13:30',
    pickupTime: '2024-01-15 14:00',
    estimatedArrival: '2024-01-15 17:00',
  },
  {
    id: '2',
    orderNo: 'DD20240114002',
    status: ORDER_STATUS.COMPLETED,
    goodsType: '家具家居',
    weight: '3.0吨',
    volume: '15方',
    loadingAddress: '北京市海淀区中关村大街',
    unloadingAddress: '河北省石家庄市长安区',
    freight: 450,
    serviceFee: 22.5,
    actualIncome: 427.5,
    completedTime: '2024-01-14 18:30',
  },
  {
    id: '3',
    orderNo: 'DD20240113003',
    status: ORDER_STATUS.COMPLETED,
    goodsType: '服装鞋帽',
    weight: '1.5吨',
    volume: '8方',
    loadingAddress: '北京市大兴区亦庄',
    unloadingAddress: '北京市通州区',
    freight: 150,
    serviceFee: 7.5,
    actualIncome: 142.5,
    completedTime: '2024-01-13 12:00',
  },
  {
    id: '4',
    orderNo: 'DD20240112004',
    status: ORDER_STATUS.CANCELLED,
    goodsType: '建材装饰',
    weight: '5.0吨',
    volume: '20方',
    loadingAddress: '北京市昌平区',
    unloadingAddress: '北京市顺义区',
    freight: 280,
    serviceFee: 14,
    actualIncome: 266,
    cancelledTime: '2024-01-12 10:00',
  },
]

const MOCK_ORDER_DETAIL = {
  id: '1',
  orderNo: 'DD20240115001',
  status: ORDER_STATUS.IN_TRANSIT,
  goods: {
    type: '电子产品',
    weight: '2.5吨',
    volume: '10方',
    count: 100,
    remark: '易碎物品，小心轻放',
  },
  loading: {
    address: '北京市朝阳区建国路88号',
    contactName: '张先生',
    contactPhone: '138****8001',
    latitude: 39.9042,
    longitude: 116.4074,
    scheduledTime: '2024-01-15 14:00',
    actualTime: '2024-01-15 14:00',
  },
  unloading: {
    address: '天津市滨海新区第五大街',
    contactName: '李先生',
    contactPhone: '139****9001',
    latitude: 39.0345,
    longitude: 117.7212,
    scheduledTime: '2024-01-15 17:00',
  },
  fee: {
    freight: 320.00,
    serviceFee: 16.00,
    actualIncome: 304.00,
    extraFee: 0,
  },
  times: {
    publishedAt: '2024-01-15 10:30:00',
    grabbedAt: '2024-01-15 10:35:00',
    driverArrivalAt: '2024-01-15 13:30:00',
    pickedUpAt: '2024-01-15 14:00:00',
    deliveredAt: null,
    completedAt: null,
  },
  shipper: {
    id: 2,
    name: '王货主',
    phone: '136****8000',
    rating: 4.8,
  },
}

const MOCK_VEHICLE_LIST = [
  {
    id: '1',
    carType: '中型货车',
    carPlate: '京A12345',
    carLength: '6.8米',
    carWidth: '2.3米',
    carHeight: '2.5米',
    maxLoad: '10吨',
    volume: '40方',
    status: 1,
    isDefault: true,
  },
  {
    id: '2',
    carType: '小型货车',
    carPlate: '京B67890',
    carLength: '4.2米',
    carWidth: '1.8米',
    carHeight: '2.0米',
    maxLoad: '3吨',
    volume: '15方',
    status: 1,
    isDefault: false,
  },
]

const MOCK_COUPON_LIST = [
  {
    id: '1',
    name: '新人专享券',
    amount: 10,
    condition: '满100可用',
    expireTime: '2024-12-31',
    status: 0, // 0未使用 1已使用 2已过期
  },
  {
    id: '2',
    name: '满减券',
    amount: 20,
    condition: '满200可用',
    expireTime: '2024-06-30',
    status: 0,
  },
  {
    id: '3',
    name: '奖励券',
    amount: 50,
    condition: '满500可用',
    expireTime: '2024-03-31',
    status: 1,
  },
]

const MOCK_INVOICE_LIST = [
  {
    id: '1',
    title: '北京科技有限公司',
    taxNo: '91110000MA00XXXX1X',
    amount: 1000,
    status: 2, // 0待开票 1开票中 2已完成 3已拒绝
    createTime: '2024-01-10',
    invoiceTime: '2024-01-12',
  },
  {
    id: '2',
    title: '北京科技有限公司',
    taxNo: '91110000MA00XXXX1X',
    amount: 500,
    status: 1,
    createTime: '2024-01-14',
  },
]

const MOCK_MESSAGE_LIST = [
  {
    id: '1',
    type: 2,
    title: '订单完成通知',
    content: '您的订单DD20240114002已完成，收入已到账',
    time: '2024-01-14 18:30',
    isRead: false,
  },
  {
    id: '2',
    type: 1,
    title: '系统通知',
    content: '恭喜您完成10单，获得新人奖励',
    time: '2024-01-13 10:00',
    isRead: true,
  },
  {
    id: '3',
    type: 2,
    title: '新订单提醒',
    content: '您有一条新的货源，快去抢单吧',
    time: '2024-01-15 10:30',
    isRead: false,
  },
]

const MOCK_INCOME_DETAIL = [
  { id: '1', date: '2024-01-15', amount: 304, orderNo: 'DD20240115001' },
  { id: '2', date: '2024-01-14', amount: 427.5, orderNo: 'DD20240114002' },
  { id: '3', date: '2024-01-13', amount: 142.5, orderNo: 'DD20240113003' },
]

// ============ 接口方法 ============

// 是否使用模拟数据
const USE_MOCK = true

/**
 * 获取用户信息
 */
export const getUserInfoApi = () => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ code: 200, data: MOCK_USER_INFO })
      }, 300)
    })
  }
  return get('/driver/user/info')
}

/**
 * 获取抢单大厅货源列表
 */
export const getGrabListApi = (params = {}) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let list = [...MOCK_GRAB_LIST]
        // 按距离筛选（模拟）
        if (params.nearby) {
          list = list.filter((item) => parseInt(item.distance) < 150)
        }
        resolve({ code: 200, data: list })
      }, 500)
    })
  }
  return get('/driver/order/grab-list', params)
}

/**
 * 获取订单列表
 */
export const getOrderListApi = (params = {}) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let list = [...MOCK_ORDER_LIST]
        // 按状态筛选
        if (params.status !== undefined && params.status !== null) {
          if (params.status === 99) {
            // 全部
          } else {
            list = list.filter((item) => item.status === params.status)
          }
        }
        resolve({ code: 200, data: list })
      }, 500)
    })
  }
  return get('/driver/order/list', params)
}

/**
 * 获取订单详情
 */
export const getOrderDetailApi = (orderId) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ code: 200, data: { ...MOCK_ORDER_DETAIL, id: orderId } })
      }, 300)
    })
  }
  return get(`/driver/order/detail/${orderId}`)
}

/**
 * 抢单
 */
export const grabOrderApi = (orderId) => {
  if (USE_MOCK) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const order = MOCK_GRAB_LIST.find((item) => item.id === orderId)
        if (order) {
          resolve({ code: 200, data: { orderId, success: true } })
        } else {
          reject(new Error('货源不存在'))
        }
      }, 500)
    })
  }
  return post('/driver/order/grab', { orderId })
}

/**
 * 更新订单状态
 */
export const updateOrderStatusApi = (orderId, status) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ code: 200, data: { orderId, status, success: true } })
      }, 300)
    })
  }
  return post('/driver/order/update-status', { orderId, status })
}

/**
 * 获取收入概览
 */
export const getIncomeOverviewApi = () => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          data: {
            todayIncome: 356.00,
            totalIncome: 12560.00,
            pendingSettlement: 1280.00,
            balance: 1280.00,
          },
        })
      }, 300)
    })
  }
  return get('/driver/income/overview')
}

/**
 * 获取收入明细
 */
export const getIncomeDetailApi = (params = {}) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ code: 200, data: MOCK_INCOME_DETAIL })
      }, 300)
    })
  }
  return get('/driver/income/detail', params)
}

/**
 * 获取钱包信息
 */
export const getWalletInfoApi = () => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          data: {
            balance: 1280.00,
            todayIncome: 356.00,
            totalIncome: 12560.00,
            pendingSettlement: 1280.00,
          },
        })
      }, 300)
    })
  }
  return get('/driver/wallet/info')
}

/**
 * 申请提现
 */
export const withdrawApi = (amount) => {
  if (USE_MOCK) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (amount > 0) {
          resolve({ code: 200, data: { success: true, amount } })
        } else {
          reject(new Error('提现金额不正确'))
        }
      }, 500)
    })
  }
  return post('/driver/wallet/withdraw', { amount })
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
 * 获取车辆详情
 */
export const getVehicleDetailApi = (vehicleId) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const vehicle = MOCK_VEHICLE_LIST.find((item) => item.id === vehicleId)
        resolve({ code: 200, data: vehicle || MOCK_VEHICLE_LIST[0] })
      }, 300)
    })
  }
  return get(`/driver/vehicle/detail/${vehicleId}`)
}

/**
 * 添加车辆
 */
export const addVehicleApi = (data) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          data: { id: Date.now().toString(), ...data, status: 1 },
        })
      }, 500)
    })
  }
  return post('/driver/vehicle/add', data)
}

/**
 * 更新车辆
 */
export const updateVehicleApi = (vehicleId, data) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ code: 200, data: { id: vehicleId, ...data } })
      }, 500)
    })
  }
  return post(`/driver/vehicle/update/${vehicleId}`, data)
}

/**
 * 删除车辆
 */
export const deleteVehicleApi = (vehicleId) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ code: 200, data: { success: true } })
      }, 300)
    })
  }
  return post('/driver/vehicle/delete', { vehicleId })
}

/**
 * 设置默认车辆
 */
export const setDefaultVehicleApi = (vehicleId) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ code: 200, data: { success: true } })
      }, 300)
    })
  }
  return post('/driver/vehicle/set-default', { vehicleId })
}

/**
 * 获取优惠券列表
 */
export const getCouponListApi = (status) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let list = [...MOCK_COUPON_LIST]
        if (status !== undefined && status !== null) {
          list = list.filter((item) => item.status === status)
        }
        resolve({ code: 200, data: list })
      }, 300)
    })
  }
  return get('/driver/coupon/list', { status })
}

/**
 * 获取发票列表
 */
export const getInvoiceListApi = () => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ code: 200, data: MOCK_INVOICE_LIST })
      }, 300)
    })
  }
  return get('/driver/invoice/list')
}

/**
 * 申请发票
 */
export const applyInvoiceApi = (data) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          data: { id: Date.now().toString(), ...data, status: 0 },
        })
      }, 500)
    })
  }
  return post('/driver/invoice/apply', data)
}

/**
 * 获取消息列表
 */
export const getMessageListApi = (type) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let list = [...MOCK_MESSAGE_LIST]
        if (type) {
          list = list.filter((item) => item.type === type)
        }
        resolve({ code: 200, data: list })
      }, 300)
    })
  }
  return get('/driver/message/list', { type })
}

/**
 * 标记消息已读
 */
export const readMessageApi = (messageId) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ code: 200, data: { success: true } })
      }, 200)
    })
  }
  return post('/driver/message/read', { messageId })
}

/**
 * 获取进行中的订单
 */
export const getOngoingOrderApi = () => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const ongoing = MOCK_ORDER_LIST.find(
          (item) =>
            item.status >= ORDER_STATUS.GRABBED &&
            item.status < ORDER_STATUS.COMPLETED
        )
        resolve({ code: 200, data: ongoing || null })
      }, 300)
    })
  }
  return get('/driver/order/ongoing')
}
