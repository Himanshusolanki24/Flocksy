import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Card = ({
  children,
  className = '',
  hover = true,
  onClick
}) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (!hover || !cardRef.current) return;

    const card = cardRef.current;

    const handleMouseEnter = () => {
      gsap.to(card, {
        y: -8,
        scale: 1.02,
        duration: 0.3,
        ease: 'power2.out',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hover]);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={`
        bg-white rounded-2xl shadow-lg p-6
        transition-shadow cursor-pointer
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
