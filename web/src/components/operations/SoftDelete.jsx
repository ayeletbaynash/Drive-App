
import { useFileActions } from '../FileContext';


const SoftDelete = ({file, onAction}) =>{
    const { addToFileDeletionList} = useFileActions()

    const handleClick= (e) => {
        e.stopPropagation()
        addToFileDeletionList(file)
        if (onAction) {
            onAction();
        }
    }

    return(
      <div>
        <button onClick={handleClick}>Delete</button>
      </div>  
    )
}
export default SoftDelete;