import React from 'react';

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', margin: 20 }}>
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
      <span>Page {currentPage} of {totalPages}</span>
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
    </div>
  );
}

export default Pagination;