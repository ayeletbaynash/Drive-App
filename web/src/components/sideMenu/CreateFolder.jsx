const CreateFolder = ({ onSuccess }) => {
  const handleClick = () => {
    const folderName = prompt("Enter folder name:");

    if (folderName) {
      alert("Folder '" + folderName + "' registered!");
      onSuccess();
    }
  };

  return (
    <button onClick={handleClick}>
      New Folder
    </button>
  );
};

export default CreateFolder;