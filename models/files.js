const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileSchema = new Schema({
    // Link to the User who owns this file
    user_id: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    // The name displayed to the user
    name: { 
        type: String, 
        required: true 
    },
    // Unique identifier for the TCP storage (optional for folders)
    physicalName: { 
        type: String 
    },
    // Enum to restrict type to only 'file' or 'folder'
    type: { 
        type: String, 
        enum: ['file', 'folder'], 
        required: true 
    },
    // Pointer to parent folder (null if root)
    parent_id: { 
        type: Schema.Types.ObjectId, 
        ref: 'File', 
        default: null 
    }
}, { timestamps: true }); // Automatically creates 'createdAt' and 'updatedAt'

module.exports = mongoose.model('File', FileSchema);
