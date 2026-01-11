import { useFileActions } from '../FileContext';


const Restore = ({file, onAction}) =>{
    const { restoreFromFileDeletionList} = useFileActions()

    const handleClick= (e) => {
        e.stopPropagation()
        restoreFromFileDeletionList(file.id)
        if (onAction) {
            onAction();
        }
    }

    return(
      <div>
        <button onClick={handleClick}>Restore</button>
      </div>  
    )
}
export default Restore