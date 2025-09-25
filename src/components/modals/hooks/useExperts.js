import { message } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isLogin as isLoginApi } from '../../apis/api';
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
  const [bookedExperts, setBookedExperts] = useState([]); // 添加已预约达人状态
  const [showFailedModal, setShowFailedModal] = useState(false); // 添加预约失败状态

  const navigate = useNavigate();

  // 获取达人数据
  const fetchExperts = async () => {
    try {
      setLoading(true);
      setError(null);
      setExperts([]);

      // 检查是否有景点ID
      if (!attraction?.id) {
        throw new Error('缺少景点ID');
      }

      // 调用后端API获取达人数据
      const response = await fetch(`http://localhost:8080/experts/${attraction.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // 设置超时时间
        signal: AbortSignal.timeout(10000) // 10秒超时
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const expertsData = await response.json();

      // 确保返回的是数组格式
      if (Array.isArray(expertsData)) {
        setExperts(expertsData);
      } else {
        setExperts([]);
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

  // 添加模拟预约请求函数
  const mockBookingRequest = async () => {
    // 模拟网络延迟 1-2 秒
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    // 随机返回成功或失败 (100% 成功率)
    if (Math.random() < 1) {
      return Promise.resolve();
    } else {
      return Promise.reject(new Error('预约失败，请稍后重试'));
    }
  };

  // 处理预约
  const handleBooking = async (expert) => {
    const attractionHasBooking = bookedExperts.some(bookedExpert =>
      bookedExpert.attractionId === attraction.id ||
      bookedExpert.attractionName === attraction.name
    );
    if (attractionHasBooking) {
      message.warning('该景点已预约达人服务,请先取消当前预约');
      return;
    }
    //localStorage.removeItem('token');
    localStorage.setItem('token', 'mock-token');

    try {
      const response = await isLoginApi();
      console.log('isLogin response:', response);
      if (response.status === 200) {
        setSelectedExpert(expert);
        setConfirmModalVisible(true);
      }
    } catch (error) {
      if (error.response.status === 403) {
        setLoginModalVisible(true);
      } else {
        alert('验证登录状态时出错，请稍后重试');
      }
    }
  };

  // 取消预约
  const handleCancelBooking = (expert) => {
    // 移除已预约专家
    setBookedExperts(prev => prev.filter(item =>
      !(item.expertId === expert.id &&
        (item.attractionId === attraction.id || item.attractionName === attraction.name))
    ));

    // 调用父组件的取消预约回调
    if (onSelectExpert) {
      onSelectExpert(attraction, {
        cancelled: true,
        expertId: expert.id,
        attractionId: attraction.id,
        attractionName: attraction.name
      });
    }
  };

  // 登录弹窗处理
  const handleGoLogin = () => {
    setLoginModalVisible(false);

    navigate(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
  };

  const handleCancelLoginModal = () => {
    setLoginModalVisible(false);
  };

  // 预约确认处理
  const handleConfirmBooking = async () => {
    if (selectedExpert) {
      try {
        setConfirmModalVisible(false);
        setShowFailedModal(false);
        setBookingSuccessVisible(false);
        // 调用模拟预约请求
        await mockBookingRequest();
        // 预约成功
        setBookingSuccessVisible(true);
        setBookedExperts(prev => [...prev, {
          expertId: selectedExpert.id,
          attractionId: attraction.id,
          attractionName: attraction.name
        }]);
        if (onSelectExpert) {
          onSelectExpert(attraction, {  // 正确: 传递两个参数
            expertName: selectedExpert?.name,
            serviceName: selectedExpert?.serviceName,
            bookingDateTime: "2025年9月24日 预约成功"  // 可以根据实际情况设置日期时间
          });
        }
      } catch (error) {
        // 预约失败
        setBookingSuccessVisible(false);
        setShowFailedModal(true);

      }
    }
  };

  const handleCloseFailedModal = () => {
    setShowFailedModal(false);
    setBookingSuccessVisible(false);
    setSelectedExpert(null);
  };

  const handleCancelConfirmModal = () => {
    setConfirmModalVisible(false);
    setSelectedExpert(null);
  };

  // 预约成功后继续规划
  const handleContinuePlanning = (bookingInfo) => {
    if (onSelectExpert) {
      onSelectExpert(attraction, {
        expertName: selectedExpert?.name,
        serviceName: selectedExpert?.serviceName,
        bookingDateTime: bookingInfo?.bookingDateTime
      });
    }
    setBookingSuccessVisible(false);
    setSelectedExpert(null);
    setShowFailedModal(false);
    onClose();
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
    bookedExperts,
    showFailedModal,

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
    handleCloseFailedModal,
    handleCancelConfirmModal,
    handleRecommendOtherAttractions
  };
};