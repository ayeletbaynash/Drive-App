const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PermissionSchema = new Schema({
    // Link to the File
    file_id: {
        type: Schema.Types.ObjectId,
        ref: 'File',
        required: true
    },
    // Link to the User
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Define allowed permission levels
    permission: {
        type: String,
        enum: ['read', 'write', 'owner'], // Add any other types you use
        required: true
    }
}, { timestamps: true });

// Optional: Ensure a user has only one permission per file (prevents duplicates)
PermissionSchema.index({ file_id: 1, user_id: 1 }, { unique: true });

module.exports = mongoose.model('Permission', PermissionSchema);
