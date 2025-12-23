// Counter to assign unique IDs to files/folders
let fIdCounter = 0

// Array to store all files and folders in memory
const all_files = []

// GET all files/folders
const getFiles = () => all_files  // Returns the array of all files/folders

// GET a single file/folder by ID
const getFileById = (id) => all_files.find(f => f.id === id)  // Finds a file/folder by its unique ID

// POST a new file or folder
// fileData should contain: {user_id, name, type, parent_id(optional)}
const postFile = (fileData) => {
    const { user_id, name, type, parent_id = null } = fileData

    // Validate required fields
    if (!user_id || !name || !type) {
        throw new Error('Missing required fields')
    }

    // Validate type
    if (!['file', 'folder'].includes(type)) {
        throw new Error('Invalid type, must be "file" or "folder"')
    }

    // Validate parent folder (if provided)
    if (parent_id !== null) {
        const parent = all_files.find(f => f.id === parent_id)
        if (!parent || parent.type !== 'folder') {
            throw new Error('Invalid parent folder')
        }
    }

    const newFile = {
        id: fIdCounter++, // assign unique ID
        user_id, // owner of the file/folder
        name, // visible name
        type, // "file" or "folder"
        parent_id, // parent folder ID, null if root
        created_at: new Date().toISOString() // timestamp
    }

    all_files.push(newFile) // save to memory
    return newFile
}

// PATCH/update an existing file/folder by ID
const patchFile = (id, data) => {
    const index = all_files.findIndex(f => f.id === id)
    if (index === -1) return false // file/folder not found

    // Only allow updating certain fields
    const allowedFields = ['name', 'parent_id']
    for (let key of allowedFields) {
        if (key in data) {
            all_files[index][key] = data[key]
        }
    }
    return true
}

// DELETE a file/folder by ID
const deleteFile = (id) => {
    const index = all_files.findIndex(f => f.id === id)
    if (index === -1) return false // file/folder not found
    all_files.splice(index, 1) // remove the file/folder itself
    return true
}

// Export functions to use in server/controllers
module.exports = {
    getFiles,
    getFileById,
    postFile,
    patchFile,
    deleteFile
}