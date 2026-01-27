import { useMemo } from 'react';
import { useFileActions } from './FileContext'; 

/**
 * A smart hook that filters files.
 * It checks if the file itself is in the trash, or if its parent is in the trash.
 */
export const useFileFilter = (files) => {
    const { deletedFiles } = useFileActions();

    const visibleFiles = useMemo(() => {
        if (!files || !Array.isArray(files)) return [];

        return files.filter(file => {
            const fileId = file.id || file._id;

            const isFileDeleted = deletedFiles.some(d => d.id === fileId);
            if (isFileDeleted) return false;

            if (file.parent_id) {
                const isParentDeleted = deletedFiles.some(d => d.id === file.parent_id);
                if (isParentDeleted) return false;
            }

            return true;
        });
    }, [files, deletedFiles]);

    return visibleFiles;
};