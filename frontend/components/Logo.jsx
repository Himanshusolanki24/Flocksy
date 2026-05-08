import React from 'react';

const Logo = ({ className = "h-10 w-auto" }) => {
  return (
    <img 
      src="/logo-icon.png" 
      alt="Growchick Logo Icon" 
      className={`${className} object-contain`} 
    />
  );
};

export default Logo;
