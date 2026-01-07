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
                    <FolderItem folder={f} onRefresh={onRefresh} />
                ))}
            </div>
            <h2>files</h2>
            <div>
                {files.map(f => (
                    <FileItem file={f} onRefresh={onRefresh} />
                ))}
            </div>
        </div>
    );

};

export default FileViewList;

// import FolderItem from './FolderItem';
// import FileItem from './FileItem';

// const FileViewList = ({ items, onRefresh }) => {
    
//     // 1. שלב דיבוג: נראה בקונסול מה באמת הגיע (האם זו שגיאה? רשימה?)
//     console.log("FileViewList received:", items);

//     // 2. שלב ההגנה: אם items הוא לא מערך (רשימה), נעצור כאן ולא ניתן לקוד לקרוס
//     if (!Array.isArray(items)) {
//         return (
//             <div style={{ padding: '20px', textAlign: 'center', color: 'gray' }}>
//                 <p>No files to display.</p>
//                 {/* אם זה אובייקט עם שגיאה, נציג אותה כדי שנדע מה הבעיה */}
//                 {items?.error && <p style={{ color: 'red' }}>Server Error: {items.error}</p>}
//             </div>
//         );
//     }

//     // 3. אם הגענו לפה, סימן ש-items הוא רשימה תקינה ואפשר להמשיך
//     const folders = items.filter(item => item.type === 'folder');
//     const files = items.filter(item => item.type === 'file');

//     return (
//         <div>
//             {/* הצגת תיקיות רק אם יש */}
//             {folders.length > 0 && (
//                 <>
//                     <h5 style={{ marginTop: '20px', borderBottom: '1px solid #eee' }}>Folders</h5>
//                     <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '10px' }}>
//                         {folders.map(f => (
//                             <FolderItem key={f.id} folder={f} onRefresh={onRefresh} />
//                         ))}
//                     </div>
//                 </>
//             )}

//             {/* הצגת קבצים רק אם יש */}
//             {files.length > 0 && (
//                 <>
//                     <h5 style={{ marginTop: '20px', borderBottom: '1px solid #eee' }}>Files</h5>
//                     <div>
//                         {files.map(f => (
//                             <FileItem key={f.id} file={f} onRefresh={onRefresh} />
//                         ))}
//                     </div>
//                 </>
//             )}

//             {/* מצב שבו הרשימה ריקה אבל תקינה */}
//             {items.length === 0 && <p>This folder is empty.</p>}
//         </div>
//     );
// };

// export default FileViewList;