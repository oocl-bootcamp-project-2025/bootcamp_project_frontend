import { useState, useCallback } from 'react';

// 模态框状态管理Hook
const useModalState = () => {
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [isServiceSelectionOpen, setIsServiceSelectionOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isExpertListOpen, setIsExpertListOpen] = useState(false);

  // 文章模态框
  const openArticleModal = useCallback(() => setIsArticleModalOpen(true), []);
  const closeArticleModal = useCallback(() => setIsArticleModalOpen(false), []);

  // 服务选择模态框
  const openServiceSelection = useCallback(() => setIsServiceSelectionOpen(true), []);
  const closeServiceSelection = useCallback(() => setIsServiceSelectionOpen(false), []);

  // 预约模态框
  const openBookingModal = useCallback(() => setIsBookingModalOpen(true), []);
  const closeBookingModal = useCallback(() => setIsBookingModalOpen(false), []);

  // 专家列表模态框
  const openExpertList = useCallback(() => setIsExpertListOpen(true), []);
  const closeExpertList = useCallback(() => setIsExpertListOpen(false), []);

  return {
    // 状态
    isArticleModalOpen,
    isServiceSelectionOpen,
    isBookingModalOpen,
    isExpertListOpen,

    // 操作方法
    openArticleModal,
    closeArticleModal,
    openServiceSelection,
    closeServiceSelection,
    openBookingModal,
    closeBookingModal,
    openExpertList,
    closeExpertList
  };
};

export default useModalState;
