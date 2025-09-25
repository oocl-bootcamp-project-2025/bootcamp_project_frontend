import { Building, Camera, Coffee, Compass, Mountain, UtensilsCrossed } from 'lucide-react';

const preferenceOptionsValue = [
  { id: '1', label: '小众探索', icon: Compass, color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { id: '2', label: '文化历史', icon: Building, color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: '3', label: '自然风光', icon: Mountain, color: 'bg-green-100 text-green-700 border-green-200' },
  { id: '4', label: '美食购物', icon: UtensilsCrossed, color: 'bg-red-100 text-red-700 border-red-200' },
  { id: '5', label: '休闲娱乐', icon: Coffee, color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { id: '6', label: '拍照出片', icon: Camera, color: 'bg-pink-100 text-pink-700 border-pink-200' }
];

export default preferenceOptionsValue;