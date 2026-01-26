import { useFileActions } from './FileContext';

export const useTrashFiles = () => {
  // שולפים את רשימת המחוקים ואת הפונקציה לשחזור מהקונטקסט
  const { deletedFiles, restoreFromFileDeletionList } = useFileActions();

  // הפונקציה שתופעל כשנלחץ על Restore
  const handleRestore = async (fileId) => {
    await restoreFromFileDeletionList(fileId);
  };

  return { 
    deletedFiles, 
    handleRestore 
  };
};