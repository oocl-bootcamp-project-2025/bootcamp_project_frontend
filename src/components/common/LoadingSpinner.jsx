// components/common/LoadingSpinner.jsx
import './css/LoadingSpinner.css';

const LoadingSpinner = ({ message = "加载中..." }) => (
  <div className="loading-spinner-container">
    <div className="loading-spinner-content">
      <div className="loading-spinner"></div>
      <p className="loading-spinner-text">{message}</p>
    </div>
  </div>
);

export default LoadingSpinner;
