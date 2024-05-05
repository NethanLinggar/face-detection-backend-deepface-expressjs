const UserController = require('../controllers/users.js')

const router = require('express').Router();

router.get('/', UserController.getAllUsers)
router.get('/:id', UserController.getUser)
router.get('/embedding/:id', UserController.getUserEmbedding)
router.get('/verify/:id', UserController.verifyUser)
router.post('/', UserController.createNewUser)
router.patch('/:id', UserController.updateUser)
router.delete('/:id', UserController.deleteUser)

module.exports = router;