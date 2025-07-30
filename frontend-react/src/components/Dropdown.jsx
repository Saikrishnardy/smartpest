import React from 'react';

function Dropdown({ options, value, onChange }) {
  return (
    <select value={value} onChange={onChange}>
      {options.map((opt, idx) => (
        <option key={idx} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}

export default Dropdown;