import React, { useState } from 'react';
import { User } from 'lucide-react';

export default function ImageWithFallback({ src, alt, className, fallbackIcon = User }) {
  const [imageError, setImageError] = useState(false);
  
  const FallbackIcon = fallbackIcon;
  
  if (!src || imageError) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <FallbackIcon className="w-6 h-6 text-gray-400" />
      </div>
    );
  }
  
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setImageError(true)}
    />
  );
}