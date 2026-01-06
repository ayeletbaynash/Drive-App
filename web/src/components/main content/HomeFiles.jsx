
import FileViewList from '../files/FileViewList';

const HomeFiles = ({files, onRefresh}) =>{
    return(
        <div>
            <h1>Home</h1>
            <FileViewList items={files} onRefresh={onRefresh} />
        </div>
    );
};


export default HomeFiles;


