import FolderItem from './FolderItem';
import FileItem from './FileItem';



const FileViewList = ({items, onRefresh}) =>{
    const folders = items.filter(item => item.type === 'folder');
    const files = items.filter(item => item.type === 'file');
    return(
        <div>
            <h2>folders</h2>
            <div>
                {folders.map(f => (
                    <FolderItem key={f.id} folder={f} onRefresh={onRefresh} />
                ))}
            </div>
            <h2>files</h2>
            <div>
                {files.map(f => (
                    <FileItem key={f.id} file={f} onRefresh={onRefresh} />
                ))}
            </div>
        </div>
    );

};

export default FileViewList;
