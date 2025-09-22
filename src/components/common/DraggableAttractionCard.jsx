import { Clock, MapPin, MoreVertical } from 'lucide-react';
import { useDrag, useDrop } from 'react-dnd';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

const ITEM_TYPE = 'attraction';

export default function DraggableAttractionCard({
  attraction,
  index,
  dayKey,
  onMove,
  onFindExperts,
  onReplace,
  bookings = []
}) {
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { index, dayKey, attraction },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (draggedItem) => {
      if (draggedItem.index !== index || draggedItem.dayKey !== dayKey) {
        onMove(draggedItem, { index, dayKey });
        draggedItem.index = index;
        draggedItem.dayKey = dayKey;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // 检查是否有专家预约
  const hasBooking = bookings.some(booking =>
    booking.attraction?.id === attraction.id ||
    booking.attraction?.name === attraction.name
  );

  const booking = bookings.find(booking =>
    booking.attraction?.id === attraction.id ||
    booking.attraction?.name === attraction.name
  );

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`
        transition-all duration-200
        ${isDragging ? 'opacity-50 rotate-2 scale-105' : ''}
        ${isOver ? 'transform scale-105' : ''}
      `}
    >
      <Card className={`p-4 cursor-move ${hasBooking ? 'border-orange-300 bg-orange-50' : ''}`}>
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{attraction.name}</h3>
            <p className="text-gray-600 text-sm line-clamp-2 mb-2">
              {attraction.description}
            </p>

            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {attraction.duration}
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {attraction.location || '景点位置'}
              </div>
            </div>

            {/* 显示时间安排 */}
            {attraction.time && (
              <div className="text-sm text-blue-600 mb-2">
                📅 {attraction.time}
              </div>
            )}

            {/* 专家预约状态 */}
            {hasBooking && booking && (
              <div className="bg-orange-100 border border-orange-200 rounded-lg p-2 mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-orange-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-orange-700">
                      {booking.expert.name[0]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-orange-800">
                      已预约 {booking.expert.name}
                    </p>
                    <p className="text-xs text-orange-600">
                      {booking.service} | {booking.serviceDetails.price}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Button variant="ghost" size="sm" className="p-1">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onFindExperts(attraction)}
            >
              找达人
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReplace(attraction.id)}
            >
              替换
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}