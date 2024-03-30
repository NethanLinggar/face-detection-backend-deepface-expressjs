const UserController = require('../controllers/users.js')

const router = require('express').Router();

router.get('/', UserController.getAllUsers)
router.post('/', UserController.createNewUser)
router.patch('/:id', UserController.updateUser)
router.delete('/:id', UserController.deleteUser)

module.exports = router;