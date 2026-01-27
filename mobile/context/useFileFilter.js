import { useMemo } from 'react';
import { useFileActions } from './FileContext'; // שימי לב: הייבוא קצר יותר כי אנחנו באותה תיקייה

/**
 * הוק חכם שמסנן קבצים.
 * הוא בודק אם הקובץ עצמו באשפה, או אם האבא שלו באשפה.
 */
export const useFileFilter = (files) => {
    // 1. שליפת רשימת המחוקים מהקונטקסט
    const { deletedFiles } = useFileActions();

    const visibleFiles = useMemo(() => {
        if (!files || !Array.isArray(files)) return [];

        return files.filter(file => {
            const fileId = file.id || file._id;

            // א. האם הקובץ עצמו באשפה?
            const isFileDeleted = deletedFiles.some(d => d.id === fileId);
            if (isFileDeleted) return false;

            // ב. האם התיקייה (האבא) שמכילה אותו נמחקה?
            if (file.parent_id) {
                const isParentDeleted = deletedFiles.some(d => d.id === file.parent_id);
                if (isParentDeleted) return false;
            }

            return true;
        });
    }, [files, deletedFiles]);

    return visibleFiles;
};