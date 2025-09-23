import React from 'react';
import { useAppContext } from '../../context/AppProvider';
import { ExpertListModal } from '../modals';

export default function ModalManager() {
  const {
    selectedAttraction,
    isExpertListOpen,
    closeExpertList
  } = useAppContext();

  // 处理专家选择 - 简化版本，只是console.log
  const handleSelectExpert = (expert) => {
    console.log('选择了达人:', expert.name);
    closeExpertList();
  };

  return (
    <>
      {/* 专家列表模态框 */}
      <ExpertListModal
        attraction={selectedAttraction}
        isOpen={isExpertListOpen}
        onClose={closeExpertList}
        onSelectExpert={handleSelectExpert}
      />
    </>
  );
}