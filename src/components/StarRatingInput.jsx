import { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const StarRatingInput = ({ rating = 0, onRate, readOnly = false, size = 28 }) => {
  const [hovered, setHovered] = useState(0);

  const handleClick = (value) => {
    if (!readOnly && onRate) {
      onRate(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (!readOnly) {
      setHovered(value);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHovered(0);
    }
  };

  return (
    <div className="star-rating-input d-flex align-items-center gap-1" style={{ cursor: readOnly ? 'default' : 'pointer' }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= (hovered || rating);
        return (
          <FaStar
            key={star}
            size={size}
            className={`star-rating-icon ${isActive ? 'star-active' : 'star-inactive'} ${!readOnly ? 'star-clickable' : ''}`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            style={{
              transition: 'all 0.15s ease',
              transform: !readOnly && hovered >= star ? 'scale(1.2)' : 'scale(1)',
            }}
          />
        );
      })}
      {!readOnly && (
        <span className="fw-bold ms-2" style={{ color: '#ff8a00', fontSize: `${size * 0.9}px`, minWidth: '30px' }}>
          {hovered || rating || 0}/5
        </span>
      )}
    </div>
  );
};

export default StarRatingInput;

