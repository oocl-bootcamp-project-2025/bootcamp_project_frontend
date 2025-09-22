// Card.js
import React from 'react';
import './css/Card.css'; // 导入样式文件

const Card = ({ name, day }) => {
    return (
        <div className="card">
            <h4>{name}</h4>
            <p>第{day}天</p>
        </div>
    );
};

export default Card;
