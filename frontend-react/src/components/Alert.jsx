import React from 'react';

function Alert({ type = 'info', message }) {
  const colors = {
    info: '#2196f3',
    success: '#4caf50',
    error: '#f44336',
    warning: '#ff9800',
  };
  return (
    <div style={{ background: colors[type], color: '#fff', padding: 10, borderRadius: 4, margin: '10px 0' }}>
      {message}
    </div>
  );
}

export default Alert;