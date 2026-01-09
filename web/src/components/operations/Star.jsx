import { useFileActions } from '../FileContext';

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
        <button onClick={handleClick}>
            {isStarred ? 'Remove from Starred' : 'Add to Starred'}
        </button>
    );
};

export default Star;