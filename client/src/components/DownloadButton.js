import React from 'react';
import axios from 'axios';

function DownloadButton({ analysis }) {
  const handleDownload = async () => {
    const response = await axios.post('/api/excel/download', { analysis }, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'analysis.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return <button onClick={handleDownload}>Download Analysis</button>;
}

export default DownloadButton;
