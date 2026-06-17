import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  icon,
  ...props
}) => {
  const buttonRef = useRef(null);

  const variants = {
    primary: 'bg-[#1F6F5F] text-white hover:bg-[#2FA084]',
    secondary: 'bg-[#2FA084] text-white hover:bg-[#2FA084]',
    accent: 'bg-[#6FCF97] text-[#1F6F5F] hover:bg-[#2FA084] hover:text-white',
    danger: 'bg-[#1F6F5F] text-white hover:bg-[#2FA084]',
    outline: 'border-2 border-[#1F6F5F] text-[#1F6F5F] hover:bg-[#1F6F5F] hover:text-white',
    ghost: 'text-[#1F6F5F] hover:bg-[#6FCF97]/18',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseEnter = () => {
      gsap.to(button, { scale: 1.05, duration: 0.2, ease: 'power2.out' });
    };

    const handleMouseLeave = () => {
      gsap.to(button, { scale: 1, duration: 0.2, ease: 'power2.out' });
    };

    const handleMouseDown = () => {
      gsap.to(button, { scale: 0.95, duration: 0.1, ease: 'power2.out' });
    };

    const handleMouseUp = () => {
      gsap.to(button, { scale: 1.05, duration: 0.1, ease: 'power2.out' });
    };

    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);
    button.addEventListener('mousedown', handleMouseDown);
    button.addEventListener('mouseup', handleMouseUp);

    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
      button.removeEventListener('mousedown', handleMouseDown);
      button.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      className={`
        font-semibold rounded-full shadow-md transition-colors
        flex items-center justify-center gap-2
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {icon && <span className="text-xl">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
