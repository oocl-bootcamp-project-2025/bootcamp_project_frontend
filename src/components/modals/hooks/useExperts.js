import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockExperts } from '../data/mockExpertsData';

/**
 * 达人列表相关的状态管理Hook
 * @param {Object} attraction - 景点信息
 * @param {boolean} isOpen - 模态框是否打开
 * @param {Function} onClose - 关闭模态框回调
 * @param {Function} onSelectExpert - 选择达人回调
 */
export const useExperts = (attraction, isOpen, onClose, onSelectExpert) => {
  const [loading, setLoading] = useState(false);
  const [experts, setExperts] = useState([]);
  const [error, setError] = useState(null);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [linkConfirmVisible, setLinkConfirmVisible] = useState(false);
  const [selectedExpertForLink, setSelectedExpertForLink] = useState(null);
  const [bookingSuccessVisible, setBookingSuccessVisible] = useState(false);
  const navigate = useNavigate();

  // 获取达人数据
  const fetchExperts = async () => {
    try {
      setLoading(true);
      setError(null);
      setExperts([]);

      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 模拟网络错误（景点名称包含"错误"或"网络"时）
      if (attraction?.name && (attraction.name.includes('错误') || attraction.name.includes('网络'))) {
        throw new Error('Network Error');
      }

      // 根据景点名称决定是否有达人数据
      if (attraction?.name && (attraction.name.includes('测试') || attraction.name.includes('空状态'))) {
        // 模拟空状态
        setExperts([]);
      } else {
        // 模拟有数据状态
        setExperts(mockExperts);
      }
      setLoading(false);
    } catch (error) {
      console.error('获取达人数据失败:', error);
      setError(error);
      setLoading(false);
    }
  };

  // 重试函数
  const handleRetry = () => {
    fetchExperts();
  };

  // 模拟数据加载
  useEffect(() => {
    if (isOpen && attraction) {
      fetchExperts();
    }
  }, [isOpen, attraction]);

  // 处理预约
  const handleBooking = (expert) => {
    localStorage.removeItem('token');
    const isLoggedIn = !!localStorage.getItem('token');
    if (!isLoggedIn) {
      setLoginModalVisible(true);
      return;
    }
    setSelectedExpert(expert);
    setConfirmModalVisible(true);
  };

  // 登录弹窗处理
  const handleGoLogin = () => {
    setLoginModalVisible(false);
    navigate('/login');
  };

  const handleCancelLoginModal = () => {
    setLoginModalVisible(false);
  };

  // 预约确认处理
  const handleConfirmBooking = () => {
    setConfirmModalVisible(false);
    // 显示预约成功弹窗
    setBookingSuccessVisible(true);

    if (onSelectExpert && selectedExpert) {
      onSelectExpert(selectedExpert);
    }
  };

  const handleCancelBooking = () => {
    setConfirmModalVisible(false);
    setSelectedExpert(null);
  };

  // 预约成功后继续规划
  const handleContinuePlanning = () => {
    setBookingSuccessVisible(false);
    setSelectedExpert(null);
    onClose(); // 关闭整个达人选择模态框
  };

  // 推荐其他景点
  const handleRecommendOtherAttractions = () => {
    onClose();
  };

  return {
    // 状态
    loading,
    experts,
    error,
    loginModalVisible,
    confirmModalVisible,
    selectedExpert,
    bookingSuccessVisible,
    linkConfirmVisible,
    selectedExpertForLink,

    // 设置状态的函数
    setLinkConfirmVisible,
    setSelectedExpertForLink,

    // 处理函数
    handleRetry,
    handleBooking,
    handleGoLogin,
    handleCancelLoginModal,
    handleConfirmBooking,
    handleCancelBooking,
    handleContinuePlanning,
    handleRecommendOtherAttractions
  };
};