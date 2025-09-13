import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 24, className = "" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#667eea', stopOpacity:1}} />
          <stop offset="50%" style={{stopColor:'#764ba2', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#f093fb', stopOpacity:1}} />
        </linearGradient>
        <linearGradient id="lockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#4facfe', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#00f2fe', stopOpacity:1}} />
        </linearGradient>
        <linearGradient id="coinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#ffecd2', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#fcb69f', stopOpacity:1}} />
        </linearGradient>
      </defs>
      
      {/* Main Shield */}
      <path 
        d="M16 4L10 7V16C10 22.6274 13.3726 26 16 26C18.6274 26 22 22.6274 22 16V7L16 4Z" 
        fill="url(#shieldGradient)"
      />
      
      {/* Inner Shield */}
      <path 
        d="M16 6L12 8V16C12 20.4183 14.5817 24 16 24C17.4183 24 20 20.4183 20 16V8L16 6Z" 
        fill="url(#shieldGradient)" 
        opacity="0.8"
      />
      
      {/* Lock Icon */}
      <rect 
        x="13" 
        y="11" 
        width="6" 
        height="4" 
        rx="1" 
        fill="url(#lockGradient)" 
        opacity="0.9"
      />
      <path 
        d="M14 11V9C14 8.44772 14.4477 8 15 8C15.5523 8 16 8.44772 16 9V11" 
        stroke="url(#lockGradient)" 
        strokeWidth="1" 
        fill="none"
      />
      
      {/* Lock Keyhole */}
      <circle cx="15.5" cy="13" r="0.5" fill="white"/>
      <rect x="15.25" y="13" width="0.5" height="1" fill="white"/>
      
      {/* Crypto Coin */}
      <circle cx="16" cy="18" r="2" fill="url(#coinGradient)" opacity="0.9"/>
      <text 
        x="16" 
        y="19.5" 
        textAnchor="middle" 
        fill="white" 
        fontFamily="Arial, sans-serif" 
        fontSize="2" 
        fontWeight="bold"
      >
        ₿
      </text>
    </svg>
  );
};

export default Logo;
