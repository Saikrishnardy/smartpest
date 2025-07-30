import React from 'react';

function Sidebar({ children }) {
  return (
    <aside style={{ width: 220, background: '#f0f0f0', minHeight: '100vh', padding: 20 }}>
      {children || <div>Sidebar</div>}
    </aside>
  );
}

export default Sidebar;