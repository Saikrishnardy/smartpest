import React from 'react';

function FileUpload({ onChange, accept }) {
  return (
    <input type="file" onChange={onChange} accept={accept} />
  );
}

export default FileUpload;