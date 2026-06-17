const Badge = ({ status, size = 'md', pulse = false }) => {
  const styles = {
    healthy: {
      bg: 'bg-[#6FCF97]/24',
      text: 'text-[#1F6F5F]',
      border: 'border-[#2FA084]',
      dot: 'bg-[#2FA084]',
    },
    warning: {
      bg: 'bg-[#EEEEEE]',
      text: 'text-[#1F6F5F]',
      border: 'border-[#2FA084]',
      dot: 'bg-[#2FA084]',
    },
    sick: {
      bg: 'bg-[#1F6F5F]/10',
      text: 'text-[#1F6F5F]',
      border: 'border-[#1F6F5F]',
      dot: 'bg-[#1F6F5F]',
    },
    safe: {
      bg: 'bg-[#6FCF97]/24',
      text: 'text-[#1F6F5F]',
      border: 'border-[#2FA084]',
      dot: 'bg-[#2FA084]',
    },
    danger: {
      bg: 'bg-[#1F6F5F]/10',
      text: 'text-[#1F6F5F]',
      border: 'border-[#1F6F5F]',
      dot: 'bg-[#1F6F5F]',
    },
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const style = styles[status] || styles.safe;

  return (
    <span
      className={`
        inline-flex items-center gap-2 rounded-full
        ${style.bg} ${style.text} ${style.border} border
        ${sizes[size]} font-semibold
      `}
    >
      <span
        className={`
          w-2 h-2 rounded-full ${style.dot}
          ${pulse ? 'animate-pulse' : ''}
        `}
      />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default Badge;
