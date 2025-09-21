import React from 'react';
import './GlassMorphismCard.less';

interface GlassMorphismCardProps {
  children: React.ReactNode;
  blur?: number;
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const GlassMorphismCard: React.FC<GlassMorphismCardProps> = ({
  children,
  blur = 20,
  opacity = 0.15,
  className = '',
  style = {},
  onClick
}) => {
  const cardStyle: React.CSSProperties = {
    background: `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    border: `1px solid rgba(255, 255, 255, ${Math.min(opacity * 2, 0.3)})`,
    boxShadow: `
      0 8px 32px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, ${Math.min(opacity * 3, 0.4)})
    `,
    ...style
  };

  return (
    <div 
      className={`glass-morphism-card ${className}`}
      style={cardStyle}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default GlassMorphismCard;
