import React from 'react';

function Card({ children, style, onClick, ...props }) {
  return (
    <div 
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: 8, padding: 20, background: '#fff', margin: 10, ...style }}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;