/**
 * 货主端 API
 * 包含货源、订单等接口
 * 当前使用模拟数据，后续替换为真实接口
 */

// ============ 模拟数据 ============
const MOCK_SHIPPER_INFO = {
  id: 2,
  nickname: '王货主',
  avatar: '',
  phone: '13612348888',
  role: 'shipper',
  verifyStatus: 2,
  companyName: '北京物流有限公司',
}

const MOCK_GOODS_LIST = [
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
    price: 320,
    remark: '易碎物品，小心轻放',
    status: 'pending', // pending待接单 grabbed已接单 completed已完成 cancelled已取消
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
    loadingTime: '2024-01-14 09:00',
    unloadingAddress: '河北省石家庄市长安区',
    unloadingContact: '赵先生',
    unloadingPhone: '13900139002',
    price: 450,
    remark: '',
    status: 'completed',
    publishTime: '昨天',
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
    loadingTime: '2024-01-13 08:00',
    unloadingAddress: '天津市武清区',
    unloadingContact: '陈先生',
    unloadingPhone: '13900139003',
    price: 180,
    remark: '需要冷藏运输',
    status: 'completed',
    publishTime: '2天前',
  },
]

const MOCK_SHIPPER_ORDER_LIST = [
  {
    id: '1',
    orderNo: 'DD20240115001',
    goodsType: '电子产品',
    weight: '2.5吨',
    loadingAddress: '北京市朝阳区',
    unloadingAddress: '天津市滨海新区',
    driverName: '李师傅',
    driverPhone: '137****8888',
    driverPlate: '京A12345',
    price: 320,
    status: 'in_transit', // pending待接单 in_transit进行中 completed已完成 cancelled已取消
    createTime: '2024-01-15 10:30',
  },
  {
    id: '2',
    orderNo: 'DD20240114002',
    goodsType: '家具家居',
    weight: '3.0吨',
    loadingAddress: '北京市海淀区',
    unloadingAddress: '河北省石家庄市',
    driverName: '张师傅',
    driverPhone: '138****6666',
    driverPlate: '京B12345',
    price: 450,
    status: 'completed',
    createTime: '2024-01-14 09:00',
    completedTime: '2024-01-14 15:30',
  },
  {
    id: '3',
    orderNo: 'DD20240113003',
    goodsType: '服装鞋帽',
    weight: '1.5吨',
    loadingAddress: '北京市大兴区',
    unloadingAddress: '北京市通州区',
    driverName: '刘师傅',
    driverPhone: '139****5555',
    driverPlate: '京C67890',
    price: 150,
    status: 'completed',
    createTime: '2024-01-13 08:00',
    completedTime: '2024-01-13 12:00',
  },
]

const MOCK_SHIPPER_ORDER_DETAIL = {
  id: '1',
  orderNo: 'DD20240115001',
  status: 'in_transit',
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
    scheduledTime: '2024-01-15 14:00',
  },
  unloading: {
    address: '天津市滨海新区第五大街',
    contactName: '李先生',
    contactPhone: '139****9001',
  },
  driver: {
    id: 1,
    name: '李师傅',
    phone: '137****8888',
    plate: '京A12345',
    rating: 4.9,
  },
  price: 320,
  createTime: '2024-01-15 10:30:00',
  grabTime: '2024-01-15 10:35:00',
  pickupTime: '2024-01-15 14:00:00',
  estimatedArrival: '2024-01-15 17:00',
}

// ============ 接口方法 ============

const USE_MOCK = true

/**
 * 获取货主用户信息
 */
export const getShipperInfoApi = () => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ code: 200, data: MOCK_SHIPPER_INFO })
      }, 300)
    })
  }
  return get('/shipper/user/info')
}

/**
 * 发布货源
 */
export const publishGoodsApi = (data) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          data: { id: Date.now().toString(), ...data, status: 'pending' },
        })
      }, 500)
    })
  }
  return post('/shipper/goods/publish', data)
}

/**
 * 获取货源列表
 */
export const getGoodsListApi = (params = {}) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let list = [...MOCK_GOODS_LIST]
        if (params.status) {
          list = list.filter((item) => item.status === params.status)
        }
        resolve({ code: 200, data: list })
      }, 500)
    })
  }
  return get('/shipper/goods/list', params)
}

/**
 * 获取货源详情
 */
export const getGoodsDetailApi = (goodsId) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const goods = MOCK_GOODS_LIST.find((item) => item.id === goodsId)
        resolve({ code: 200, data: goods || MOCK_GOODS_LIST[0] })
      }, 300)
    })
  }
  return get(`/shipper/goods/detail/${goodsId}`)
}

/**
 * 取消货源
 */
export const cancelGoodsApi = (goodsId) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ code: 200, data: { success: true } })
      }, 300)
    })
  }
  return post('/shipper/goods/cancel', { goodsId })
}

/**
 * 获取货主订单列表
 */
export const getOrderListApi = (params = {}) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let list = [...MOCK_SHIPPER_ORDER_LIST]
        if (params.status) {
          list = list.filter((item) => item.status === params.status)
        }
        resolve({ code: 200, data: list })
      }, 500)
    })
  }
  return get('/shipper/order/list', params)
}

/**
 * 获取货主订单详情
 */
export const getOrderDetailApi = (orderId) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          data: { ...MOCK_SHIPPER_ORDER_DETAIL, id: orderId },
        })
      }, 300)
    })
  }
  return get(`/shipper/order/detail/${orderId}`)
}

/**
 * 确认送达
 */
export const confirmDeliveryApi = (orderId) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ code: 200, data: { success: true } })
      }, 300)
    })
  }
  return post('/shipper/order/confirm-delivery', { orderId })
}

/**
 * 取消订单
 */
export const cancelOrderApi = (orderId, reason) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ code: 200, data: { success: true } })
      }, 300)
    })
  }
  return post('/shipper/order/cancel', { orderId, reason })
}

/**
 * 评价司机
 */
export const rateDriverApi = (orderId, rating, comment) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ code: 200, data: { success: true } })
      }, 500)
    })
  }
  return post('/shipper/order/rate', { orderId, rating, comment })
}
