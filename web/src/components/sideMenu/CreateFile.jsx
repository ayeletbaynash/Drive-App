import React from 'react';

const CreateFile = ({ onSuccess }) => {
  const handleClick = () => {
    const fileName = prompt("Enter file name:");

    if (fileName) {
      alert("File '" + fileName + "' registered!");
      onSuccess();
    }
  };

  return (
    <button onClick={handleClick}>
      New File
    </button>
  );
};

export default CreateFile;