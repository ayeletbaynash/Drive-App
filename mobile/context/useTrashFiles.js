import { useFileActions } from './FileContext';

export const useTrashFiles = () => {
  const { deletedFiles, restoreFromFileDeletionList } = useFileActions();

  const handleRestore = async (fileId) => {
    await restoreFromFileDeletionList(fileId);
  };

  return { 
    deletedFiles, 
    handleRestore 
  };
};