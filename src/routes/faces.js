const FaceController = require('../controllers/faces.js')

const router = require('express').Router();

router.get('/', FaceController.getAllFaces)
router.post('/', FaceController.createNewFace)

module.exports = router;