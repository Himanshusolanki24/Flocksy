const Badge = ({ status, size = 'md', pulse = false }) => {
  const styles = {
    healthy: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-500',
      dot: 'bg-green-500',
    },
    warning: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-500',
      dot: 'bg-yellow-500',
    },
    sick: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-500',
      dot: 'bg-red-500',
    },
    safe: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-500',
      dot: 'bg-green-500',
    },
    danger: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-500',
      dot: 'bg-red-500',
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
