import './css/JourneyControls.css';

const JourneyControls = ({ 
    showJourney, 
    onToggleJourney, 
    selectedDays, 
    uniqueDays, 
    onToggleDay, 
    onToggleAll, 
    onSetSelectedDays,
    isUpdatingView 
}) => {
    // 处理切换特定天数的函数
    const handleToggleDay = (day) => {
        try {
            // 如果地图视图正在更新，避免重复触发
            if (isUpdatingView) return;
            onToggleDay(day);
        } catch (error) {
            console.error(`Error toggling day ${day}:`, error);
        }
    };

    // 处理点击天数标签，只选中该天
    const handleDayClick = (day) => {
        try {
            // 如果地图视图正在更新，避免重复触发
            if (isUpdatingView) return;
            
            // 如果当前只选中了这一天，则不做任何操作
            if (selectedDays.length === 1 && selectedDays.includes(day)) {
                return;
            }
            
            // 只选中这一天
            onSetSelectedDays([day]);
        } catch (error) {
            console.error(`Error selecting day ${day}:`, error);
        }
    };

    // 处理全选/取消全选的函数
    const handleToggleAll = () => {
        try {
            // 如果地图视图正在更新，避免重复触发
            if (isUpdatingView) return;
            onToggleAll();
        } catch (error) {
            console.error("Error toggling all days:", error);
        }
    };

    return (
        <div className="journey-controls">
            {/* 添加按钮控制Journey显示/隐藏 */}
            <button
                className="journey-toggle-btn"
                onClick={onToggleJourney}
            >
                {showJourney ? '隐藏行程' : '显示行程'}
            </button>

            {/* 有条件地渲染Journey部分 */}
            {showJourney && (
                <div className="journey-bottom-container">
                    <div className="journey-detail">
                        <h4>路线切换</h4>
                        <p className="usage-tip">💡 勾选框可多选天数，点击天数文字可单独查看该天景点</p>
                        <div className="day-options">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedDays.length === uniqueDays.length}
                                    onChange={handleToggleAll}
                                    disabled={isUpdatingView}
                                />
                                显示全部
                            </label>
                            <div>
                                {uniqueDays.map(day => (
                                    <label key={day}>
                                        <input
                                            type="checkbox"
                                            checked={selectedDays.includes(day)}
                                            onChange={() => handleToggleDay(day)}
                                            disabled={isUpdatingView}
                                        />
                                        <span 
                                            className="day-label"
                                            onClick={() => handleDayClick(day)}
                                            title={`点击只查看第${day}天的景点`}
                                            style={{ 
                                                cursor: isUpdatingView ? 'not-allowed' : 'pointer',
                                                textDecoration: selectedDays.length === 1 && selectedDays.includes(day) ? 'underline' : 'none',
                                                fontWeight: selectedDays.length === 1 && selectedDays.includes(day) ? 'bold' : 'normal',
                                                color: selectedDays.length === 1 && selectedDays.includes(day) ? '#2e86de' : 'inherit'
                                            }}
                                        >
                                            第{day}天
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JourneyControls;
