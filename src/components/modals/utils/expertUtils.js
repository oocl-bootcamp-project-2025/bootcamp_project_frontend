import { message } from 'antd';

/**
 * 验证链接有效性
 * @param {string} urlString - 待验证的URL字符串
 * @returns {boolean} - 链接是否有效
 */
export const isValidUrl = (urlString) => {
  try {
    const url = new URL(urlString);
    // 检查是否是小红书相关域名
    return url.hostname.includes('xiaohongshu.com') || url.hostname.includes('xhslink.com');
  } catch {
    return false;
  }
};

/**
 * 处理头像点击 - 小红书链接确认
 * @param {Object} expert - 达人信息
 * @param {Function} setSelectedExpertForLink - 设置选中的达人
 * @param {Function} setLinkConfirmVisible - 设置链接确认弹窗显示状态
 */
export const handleAvatarClick = (expert, setSelectedExpertForLink, setLinkConfirmVisible) => {
  // AC 2: 无效链接处理
  if (!expert.xiaohongshuUrl) {
    message.warning('该达人暂未提供主页链接');
    return;
  }

  if (!isValidUrl(expert.xiaohongshuUrl)) {
    message.warning('链接无效，无法打开该达人的主页');
    return;
  }

  // 链接有效，显示确认弹窗
  setSelectedExpertForLink(expert);
  setLinkConfirmVisible(true);
};

/**
 * 确认打开小红书链接
 * @param {Object} selectedExpert - 选中的达人
 * @param {Function} setLinkConfirmVisible - 设置链接确认弹窗显示状态
 * @param {Function} setSelectedExpertForLink - 设置选中的达人
 */
export const handleConfirmOpenLink = (selectedExpert, setLinkConfirmVisible, setSelectedExpertForLink) => {
  if (selectedExpert && selectedExpert.xiaohongshuUrl) {
    window.open(selectedExpert.xiaohongshuUrl, '_blank');
  }
  setLinkConfirmVisible(false);
  setSelectedExpertForLink(null);
};

/**
 * 取消打开小红书链接
 * @param {Function} setLinkConfirmVisible - 设置链接确认弹窗显示状态
 * @param {Function} setSelectedExpertForLink - 设置选中的达人
 */
export const handleCancelOpenLink = (setLinkConfirmVisible, setSelectedExpertForLink) => {
  setLinkConfirmVisible(false);
  setSelectedExpertForLink(null);
};

/**
 * 获取当前日期的格式化字符串
 * @returns {string} - 格式化的日期字符串
 */
export const getCurrentDateString = () => {
  return new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
};

/**
 * 获取响应式头像尺寸
 * @returns {number} - 头像尺寸
 */
export const getAvatarSize = () => {
  return window.innerWidth <= 480 ? 48 : 64;
};

/**
 * 获取响应式字体尺寸
 * @param {number} mobileSize - 移动端尺寸
 * @param {number} desktopSize - 桌面端尺寸
 * @returns {number} - 字体尺寸
 */
export const getResponsiveFontSize = (mobileSize, desktopSize) => {
  return window.innerWidth <= 480 ? mobileSize : desktopSize;
};