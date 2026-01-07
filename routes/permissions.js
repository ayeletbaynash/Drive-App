const express = require('express')
const router = express.Router({ mergeParams: true })
const controller = require('../controllers/permissions')
const verifyToken = require('../middleware/auth');

// Protecting all permission routes
router.use(verifyToken);

router.route('/')
    .get(controller.getPermissionByFileId)
    .post(controller.postPermission)

router.route('/:pId')
    .patch(controller.patchPermission)
    .delete(controller.deletePermission)

module.exports = router