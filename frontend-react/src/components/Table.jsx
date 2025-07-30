import React from 'react';

function Table({ columns, data }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {columns.map((col, idx) => (
            <th key={idx} style={{ border: '1px solid #ddd', padding: 8 }}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            {columns.map((col, j) => (
              <td key={j} style={{ border: '1px solid #ddd', padding: 8 }}>{row[col.accessor]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;