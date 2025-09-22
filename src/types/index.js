/**
 * @typedef {Object} City
 * @property {string} name - 城市名称
 * @property {string} pinyin - 拼音
 * @property {string} province - 省份
 */

/**
 * @typedef {Object} SearchFormData
 * @property {string} destination - 目的地
 * @property {string} departureDate - 出发日期
 * @property {string} departureTime - 出发时间
 * @property {string} returnDate - 返回日期
 * @property {string} returnTime - 返回时间
 * @property {string} preference - 旅行偏好
 */

/**
 * @typedef {Object} Expert
 * @property {string} id - 专家ID
 * @property {string} name - 专家姓名
 * @property {string} avatar - 头像URL
 * @property {number} rating - 评分
 * @property {boolean} verified - 是否认证
 * @property {string} responseTime - 响应时间
 * @property {string} priceRange - 价格范围
 * @property {number} articlesCount - 文章数量
 * @property {string} location - 所在地
 * @property {number} followers - 粉丝数
 * @property {string[]} specialties - 专业领域
 * @property {Service[]} services - 提供的服务
 */

/**
 * @typedef {Object} Service
 * @property {string} id - 服务ID
 * @property {string} name - 服务名称
 * @property {string} price - 价格
 * @property {string} description - 服务描述
 */

/**
 * @typedef {Object} Attraction
 * @property {string} id - 景点ID
 * @property {string} name - 景点名称
 * @property {string} description - 简短描述
 * @property {string} detailedDescription - 详细描述
 * @property {string} duration - 建议游玩时长
 * @property {string} time - 时间安排
 * @property {string} location - 位置
 * @property {string[]} images - 图片URL数组
 * @property {Expert[]} experts - 相关专家
 * @property {Review[]} reviews - 评价列表
 */

/**
 * @typedef {Object} Review
 * @property {string} id - 评价ID
 * @property {string} userName - 用户名
 * @property {string} userAvatar - 用户头像
 * @property {number} rating - 评分
 * @property {string} content - 评价内容
 * @property {string} date - 评价日期
 * @property {string[]} images - 评价图片
 */

/**
 * @typedef {Object} Booking
 * @property {string} id - 预约ID
 * @property {Expert} expert - 专家信息
 * @property {Service} service - 服务信息
 * @property {Attraction} attraction - 景点信息
 * @property {string} date - 预约日期
 * @property {string} status - 预约状态
 */

/**
 * @typedef {Object} Post
 * @property {string} type - 帖子类型 ('article' | 'review')
 * @property {Object} author - 作者信息
 * @property {string} author.name - 作者姓名
 * @property {string} author.avatar - 作者头像
 * @property {string} date - 发布日期
 * @property {string} title - 标题（可选）
 * @property {string} content - 内容
 * @property {string[]} images - 图片数组
 */

/**
 * @typedef {Object} Itinerary
 * @property {Attraction[]} day1 - 第一天行程
 * @property {Attraction[]} day2 - 第二天行程
 * @property {Attraction[]} day3 - 第三天行程
 * @property {Attraction[]} [dayN] - 第N天行程
 */

/**
 * @typedef {Object} ModalStates
 * @property {boolean} isArticleModalOpen - 文章模态框状态
 * @property {boolean} isServiceSelectionOpen - 服务选择模态框状态
 * @property {boolean} isBookingModalOpen - 预约模态框状态
 * @property {boolean} isExpertListOpen - 专家列表模态框状态
 */

export { }; // 确保这是一个模块
