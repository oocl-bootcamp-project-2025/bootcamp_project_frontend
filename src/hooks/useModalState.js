import { useCallback, useState } from 'react';

// 模态框状态管理Hook
export const useModalState = () => {
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [isServiceSelectionOpen, setIsServiceSelectionOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isExpertListOpen, setIsExpertListOpen] = useState(false);

  // 打开文章模态框
  const openArticleModal = useCallback(() => {
    setIsArticleModalOpen(true);
  }, []);

  // 关闭文章模态框
  const closeArticleModal = useCallback(() => {
    setIsArticleModalOpen(false);
  }, []);

  // 打开服务选择模态框
  const openServiceSelection = useCallback(() => {
    setIsServiceSelectionOpen(true);
  }, []);

  // 关闭服务选择模态框
  const closeServiceSelection = useCallback(() => {
    setIsServiceSelectionOpen(false);
  }, []);

  // 打开预约模态框
  const openBookingModal = useCallback(() => {
    setIsBookingModalOpen(true);
  }, []);

  // 关闭预约模态框
  const closeBookingModal = useCallback(() => {
    setIsBookingModalOpen(false);
  }, []);

  // 打开专家列表模态框
  const openExpertList = useCallback(() => {
    setIsExpertListOpen(true);
  }, []);

  // 关闭专家列表模态框
  const closeExpertList = useCallback(() => {
    setIsExpertListOpen(false);
  }, []);

  // 关闭所有模态框
  const closeAllModals = useCallback(() => {
    setIsArticleModalOpen(false);
    setIsServiceSelectionOpen(false);
    setIsBookingModalOpen(false);
    setIsExpertListOpen(false);
  }, []);

  return {
    // 状态
    isArticleModalOpen,
    isServiceSelectionOpen,
    isBookingModalOpen,
    isExpertListOpen,

    // 方法
    openArticleModal,
    closeArticleModal,
    openServiceSelection,
    closeServiceSelection,
    openBookingModal,
    closeBookingModal,
    openExpertList,
    closeExpertList,
    closeAllModals,

    // 直接设置器
    setIsArticleModalOpen,
    setIsServiceSelectionOpen,
    setIsBookingModalOpen,
    setIsExpertListOpen
  };
};