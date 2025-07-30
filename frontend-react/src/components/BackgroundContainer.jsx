import React from 'react';

function BackgroundContainer({ children, style }) {
  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', ...style }}>
      {children}
    </div>
  );
}

export default BackgroundContainer;