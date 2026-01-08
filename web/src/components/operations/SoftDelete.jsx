
import { useFileActions } from '../FileContext';


const SoftDelete = ({file}) =>{
    const { addToFileDeletionList} = useFileActions()

    const handleClick= () => {
        addToFileDeletionList(file)
    }

    return(
      <div>
        <button onClick={handleClick}>Delete</button>
      </div>  
    )
}
export default SoftDelete;