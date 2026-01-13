import { useFileActions } from '../FileContext';
import '../../styles/operations.css';

const Star = ({ file, onAction }) => {
    const { toggleStarFile, starredFiles } = useFileActions();

    const isStarred = starredFiles.some((f) => f.id === file.id);

    const handleClick = (e) => {
        e.stopPropagation()
        toggleStarFile(file)

        if (onAction) {
            onAction();
        }
    }

    return (
        <button className="operation-button" onClick={handleClick}>
            {isStarred ? (
                <>
                    <i className="bi bi-star-fill" style={{ color: '#ffc107' }}></i>
                    <span>Remove Star</span>
                </>
            ) : (
                <>
                    <i className="bi bi-star"></i>
                    <span>Add to Starred</span>
                </>
            )}
        </button>
    );
};

export default Star;