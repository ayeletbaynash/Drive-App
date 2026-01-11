import { useFileActions } from '../FileContext';
import FileViewList from '../files/FileViewList';

const TrashFiles = () => {
    const { deletedFiles } = useFileActions();

        return (
            <div>
                <h1>Recycle Bin</h1>
                {deletedFiles.length > 0 ? (
                    <FileViewList items={deletedFiles} isTrash={true}/>
                ) : (
                    <p>Your trash is empty.</p>
                )}
            </div>
        );
    };

export default TrashFiles;


